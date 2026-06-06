/**
 * 04_Calculos.gs
 * ----------------------------------------------------------------------------
 * Motor de cálculo da carteira:
 *   - replayTicker_()       : reprocessa Lançamentos + Eventos em ordem
 *                             cronológica e devolve qtd, preço médio, custo,
 *                             vendas realizadas e ajustes de eventos.
 *   - calcularPrecoMedio()      (função obrigatória #1)
 *   - calcularQuantidadeAtual() (função obrigatória #2)
 *   - calcularIRMensal()        (função obrigatória #3)
 *   - recalcularPosicoes()  : escreve a aba Renda Variável e os campos
 *                             antes/depois da aba Eventos.
 *   - recalcularImposto()   : escreve a aba Imposto de Renda mês a mês,
 *                             encadeando a compensação de prejuízo.
 * ----------------------------------------------------------------------------
 */

/* --------------------------- LEITURA DE DADOS ----------------------------- */

/** Lê Lançamentos como lista de objetos (ignora linhas vazias). */
function lerLancamentos_(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(ABAS.LANCAMENTOS);
  const ult = sh.getLastRow();
  if (ult < 2) return [];
  const vals = sh.getRange(2, 1, ult - 1, 9).getValues();
  const out = [];
  vals.forEach(function (v, i) {
    if (v[2] === '' || v[0] === '') return; // sem ticker ou sem data
    out.push({
      row: i + 2,
      data: new Date(v[0]),
      tipo: String(v[1]).toUpperCase(),
      ticker: String(v[2]).toUpperCase(),
      corretora: v[3],
      qtd: Number(v[4]) || 0,
      preco: Number(v[5]) || 0,
      taxas: Number(v[6]) || 0
    });
  });
  return out;
}

/** Lê Eventos Corporativos como lista de objetos. */
function lerEventos_(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(ABAS.EVENTOS);
  const ult = sh.getLastRow();
  if (ult < 2) return [];
  const vals = sh.getRange(2, 1, ult - 1, 10).getValues();
  const out = [];
  vals.forEach(function (v, i) {
    if (v[1] === '' || v[0] === '') return;
    out.push({
      row: i + 2,
      data: new Date(v[0]),
      ticker: String(v[1]).toUpperCase(),
      tipo: String(v[2]).toUpperCase(),
      descricao: v[3],
      fator: Number(v[4]) || 0,
      custoAdicional: Number(v[9]) || 0
    });
  });
  return out;
}

/** Mapa ticker -> classe de ativo (lido da aba Configurações). */
function tipoPorTicker_(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(ABAS.CONFIG);
  const ult = sh.getLastRow();
  const mapa = {};
  if (ult >= CFG.TICKERS_FIRST_ROW) {
    const vals = sh.getRange(CFG.TICKERS_FIRST_ROW, 2,
                             ult - CFG.TICKERS_FIRST_ROW + 1, 2).getValues();
    vals.forEach(function (v) {
      if (v[0]) mapa[String(v[0]).toUpperCase()] = String(v[1]).toUpperCase();
    });
  }
  return mapa;
}

/* ------------------------- MOTOR DE REPROCESSAMENTO ----------------------- */

/**
 * Reprocessa, em ordem cronológica, todos os eventos econômicos de um ticker.
 * @return {Object} { qtd, pm, custoTotal, vendas[], eventosCalc[] }
 *   vendas: [{ data, vendaBruta, custo, lucro }]
 *   eventosCalc: [{ row, qtdAntes, qtdDepois, pmAntes, pmDepois }]
 */
