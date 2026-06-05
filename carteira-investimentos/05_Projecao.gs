/**
 * 05_Projecao.gs
 * ----------------------------------------------------------------------------
 * Motor de projeção/aposentadoria (aba Projeção, Seções B-E):
 *   - calcularProjecao()    (função obrigatória #4)
 *   - gerarTabelaAnual()    (função obrigatória #5)
 *   - gerarTabelaRetirada() (função obrigatória #6)
 *
 * Todos os cálculos são feitos em VALORES REAIS (rentabilidade já líquida de
 * inflação). Aportes crescem `g` ao ano. Matemática: anuidade crescente
 * (growing annuity) em base mensal.
 * ----------------------------------------------------------------------------
 */

/* ----------------------------- HELPERS MATEMÁTICOS ------------------------ */

/** Converte taxa anual em taxa mensal equivalente. */
function mensal_(anual) { return Math.pow(1 + anual, 1 / 12) - 1; }

/**
 * Valor futuro de anuidade crescente (aportes mensais que crescem `g`/mês).
 * VF = PMT × [(1+r)^n − (1+g)^n] / (r − g)   (r ≠ g)
 * VF = PMT × n × (1+r)^(n−1)                 (r = g)
 */
function vfAnuidadeCrescente_(pmt, r, g, n) {
  if (Math.abs(r - g) < 1e-9) return pmt * n * Math.pow(1 + r, n - 1);
  return pmt * (Math.pow(1 + r, n) - Math.pow(1 + g, n)) / (r - g);
}

/** Patrimônio final = VP composto + VF dos aportes crescentes. */
function patrimonioFinal_(pv, pmt, rAnual, gAnual, anos) {
  const r = mensal_(rAnual), g = mensal_(gAnual), n = Math.round(anos * 12);
  return pv * Math.pow(1 + r, n) + vfAnuidadeCrescente_(pmt, r, g, n);
}

/** PMT nativo (convenção: pagamentos retornam negativo), type = 0. */
function pmt_(r, n, pv, fv) {
  if (Math.abs(r) < 1e-12) return -(pv + fv) / n;
  return -(pv * Math.pow(1 + r, n) + fv) * r / (Math.pow(1 + r, n) - 1);
}

/* ----------------------------- LEITURA DE INPUTS ------------------------- */

function lerParametrosProjecao_(ss) {
  const sh = ss.getSheetByName(ABAS.PROJECAO);
  const g = function (a1) { return Number(sh.getRange(a1).getValue()) || 0; };
  const s = function (a1) { return String(sh.getRange(a1).getValue()).toUpperCase(); };
  return {
    idadeAtual: g(PROJ.IDADE_ATUAL),
    idadeAlvo: g(PROJ.IDADE_ALVO),
    rendaDesejada: g(PROJ.RENDA_DESEJADA),
    patrimonioAtual: g(PROJ.PATRIMONIO_ATUAL),
    aporteMensal: g(PROJ.APORTE_MENSAL),
    crescAporte: g(PROJ.CRESC_APORTE),
    rentReal: g(PROJ.RENT_REAL),
    ipca: g(PROJ.IPCA),
    taxaRetirada: g(PROJ.TAXA_RETIRADA),
    recebeInss: s(PROJ.RECEBE_INSS) === 'SIM',
    valorInss: g(PROJ.VALOR_INSS),
    heranca: g(PROJ.HERANCA),
    rentRetirada: g(PROJ.RET_RENT)
  };
}

/* ------------------------ #4 — calcularProjecao() ------------------------ */

/**
 * Recalcula toda a Seção B da aba Projeção (diagnóstico, projeção, renda
 * passiva, sensibilidade e aporte mínimo) e dispara as tabelas C e D.
 * @return {Object} resumo da projeção.
 */
