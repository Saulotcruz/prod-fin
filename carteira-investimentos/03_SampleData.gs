/**
 * 03_SampleData.gs
 * ----------------------------------------------------------------------------
 * Popula a planilha com dados fictícios realistas para demonstração:
 * lançamentos dos últimos 18 meses, eventos corporativos, renda fixa,
 * proventos mensais de FIIs e listas de configuração.
 *
 * Todas as datas são relativas a hoje (mesesAtras_) para que o exemplo
 * continue coerente independente de quando o setup é rodado.
 * ----------------------------------------------------------------------------
 */

function popularDadosExemplo(ss) {
  popularLancamentos_(ss);
  popularEventos_(ss);
  popularRendaFixa_(ss);
  popularProventos_(ss);
  popularConfig_(ss);
}

/** Retorna um Date a `m` meses atrás de hoje (dia opcional). */
function mesesAtras_(m, dia) {
  const d = new Date();
  d.setMonth(d.getMonth() - m);
  if (dia) d.setDate(dia);
  return d;
}

function popularLancamentos_(ss) {
  const sh = ss.getSheetByName(ABAS.LANCAMENTOS);
  // [Data, Tipo, Ticker, Corretora, Qtd, Preço, Taxas, (Valor=fórmula), Obs]
  const dados = [
    // PETR4 — 100 cotas em 3 datas; depois SPLIT 2:1 (-8m) leva a 200.
    [mesesAtras_(18, 10), 'COMPRA', 'PETR4', 'XP',        40, 38.00, 5.20, 'Compra inicial'],
    [mesesAtras_(12, 8),  'COMPRA', 'PETR4', 'XP',        30, 36.50, 4.80, 'Aporte mensal'],
    [mesesAtras_(10, 15), 'COMPRA', 'PETR4', 'Clear',     30, 40.00, 4.50, 'Aporte mensal'],
    // VALE3 — 200 compradas, 50 vendidas (-3m) com lucro -> 150 restantes.
    [mesesAtras_(15, 5),  'COMPRA', 'VALE3', 'XP',       100, 68.00, 8.10, 'Posição inicial'],
    [mesesAtras_(9, 20),  'COMPRA', 'VALE3', 'Rico',     100, 62.00, 7.40, 'Preço médio'],
    [mesesAtras_(3, 12),  'VENDA',  'VALE3', 'XP',        50, 72.00, 6.00, 'Venda parcial com lucro'],
    // ITUB4 — 300 cotas em 2 datas.
    [mesesAtras_(14, 7),  'COMPRA', 'ITUB4', 'Nu Invest',150, 28.00, 6.10, 'Banco'],
    [mesesAtras_(7, 18),  'COMPRA', 'ITUB4', 'Nu Invest',150, 31.00, 6.40, 'Aumento de posição'],
    // MXRF11 — 500 cotas (FII).
    [mesesAtras_(16, 3),  'COMPRA', 'MXRF11','XP',       300, 10.20, 3.10, 'FII de papel'],
    [mesesAtras_(8, 10),  'COMPRA', 'MXRF11','XP',       200, 10.50, 2.90, 'Aporte'],
    // HGLG11 — 100 cotas; BONIFICAÇÃO 10% (-4m) leva a 110.
    [mesesAtras_(11, 14), 'COMPRA', 'HGLG11','Rico',     100, 165.00, 9.80, 'FII de logística'],
    // AAPL34 — 50 BDRs.
    [mesesAtras_(13, 9),  'COMPRA', 'AAPL34','XP',        50, 55.00, 5.50, 'BDR Apple']
  ];
  sh.getRange(2, 1, dados.length, 9).setValues(
    dados.map(function (l) { return [l[0], l[1], l[2], l[3], l[4], l[5], l[6], '', l[7]]; }));
}

function popularEventos_(ss) {
  const sh = ss.getSheetByName(ABAS.EVENTOS);
  // [Data, Ticker, Tipo, Descrição, Fator, (antes/depois/pm calculados), Custo Adicional]
  const dados = [
    [mesesAtras_(8, 1), 'PETR4',  'SPLIT',       'Split 2:1', 2, 0],
    [mesesAtras_(4, 1), 'HGLG11', 'BONIFICAÇÃO', 'Bonificação 10%', 0.10, 0]
  ];
  sh.getRange(2, 1, dados.length, 5).setValues(
    dados.map(function (e) { return [e[0], e[1], e[2], e[3], e[4]]; }));
  sh.getRange(2, 10, dados.length, 1).setValues(dados.map(function (e) { return [e[5]]; }));
}

function popularRendaFixa_(ss) {
  const sh = ss.getSheetByName(ABAS.RENDA_FIXA);
  // [Título, Tipo, Emissor, Corretora, Aplic, Venc, Valor, Indexador, Taxa, ...Status]
  const dados = [
    ['CDB Nubank 110% CDI', 'CDB', 'Nu Pagamentos', 'Nu Invest',
     mesesAtras_(12, 1), new Date(2027, 11, 1), 15000, 'CDI', 1.10, 'ATIVO'],
    ['Tesouro IPCA+ 2029', 'TESOURO_IPCA', 'Tesouro Nacional', 'XP',
     mesesAtras_(10, 1), new Date(2029, 4, 15), 20000, 'IPCA', 0.06, 'ATIVO']
  ];
  dados.forEach(function (d, i) {
    const r = i + 2;
    sh.getRange(r, 1, 1, 9).setValues([[d[0], d[1], d[2], d[3], d[4], d[5], d[6], d[7], d[8]]]);
    sh.getRange(r, 14).setValue(d[9]); // Status (col N)
  });
}

function popularProventos_(ss) {
  const sh = ss.getSheetByName(ABAS.PROVENTOS);
  // Rendimentos mensais de FIIs (DIVIDENDO/isento) nos últimos 6 meses.
  const linhas = [];
  for (let m = 6; m >= 1; m--) {
    linhas.push([mesesAtras_(m, 14), 'MXRF11', 'DIVIDENDO', 500, 0.10]);   // ~R$50/mês
    linhas.push([mesesAtras_(m, 16), 'HGLG11', 'DIVIDENDO', 110, 1.10]);   // ~R$121/mês
  }
  // [Data, Ticker, Tipo, Qtd, Valor por cota] — F,G,H são fórmulas já no build.
  sh.getRange(2, 1, linhas.length, 5).setValues(linhas);
}

function popularConfig_(ss) {
  const sh = ss.getSheetByName(ABAS.CONFIG);
  const tickers = [
    ['PETR4', 'AÇÃO'], ['VALE3', 'AÇÃO'], ['ITUB4', 'AÇÃO'],
    ['MXRF11', 'FII'], ['HGLG11', 'FII'], ['AAPL34', 'BDR']
  ];
  sh.getRange(CFG.TICKERS_FIRST_ROW, 2, tickers.length, 2).setValues(tickers);

  const corretoras = [['XP'], ['Nu Invest'], ['Clear'], ['Rico']];
  sh.getRange(CFG.CORRETORAS_FIRST_ROW, 5, corretoras.length, 1).setValues(corretoras);
}