function replayTicker_(ticker, lancs, eventos) {
  ticker = String(ticker).toUpperCase();
  const eventosT = [];

  // Junta lançamentos e eventos do ticker num único fluxo ordenado por data.
  lancs.forEach(function (l) {
    if (l.ticker === ticker) eventosT.push({ kind: 'L', data: l.data, l: l });
  });
  eventos.forEach(function (e) {
    if (e.ticker === ticker) eventosT.push({ kind: 'E', data: e.data, e: e });
  });
  // Ordena por data; em empate, lançamentos antes de eventos corporativos.
  eventosT.sort(function (a, b) {
    const d = a.data - b.data;
    if (d !== 0) return d;
    return (a.kind === 'L' ? 0 : 1) - (b.kind === 'L' ? 0 : 1);
  });

  let qtd = 0, custo = 0; // custo = base de custo total
  const vendas = [];
  const eventosCalc = [];
  const pm = function () { return qtd > 0 ? custo / qtd : 0; };

  eventosT.forEach(function (item) {
    if (item.kind === 'L') {
      const l = item.l;
      switch (l.tipo) {
        case 'COMPRA':
        case 'SUBSCRIÇÃO':
          qtd += l.qtd;
          custo += l.qtd * l.preco + l.taxas;
          break;
        case 'VENDA': {
          const pmAtual = pm();
          const custoVend = l.qtd * pmAtual;
          const vendaBruta = l.qtd * l.preco;
          const lucro = vendaBruta - l.taxas - custoVend;
          vendas.push({ data: l.data, vendaBruta: vendaBruta, custo: custoVend, lucro: lucro });
          qtd -= l.qtd;
          custo -= custoVend;
          if (qtd < 1e-9) { qtd = 0; custo = 0; }
          break;
        }
        // DIVIDENDO / JCP não alteram qtd/custo (proventos vivem em Proventos).
        default:
          break;
      }
    } else {
      const e = item.e;
      const qtdAntes = qtd, pmAntes = pm();
      switch (e.tipo) {
        case 'SPLIT': // N:1 -> qtd × N, pm / N (custo inalterado)
          qtd = qtd * e.fator;
          break;
        case 'GRUPAMENTO': // 1:N -> qtd / N, pm × N (custo inalterado)
          if (e.fator) qtd = qtd / e.fator;
          break;
        case 'BONIFICAÇÃO': // X (fração) -> qtd × (1+X), pm = custo/novaQtd
          qtd = qtd * (1 + e.fator);
          break;
        case 'SUBSCRIÇÃO': // soma cotas subscritas + custo adicional
          qtd = qtd + e.fator;            // fator = qtd subscrita
          custo = custo + e.custoAdicional;
          break;
        case 'INCORPORAÇÃO': // converte qtd pelo fator (mantém custo)
          if (e.fator) qtd = qtd * e.fator;
          break;
        default:
          break;
      }
      eventosCalc.push({
        row: e.row, qtdAntes: qtdAntes, qtdDepois: qtd,
        pmAntes: pmAntes, pmDepois: pm()
      });
    }
  });

  return { qtd: qtd, pm: pm(), custoTotal: custo, vendas: vendas, eventosCalc: eventosCalc };
}

/* ----------------------- FUNÇÕES OBRIGATÓRIAS 1-3 ------------------------- */

/**
 * #1 — Preço médio ajustado atual de um ticker (considera eventos).
 * Pode ser usada como função de planilha: =calcularPrecoMedio("PETR4")
 */
function calcularPrecoMedio(ticker) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return replayTicker_(ticker, lerLancamentos_(ss), lerEventos_(ss)).pm;
}

/**
 * #2 — Quantidade atual de um ticker (compras, vendas, splits, grupamentos,
 * bonificações e subscrições). Uso: =calcularQuantidadeAtual("PETR4")
 */
function calcularQuantidadeAtual(ticker) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return replayTicker_(ticker, lerLancamentos_(ss), lerEventos_(ss)).qtd;
}

/**
 * #3 — IR a pagar para um mês/ano específico, seguindo todas as regras.
 * @param {number} mes 1..12
 * @param {number} ano ex.: 2026
 * @param {number=} prejAcoesAnt prejuízo acumulado anterior do grupo 15% (ações/BDR/ETF)
 * @param {number=} prejFiisAnt  prejuízo acumulado anterior de FIIs
 * @return {Object} { vendas_acoes, vendas_fiis, lucro_acoes, lucro_fiis,
 *                    isento, ir_acoes, ir_fiis, ir_total,
 *                    prej_acoes_rem, prej_fiis_rem, status }
 */
