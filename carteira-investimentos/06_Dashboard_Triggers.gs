/**
 * 06_Dashboard_Triggers.gs
 * ----------------------------------------------------------------------------
 *   - atualizarDashboard()  (função obrigatória #7) — trigger horário
 *   - onEdit(e)             (função obrigatória #8) — recalcula ao editar
 *   - instalarTriggers()    — registra os gatilhos hourly + onEdit
 * ----------------------------------------------------------------------------
 */

// Células auxiliares (snapshot de patrimônio para rentabilidade mensal).
const SNAP_MES = 'I1';     // tag "yyyy-mm" do início do mês corrente (na aba Config)
const SNAP_VALOR = 'I2';   // patrimônio RV no início do mês

/* --------------------- #7 — atualizarDashboard() ------------------------- */

/**
 * Recalcula posições/IR/projeção, força a atualização das cotações e preenche
 * os blocos dinâmicos do Dashboard (rentabilidade do mês, próximos proventos,
 * resultado de IR do mês e prejuízo acumulado). Rodada pelo trigger horário.
 */
function atualizarDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  recalcularPosicoes(ss);
  recalcularImposto(ss);
  SpreadsheetApp.flush();          // força recálculo das fórmulas GOOGLEFINANCE
  calcularProjecao();

  preencherRentabilidadeMes_(ss);
  preencherProximosProventos_(ss);
  preencherResumoIR_(ss);

  ss.getSheetByName(ABAS.CONFIG).getRange(CFG.ULTIMA_ATUALIZACAO).setValue(new Date());
}

/** Rentabilidade do mês (R$ e %) via snapshot mensal de patrimônio RV + proventos. */
function preencherRentabilidadeMes_(ss) {
  const shCfg = ss.getSheetByName(ABAS.CONFIG);
  const shDash = ss.getSheetByName(ABAS.DASHBOARD);
  const hoje = new Date();
  const tag = hoje.getFullYear() + '-' + ('0' + (hoje.getMonth() + 1)).slice(-2);

  const patrimRV = somaColuna_(ss.getSheetByName(ABAS.RENDA_VARIAVEL), 9); // col I valor mercado
  let snapTag = String(shCfg.getRange(SNAP_MES).getValue());
  let snapVal = Number(shCfg.getRange(SNAP_VALOR).getValue()) || 0;

  if (snapTag !== tag || snapVal === 0) {
    // Novo mês (ou primeira vez): registra o ponto de partida.
    shCfg.getRange(SNAP_MES).setValue(tag);
    shCfg.getRange(SNAP_VALOR).setValue(patrimRV);
    snapTag = tag; snapVal = patrimRV;
  }

  const proventosMes = proventosDoMes_(ss, hoje.getMonth() + 1, hoje.getFullYear());
  const rentMesRS = (patrimRV - snapVal) + proventosMes;
  const rentMesPct = snapVal > 0 ? rentMesRS / snapVal : 0;
  shDash.getRange(11, 3).setValue(rentMesRS);
  shDash.getRange(12, 3).setValue(rentMesPct);
}

/** Próximos 3 proventos estimados (repete o último provento de cada FII/ativo). */
function preencherProximosProventos_(ss) {
  const shProv = ss.getSheetByName(ABAS.PROVENTOS);
  const shDash = ss.getSheetByName(ABAS.DASHBOARD);
  const lancs = lerLancamentos_(ss), eventos = lerEventos_(ss);

  // Último valor por cota conhecido por ticker.
  const ult = {};
  if (shProv.getLastRow() > 1) {
    const vals = shProv.getRange(2, 1, shProv.getLastRow() - 1, 5).getValues();
    vals.forEach(function (v) {
      if (!v[1]) return;
      const tk = String(v[1]).toUpperCase();
      const d = new Date(v[0]);
      if (!ult[tk] || d > ult[tk].data) ult[tk] = { data: d, valorCota: Number(v[4]) || 0 };
    });
  }

  // Estimativa: próximo pagamento ~1 mês após o último, valor = cota × qtd atual.
  const estimados = [];
  Object.keys(ult).forEach(function (tk) {
    const qtd = replayTicker_(tk, lancs, eventos).qtd;
    if (qtd <= 0) return;
    const prox = new Date(ult[tk].data);
    while (prox <= new Date()) prox.setMonth(prox.getMonth() + 1);
    estimados.push([prox, tk, ult[tk].valorCota * qtd]);
  });
  estimados.sort(function (a, b) { return a[0] - b[0]; });

  shDash.getRange(13, 5, 3, 3).clearContent();
  const top = estimados.slice(0, 3);
  if (top.length) shDash.getRange(13, 5, top.length, 3).setValues(top);
}