function calcularProjecao() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(ABAS.PROJECAO);
  const p = lerParametrosProjecao_(ss);

  const anos = Math.max(0, p.idadeAlvo - p.idadeAtual);
  const meses = anos * 12;

  // Bloco 1 — diagnóstico
  const patrimonioNecessario =
    (p.taxaRetirada > 0 ? (p.rendaDesejada * 12 / p.taxaRetirada) : 0) *
    Math.pow(1 + p.ipca, anos);
  const gap = patrimonioNecessario - p.patrimonioAtual;
  const pctObjetivo = patrimonioNecessario > 0 ? p.patrimonioAtual / patrimonioNecessario : 0;

  // Bloco 2 — projeção do patrimônio
  const patrimonioProjetado =
    patrimonioFinal_(p.patrimonioAtual, p.aporteMensal, p.rentReal, p.crescAporte, anos);
  let status;
  if (patrimonioProjetado >= patrimonioNecessario) status = '✅ META ATINGIDA';
  else if (patrimonioProjetado >= 0.7 * patrimonioNecessario) status = '⚠️ ABAIXO DA META';
  else status = '🔴 REVISÃO NECESSÁRIA';

  // Bloco 3 — renda passiva
  const rendaBruta = patrimonioProjetado * p.taxaRetirada / 12;
  const rendaLiquida = rendaBruta * (1 - 0.15);
  const rendaTotal = rendaLiquida + (p.recebeInss ? p.valorInss : 0);

  // ---- Escreve Bloco 1-3 ----
  sh.getRange(PROJ.ANOS_RESTANTES).setValue(anos);
  sh.getRange(PROJ.MESES_RESTANTES).setValue(meses);
  sh.getRange(PROJ.PATRIMONIO_NECESSARIO).setValue(patrimonioNecessario);
  sh.getRange(PROJ.GAP).setValue(gap);
  sh.getRange(PROJ.PCT_OBJETIVO).setValue(pctObjetivo);
  // Barra de progresso textual (robusta a locale): 20 blocos + percentual.
  sh.getRange(PROJ.BARRA_PROGRESSO).setFormula(
    '=REPT("█",ROUND(MIN(1,MAX(0,' + PROJ.PCT_OBJETIVO + '))*20,0))&" "&TEXT(MIN(1,' +
    PROJ.PCT_OBJETIVO + '),"0%")').setFontColor(COR.POSITIVO);
  sh.getRange(PROJ.PATRIMONIO_PROJETADO).setValue(patrimonioProjetado);
  sh.getRange(PROJ.STATUS_META).setValue(status).setFontWeight('bold');
  sh.getRange(PROJ.RENDA_BRUTA).setValue(rendaBruta);
  sh.getRange(PROJ.RENDA_LIQUIDA).setValue(rendaLiquida);
  sh.getRange(PROJ.RENDA_TOTAL_INSS).setValue(rendaTotal);

  // Bloco 4 — sensibilidade 3x3 (rent × fator de aporte)
  const matriz = [];
  PROJ.SENS_RENTS.forEach(function (rent) {
    const linha = [];
    PROJ.SENS_FATORES_APORTE.forEach(function (f) {
      linha.push(patrimonioFinal_(p.patrimonioAtual, p.aporteMensal * f, rent, p.crescAporte, anos));
    });
    matriz.push(linha);
  });
  sh.getRange(PROJ.SENS_FIRST_VAL_ROW, PROJ.SENS_FIRST_VAL_COL, 3, 3).setValues(matriz);
  aplicarCondMeta_(sh,
    rangeA1_(PROJ.SENS_FIRST_VAL_ROW, PROJ.SENS_FIRST_VAL_COL, 3, 3), patrimonioNecessario);

  // Bloco 5 — aporte mínimo (3 cenários)
  const aportes = PROJ.APORTE_MIN_RENTS.map(function (rent) {
    const r = mensal_(rent);
    const valor = -pmt_(r, meses, -p.patrimonioAtual, patrimonioNecessario);
    return [Math.max(0, valor)];
  });
  sh.getRange(PROJ.APORTE_MIN_FIRST_ROW, 3, 3, 1).setValues(aportes);

  // Seções C e D
  gerarTabelaAnual();
  gerarTabelaRetirada();
  preencherNotas_(sh, p);

  // Carimbo de atualização.
  ss.getSheetByName(ABAS.CONFIG).getRange(CFG.ULTIMA_ATUALIZACAO).setValue(new Date());

  return {
    patrimonio_projetado: patrimonioProjetado,
    patrimonio_necessario: patrimonioNecessario,
    meta_atingida: patrimonioProjetado >= patrimonioNecessario,
    aporte_minimo_necessario: aportes[1][0], // cenário 7%
    pct_objetivo: pctObjetivo,
    renda_mensal_projetada: rendaLiquida,
    status: status
  };
}