function calcularIRMensal(mes, ano, prejAcoesAnt, prejFiisAnt) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  prejAcoesAnt = Number(prejAcoesAnt) || 0;
  prejFiisAnt = Number(prejFiisAnt) || 0;

  const lancs = lerLancamentos_(ss);
  const eventos = lerEventos_(ss);
  const tipos = tipoPorTicker_(ss);

  // Tickers únicos que tiveram venda.
  const tickers = {};
  lancs.forEach(function (l) { if (l.tipo === 'VENDA') tickers[l.ticker] = true; });

  // Agrega vendas do mês por grupo.
  let vendasIsentaveis = 0; // AÇÃO + BDR (contam para o teto de R$20k)
  let lucro15 = 0;          // lucro do grupo 15% (AÇÃO + BDR + ETF/STOCK)
  let vendasEtf = 0, lucroEtfNaoIsentavel = 0;
  let vendasFiis = 0, lucroFiis = 0;

  Object.keys(tickers).forEach(function (tk) {
    const cat = categoriaIR(tipos[tk] || 'AÇÃO');
    const r = replayTicker_(tk, lancs, eventos);
    r.vendas.forEach(function (v) {
      const d = v.data;
      if (d.getMonth() + 1 !== mes || d.getFullYear() !== ano) return;
      if (cat === 'FIIS') {
        vendasFiis += v.vendaBruta; lucroFiis += v.lucro;
      } else if (cat === 'ETF') {
        vendasEtf += v.vendaBruta; lucro15 += v.lucro; lucroEtfNaoIsentavel += v.lucro;
      } else { // ACOES (AÇÃO/BDR)
        vendasIsentaveis += v.vendaBruta; lucro15 += v.lucro;
      }
    });
  });

  const vendasAcoesDisplay = vendasIsentaveis + vendasEtf;

  // Isenção: só vale para AÇÃO/BDR e quando o total de vendas desse grupo ≤ 20k.
  const isento = (vendasIsentaveis > 0 || vendasEtf === 0) &&
                 vendasIsentaveis <= IR.LIMITE_ISENCAO_ACOES;

  // ---- Grupo 15% (ações) ----
  // Parte isentável (ações/BDR): se isento e sem ETF, lucro não tributa.
  let lucroTributavel15;
  if (vendasEtf > 0) {
    // ETF nunca isenta. Ações/BDR isentam se ≤ 20k.
    const lucroAcoesParte = lucro15 - lucroEtfNaoIsentavel;
    const lucroAcoesTrib = (vendasIsentaveis <= IR.LIMITE_ISENCAO_ACOES) ? 0 : lucroAcoesParte;
    lucroTributavel15 = lucroAcoesTrib + lucroEtfNaoIsentavel;
  } else {
    lucroTributavel15 = isento ? 0 : lucro15;
  }

  // Compensação de prejuízo (mesma categoria) — grupo 15%.
  let base15 = lucroTributavel15 - prejAcoesAnt;
  let prejAcoesRem = 0, ir_acoes = 0;
  if (base15 > 0) {
    ir_acoes = base15 * IR.ALIQUOTA_ACOES;
  } else {
    prejAcoesRem = -base15; // sobra de prejuízo p/ próximos meses
  }
  // Se o mês teve prejuízo próprio (lucro15 < 0) e não isento, acumula.
  if (!isento && lucro15 < 0) {
    prejAcoesRem = prejAcoesAnt + Math.max(0, -lucro15);
    ir_acoes = 0;
  }

  // ---- FIIs (20%, sem isenção) ----
  let baseFiis = lucroFiis - prejFiisAnt;
  let prejFiisRem = 0, ir_fiis = 0;
  if (baseFiis > 0) {
    ir_fiis = baseFiis * IR.ALIQUOTA_FIIS;
  } else {
    prejFiisRem = -baseFiis;
  }

  const ir_total = ir_acoes + ir_fiis;
  let status;
  if (vendasAcoesDisplay === 0 && vendasFiis === 0) status = 'SEM MOVIMENTO';
  else if (ir_total > 0) status = 'DARF A PAGAR';
  else if (prejAcoesRem > 0 || prejFiisRem > 0) status = 'PREJUÍZO ACUMULADO';
  else status = 'ISENTO';

  return {
    vendas_acoes: vendasAcoesDisplay,
    vendas_fiis: vendasFiis,
    custo_acoes: 0, // detalhado na escrita da aba
    lucro_acoes: lucro15,
    lucro_fiis: lucroFiis,
    isento: isento,
    ir_acoes: ir_acoes,
    ir_fiis: ir_fiis,
    ir_total: ir_total,
    prej_acoes_rem: prejAcoesRem,
    prej_fiis_rem: prejFiisRem,
    status: status
  };
}