/** Resultado de IR do mês atual e prejuízo acumulado disponível. */
function preencherResumoIR_(ss) {
  const shDash = ss.getSheetByName(ABAS.DASHBOARD);
  const shCfg = ss.getSheetByName(ABAS.CONFIG);
  const ano = Number(shCfg.getRange(CFG.ANO_FISCAL).getValue()) || new Date().getFullYear();
  const mes = new Date().getMonth() + 1;

  // Reencadeia a compensação até o mês atual.
  let prejA = 0, prejF = 0, atual = null;
  for (let m = 1; m <= 12; m++) {
    const r = calcularIRMensal(m, ano, prejA, prejF);
    if (m === mes) atual = r;
    prejA = r.prej_acoes_rem; prejF = r.prej_fiis_rem;
  }
  let texto;
  if (!atual || (atual.vendas_acoes === 0 && atual.vendas_fiis === 0)) texto = 'Sem movimento tributável no mês';
  else if (atual.ir_total > 0) texto = 'DARF a pagar: ' + brl_(atual.ir_total);
  else texto = atual.isento ? 'Isento' : 'Sem IR a pagar';
  shDash.getRange(19, 3).setValue(texto)
    .setFontColor(atual && atual.ir_total > 0 ? COR.ALERTA : COR.POSITIVO).setFontWeight('bold');

  // Prejuízo acumulado total (fim do ano fiscal).
  shDash.getRange(20, 3).setValue(prejA + prejF);
}

/* --------------------------- #8 — onEdit(e) ------------------------------ */

/**
 * Gatilho de edição: padroniza ticker em maiúsculas e recalcula posições/IR
 * (ao editar Lançamentos/Eventos) ou a projeção (ao editar Projeção/Config).
 */
function onEdit(e) {
  try {
    if (!e || !e.range) return;
    const sh = e.range.getSheet();
    const nome = sh.getName();
    const col = e.range.getColumn();
    const row = e.range.getRow();

    // Uppercase de ticker.
    if (nome === ABAS.LANCAMENTOS && col === 3 && row > 1) {
      forcarUpper_(e.range);
    }
    if (nome === ABAS.EVENTOS && col === 2 && row > 1) {
      forcarUpper_(e.range);
    }

    const ss = e.source || SpreadsheetApp.getActiveSpreadsheet();
    if (nome === ABAS.LANCAMENTOS || nome === ABAS.EVENTOS) {
      recalcularPosicoes(ss);
      recalcularImposto(ss);
    } else if (nome === ABAS.PROJECAO && col === 3 && row >= 4 && row <= 18) {
      calcularProjecao();
    } else if (nome === ABAS.CONFIG) {
      recalcularPosicoes(ss);
      calcularProjecao();
    }
  } catch (err) {
    // Não interrompe a edição do usuário em caso de erro.
    console.error('onEdit: ' + err);
  }
}

/** Versão instalável do onEdit (mesma lógica; permite operações autenticadas). */
function onEditInstalled(e) { onEdit(e); }

function forcarUpper_(range) {
  const v = range.getValue();
  if (typeof v === 'string' && v !== v.toUpperCase()) range.setValue(v.toUpperCase());
}

/* ------------------------- INSTALAÇÃO DE TRIGGERS ------------------------ */

/**
 * Instala (idempotente) os gatilhos: atualização horária + edição instalável.
 */
function instalarTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (t) {
    const fn = t.getHandlerFunction();
    if (fn === 'atualizarDashboard' || fn === 'onEditInstalled') ScriptApp.deleteTrigger(t);
  });

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  ScriptApp.newTrigger('atualizarDashboard')
    .timeBased().everyHours(1).create();

  ScriptApp.newTrigger('onEditInstalled')
    .forSpreadsheet(ss).onEdit().create();

  ss.toast('Triggers instalados: atualização horária + onEdit.', 'Carteira', 4);
}

/* ------------------------------ UTILITÁRIOS ------------------------------ */

/** Soma uma coluna numérica (a partir da linha 2) de uma aba. */
function somaColuna_(sh, col) {
  if (sh.getLastRow() < 2) return 0;
  const vals = sh.getRange(2, col, sh.getLastRow() - 1, 1).getValues();
  return vals.reduce(function (s, v) { return s + (Number(v[0]) || 0); }, 0);
}

/** Soma dos proventos líquidos (col H) pagos em um mês/ano. */
function proventosDoMes_(ss, mes, ano) {
  const sh = ss.getSheetByName(ABAS.PROVENTOS);
  if (sh.getLastRow() < 2) return 0;
  const vals = sh.getRange(2, 1, sh.getLastRow() - 1, 8).getValues();
  let total = 0;
  vals.forEach(function (v) {
    if (!v[0]) return;
    const d = new Date(v[0]);
    if (d.getMonth() + 1 === mes && d.getFullYear() === ano) total += Number(v[7]) || 0;
  });
  return total;
}

/** Formata número como moeda BRL (para textos). */
function brl_(n) {
  return 'R$ ' + (Number(n) || 0).toLocaleString('pt-BR',
    { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