/* --------------------- #5 — gerarTabelaAnual() (Seção C) ----------------- */

/**
 * Tabela ano a ano até a aposentadoria (juros compostos + aportes mensais
 * crescentes, simulação mensal agregada por ano).
 */
function gerarTabelaAnual() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(ABAS.PROJECAO);
  const p = lerParametrosProjecao_(ss);
  const anos = Math.max(0, p.idadeAlvo - p.idadeAtual);
  const necessario =
    (p.taxaRetirada > 0 ? (p.rendaDesejada * 12 / p.taxaRetirada) : 0) *
    Math.pow(1 + p.ipca, anos);

  // Limpa a área da tabela.
  sh.getRange(PROJ.TAB_ANUAL_FIRST, 1, PROJ.TAB_ANUAL_MAX, 8).clearContent();

  const r = mensal_(p.rentReal), g = mensal_(p.crescAporte);
  let balance = p.patrimonioAtual, t = 0; // t = índice de mês global
  const linhas = [];
  const anoBase = new Date().getFullYear();
  for (let y = 1; y <= anos; y++) {
    const inicio = balance;
    let aportesAno = 0;
    for (let m = 0; m < 12; m++) {
      const aporte = p.aporteMensal * Math.pow(1 + g, t);
      balance = balance * (1 + r) + aporte;
      aportesAno += aporte;
      t++;
    }
    const rendimento = balance - inicio - aportesAno;
    linhas.push([
      anoBase + y, p.idadeAtual + y, aportesAno, inicio, rendimento, balance,
      necessario > 0 ? balance / necessario : 0, necessario
    ]);
  }
  if (linhas.length) {
    const rng = sh.getRange(PROJ.TAB_ANUAL_FIRST, 1, linhas.length, 8);
    rng.setValues(linhas);
    sh.getRange(PROJ.TAB_ANUAL_FIRST, 3, linhas.length, 4).setNumberFormat(FMT.MOEDA);
    sh.getRange(PROJ.TAB_ANUAL_FIRST, 7, linhas.length, 1).setNumberFormat(FMT.PERC);
    sh.getRange(PROJ.TAB_ANUAL_FIRST, 8, linhas.length, 1).setNumberFormat(FMT.MOEDA);
    aplicarZebra_(sh, PROJ.TAB_ANUAL_FIRST, linhas.length, 8);
  }
}

/* ------------------- #6 — gerarTabelaRetirada() (Seção D) ---------------- */

/**
 * Simula a fase de retirada: a cada ano retira a renda desejada (ajustada
 * pelo IPCA) e rende à taxa conservadora informada, até esgotar o patrimônio.
 */
function gerarTabelaRetirada() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(ABAS.PROJECAO);
  const p = lerParametrosProjecao_(ss);
  const anos = Math.max(0, p.idadeAlvo - p.idadeAtual);

  let balance = patrimonioFinal_(p.patrimonioAtual, p.aporteMensal, p.rentReal, p.crescAporte, anos);
  // Retirada mensal desejada, levada a valor futuro na data da aposentadoria.
  let retiradaMensal = p.rendaDesejada * Math.pow(1 + p.ipca, anos);
  const rAnual = p.rentRetirada || 0.05;
  const r = mensal_(rAnual);

  sh.getRange(PROJ.TAB_RET_FIRST, 1, PROJ.TAB_RET_MAX, 6).clearContent();

  const linhas = [];
  const anoBase = new Date().getFullYear() + anos;
  let esgotaAno = '';
  const MAX = Math.min(PROJ.TAB_RET_MAX, 60);
  for (let y = 1; y <= MAX; y++) {
    const inicio = balance;
    let retiradaAno = 0;
    for (let m = 0; m < 12 && balance > 0; m++) {
      balance = balance * (1 + r) - retiradaMensal;
      retiradaAno += retiradaMensal;
    }
    const rendimento = balance - inicio + retiradaAno;
    if (balance < 0) balance = 0;
    linhas.push([anoBase + y, p.idadeAlvo + y, inicio, retiradaAno, rendimento, balance]);
    if (balance <= 0 && esgotaAno === '') { esgotaAno = anoBase + y; break; }
    // Ajusta a retirada do próximo ano pela inflação (mantém poder de compra).
    retiradaMensal = retiradaMensal * (1 + p.ipca);
  }
  if (linhas.length) {
    const rng = sh.getRange(PROJ.TAB_RET_FIRST, 1, linhas.length, 6);
    rng.setValues(linhas);
    sh.getRange(PROJ.TAB_RET_FIRST, 3, linhas.length, 4).setNumberFormat(FMT.MOEDA);
    aplicarZebra_(sh, PROJ.TAB_RET_FIRST, linhas.length, 6);
  }
  sh.getRange(PROJ.RET_DURACAO).setValue(
    esgotaAno === '' ? 'Não se esgota em ' + MAX + ' anos 🎉'
                     : 'Esgota em ' + esgotaAno + ' (' + linhas.length + ' anos)');
}