/* ----------------------- ESCRITA DA RENDA VARIÁVEL ----------------------- */

/**
 * Recalcula a aba Renda Variável (qtd, PM, custo) e os campos antes/depois
 * da aba Eventos. Cotações continuam vivas via GOOGLEFINANCE.
 */
function recalcularPosicoes(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  const lancs = lerLancamentos_(ss);
  const eventos = lerEventos_(ss);
  const tipos = tipoPorTicker_(ss);

  // Conjunto de tickers presentes (config + lançamentos).
  const setTk = {};
  Object.keys(tipos).forEach(function (t) { setTk[t] = true; });
  lancs.forEach(function (l) {
    if (['COMPRA', 'VENDA', 'SUBSCRIÇÃO'].indexOf(l.tipo) >= 0) setTk[l.ticker] = true;
  });

  const shRV = ss.getSheetByName(ABAS.RENDA_VARIAVEL);
  // Limpa área de dados anterior.
  if (shRV.getLastRow() > 1) {
    shRV.getRange(2, 1, shRV.getLastRow() - 1, 14).clearContent();
  }

  const setores = setoresPadrao_();
  const linhas = [];
  const eventoUpdates = {}; // row -> [qtdAntes, qtdDepois, pmAntes, pmDepois]

  Object.keys(setTk).sort().forEach(function (tk) {
    const r = replayTicker_(tk, lancs, eventos);
    if (r.qtd <= 0) {           // posição zerada: registra ajustes de evento mesmo assim
      r.eventosCalc.forEach(function (ec) {
        eventoUpdates[ec.row] = [ec.qtdAntes, ec.qtdDepois, ec.pmAntes, ec.pmDepois];
      });
      return;
    }
    const tipo = tipos[tk] || 'AÇÃO';
    linhas.push({ ticker: tk, tipo: tipo, setor: setores[tk] || '—',
                  qtd: r.qtd, pm: r.pm, custo: r.custoTotal });
    r.eventosCalc.forEach(function (ec) {
      eventoUpdates[ec.row] = [ec.qtdAntes, ec.qtdDepois, ec.pmAntes, ec.pmDepois];
    });
  });

  // Escreve linhas + fórmulas vivas (cotação, valor, L/P, % carteira, YoC).
  const PROV = "'" + ABAS.PROVENTOS + "'!";
  // Referência absoluta ao câmbio USD/BRL em Configurações, ex.: 'Configurações'!$C$4
  const m = CFG.USD_BRL.match(/^([A-Z]+)(\d+)$/);
  const CAMBIO = "'" + ABAS.CONFIG + "'!$" + m[1] + '$' + m[2];
  linhas.forEach(function (d, i) {
    const r = i + 2;
    // Cotação via GOOGLEFINANCE referenciando a CÉLULA do ticker (coluna A),
    // sem sufixo ".SA". Ativos em USD (tipo STOCK) são convertidos para R$.
    var precoF = '=IFERROR(GOOGLEFINANCE($A' + r + ',"price"),0)';
    if (d.tipo === 'STOCK') {
      precoF += '*IFERROR(GOOGLEFINANCE("currency:USDBRL"),' + CAMBIO + ')';
    }
    const variacaoF = '=IFERROR(GOOGLEFINANCE($A' + r + ',"changepct")/100,0)';
    const fxValores = [
      d.ticker, d.tipo, d.setor, d.qtd, d.pm,
      '=D' + r + '*E' + r,                                   // F custo
      precoF,                                                // G cotação (R$)
      variacaoF,                                             // H variação do dia
      '=D' + r + '*G' + r,                                   // I valor mercado
      '=I' + r + '-F' + r,                                   // J L/P R$
      '=IFERROR(I' + r + '/F' + r + '-1,0)',                 // K L/P %
      '=IFERROR(I' + r + '/SUM($I$2:$I),0)',                 // L % carteira
      '=IFERROR(SUMIF(' + PROV + 'B:B,A' + r + ',' + PROV + 'H:H)/F' + r + ',0)', // M YoC
      '=NOW()'                                               // N últ. atualização
    ];
    shRV.getRange(r, 1, 1, 14).setValues([fxValores.slice(0, 5).concat(new Array(9).fill(''))]);
    // Define fórmulas separadamente (mantém números nas 5 primeiras colunas),
    // convertendo o separador de argumentos para o locale da planilha.
    for (var c = 6; c <= 14; c++) shRV.getRange(r, c).setFormula(fx_(fxValores[c - 1]));
  });
  // Reaplica zebra e formatos numéricos que o clear pode ter mantido.
  if (linhas.length > 0) {
    shRV.getRange(2, 14, linhas.length, 1).setNumberFormat('dd/mm/yyyy hh:mm');
  }

  // Atualiza colunas antes/depois da aba Eventos.
  const shEv = ss.getSheetByName(ABAS.EVENTOS);
  Object.keys(eventoUpdates).forEach(function (row) {
    const u = eventoUpdates[row];
    shEv.getRange(Number(row), 6, 1, 4).setValues([u]); // F,G,H,I
  });
}

/**
 * Setores dos tickers (renda variável). Combina os de exemplo com os das
 * posições importadas (08_Import), se existirem.
 */
function setoresPadrao_() {
  var base = {
    'PETR4': 'Petróleo e Gás', 'VALE3': 'Mineração', 'ITUB4': 'Financeiro',
    'MXRF11': 'FII Papel', 'HGLG11': 'FII Logística', 'AAPL34': 'Tecnologia'
  };
  try {
    if (typeof setoresImportados_ === 'function') {
      var imp = setoresImportados_();
      Object.keys(imp).forEach(function (k) { base[k] = imp[k]; });
    }
  } catch (e) {}
  return base;
}

/*
 * (Removido) simboloGF_ — antes adicionava ".SA" aos tickers. As fórmulas de
 * cotação/variação agora referenciam diretamente a célula do ticker (coluna A),
 * sem sufixo, e convertem USD->BRL quando o tipo é STOCK. Ver recalcularPosicoes().
 */

/* ----------------------- ESCRITA DO IMPOSTO DE RENDA --------------------- */

/**
 * Recalcula a aba Imposto de Renda para os 12 meses do ano fiscal,
 * encadeando a compensação de prejuízo de um mês para o outro.
 */
function recalcularImposto(ss) {
  ss = ss || SpreadsheetApp.getActiveSpreadsheet();
  const shCfg = ss.getSheetByName(ABAS.CONFIG);
  const ano = Number(shCfg.getRange(CFG.ANO_FISCAL).getValue()) || new Date().getFullYear();
  const sh = ss.getSheetByName(ABAS.IMPOSTO);

  let prejAcoes = 0, prejFiis = 0;
  const linhas = [];
  for (let mes = 1; mes <= 12; mes++) {
    const r = calcularIRMensal(mes, ano, prejAcoes, prejFiis);
    linhas.push([
      MESES_PT[mes] + '/' + ano,
      r.vendas_acoes, r.vendas_fiis,
      r.vendas_acoes - r.lucro_acoes, // custo ações vendidas (aprox.: vendas - lucro)
      r.vendas_fiis - r.lucro_fiis,   // custo FIIs vendidos
      r.lucro_acoes, r.lucro_fiis,
      prejAcoes, prejFiis,
      Math.max(0, r.lucro_acoes - prejAcoes), // lucro líq ações após comp
      Math.max(0, r.lucro_fiis - prejFiis),   // lucro líq FIIs após comp
      r.isento ? 'SIM' : 'NÃO',
      '15% / 20%',
      r.ir_acoes, r.ir_fiis, r.ir_total, r.status
    ]);
    prejAcoes = r.prej_acoes_rem;
    prejFiis = r.prej_fiis_rem;
  }
  sh.getRange(2, 1, 12, 17).setValues(linhas);

  // Formatação condicional de status (verde isento, âmbar DARF).
  const regras = [];
  const rngStatus = sh.getRange('Q2:Q13');
  regras.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('DARF').setBackground(COR.ALERTA).setFontColor('#FFFFFF')
    .setRanges([rngStatus]).build());
  regras.push(SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('ISENTO').setFontColor(COR.POSITIVO).setRanges([rngStatus]).build());
  sh.setConditionalFormatRules(regras);
}