/* ----------------------------- SEÇÃO E — NOTAS --------------------------- */

function preencherNotas_(sh, p) {
  const notas = [
    '• Cálculo em valores reais (inflação de ' + (p.ipca * 100).toFixed(1) + '% já descontada).',
    '• Taxa de retirada segura: ' + (p.taxaRetirada * 100).toFixed(1) +
      '% — baseada na Regra dos 4% (Trinity Study).',
    '• Aportes crescem ' + (p.crescAporte * 100).toFixed(1) + '% ao ano.',
    '• Rentabilidade real considerada: ' + (p.rentReal * 100).toFixed(1) + '% a.a.',
    '• Não considera herança, venda de imóvel ou outros ativos externos no patrimônio projetado.',
    '• Rentabilidade passada não garante rentabilidade futura.'
  ];
  sh.getRange(PROJ.SECAO_E_FIRST, 2, notas.length, 1)
    .setValues(notas.map(function (n) { return [n]; }))
    .setFontColor(COR.NEUTRO);
}

/* ----------------------------- UTILITÁRIOS ------------------------------- */

/** Converte (linha, col, nLin, nCol) em notação A1. */
function rangeA1_(row, col, nRow, nCol) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(ABAS.PROJECAO).getRange(row, col, nRow, nCol).getA1Notation();
}

/** Formatação condicional verde≥meta / vermelho<meta para uma matriz. */
function aplicarCondMeta_(sh, a1, meta) {
  const rng = sh.getRange(a1);
  const regras = sh.getConditionalFormatRules().filter(function (rule) {
    // mantém regras que não sejam desta faixa
    return rule.getRanges().every(function (rr) { return rr.getA1Notation() !== a1; });
  });
  regras.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThanOrEqualTo(meta).setBackground('#D6F0E4').setFontColor(COR.POSITIVO)
    .setRanges([rng]).build());
  regras.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(meta).setBackground('#F7DDD2').setFontColor(COR.NEGATIVO)
    .setRanges([rng]).build());
  sh.setConditionalFormatRules(regras);
}

/** Sincroniza o patrimônio atual da Projeção com o total da carteira. */
function sincronizarPatrimonio_(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  const total = patrimonioCarteira_(ss);
  if (total > 0) ss.getSheetByName(ABAS.PROJECAO).getRange(PROJ.PATRIMONIO_ATUAL).setValue(total);
}

/** Total da carteira = valor de mercado RV (ou custo se sem cotação) + RF aplicado. */
function patrimonioCarteira_(ss) {
  const shRV = ss.getSheetByName(ABAS.RENDA_VARIAVEL);
  const shRF = ss.getSheetByName(ABAS.RENDA_FIXA);
  let rv = 0;
  if (shRV.getLastRow() > 1) {
    const vals = shRV.getRange(2, 6, shRV.getLastRow() - 1, 4).getValues(); // F custo .. I valor
    vals.forEach(function (v) {
      const custo = Number(v[0]) || 0, valor = Number(v[3]) || 0;
      rv += valor > 0 ? valor : custo;
    });
  }
  let rf = 0;
  if (shRF.getLastRow() > 1) {
    const vals = shRF.getRange(2, 7, shRF.getLastRow() - 1, 1).getValues();
    vals.forEach(function (v) { rf += Number(v[0]) || 0; });
  }
  return rv + rf;
}

/** Item de menu: sincroniza patrimônio e recalcula projeção. */
function sincronizarPatrimonioMenu_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  sincronizarPatrimonio_(ss);
  calcularProjecao();
  ss.toast('Patrimônio sincronizado e projeção recalculada.', 'Carteira', 3);
}
