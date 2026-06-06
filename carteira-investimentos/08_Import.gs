/**
 * 08_Import.gs
 * ----------------------------------------------------------------------------
 * Importação da carteira real do usuário (extraída da planilha antiga, onde
 * cada aba era uma ação com TOTAL GERAL e Valor Médio).
 *
 * importarPosicoesIniciais():
 *   - Substitui os dados de EXEMPLO pelas posições reais.
 *   - Para cada ativo cria 1 lançamento de COMPRA de abertura (data de hoje,
 *     preço = preço médio, taxas 0), que alimenta todos os cálculos.
 *   - Atualiza a lista de tickers em Configurações e recalcula tudo.
 *
 * Rode UMA vez, depois do setup(). Para ajustar quantidades/preços, edite
 * diretamente a aba Lançamentos.
 * ----------------------------------------------------------------------------
 */

/**
 * Posições reais importadas: [ticker, tipo, quantidade, preço médio (R$), setor].
 * Origem: planilha antiga (TOTAL GERAL / Valor Médio por aba).
 * Excluídos por decisão do usuário: COGN3, FAMB11 (vendidos) e ENBR3 (deslistada).
 * BRCR11 = 131 cotas @ R$ 77,64 (aba "BRCR11 BTG"). FB importado como META.
 */
var POSICOES_IMPORTADAS = [
  ['BBAS3',  'AÇÃO',  2700,    22.70, 'Financeiro'],
  ['BBSE3',  'AÇÃO',  1800,    33.95, 'Seguros'],
  ['TAEE11', 'AÇÃO',   934,    34.57, 'Energia'],
  ['CXSE3',  'AÇÃO',   700,    15.00, 'Seguros'],
  ['VIVA3',  'AÇÃO',   400,    23.05, 'Varejo'],
  ['ABCB4',  'AÇÃO',   826,    15.92, 'Financeiro'],
  ['ITSA4',  'AÇÃO',  5442,    11.49, 'Holding'],
  ['PARD3',  'AÇÃO',   300,    17.95, 'Saúde'],
  ['KLBN4',  'AÇÃO',  1600,     2.87, 'Papel e Celulose'],
  ['LEVE3',  'AÇÃO',  1141,    25.55, 'Bens Industriais'],
  ['BRCR11', 'FII',    131,    77.64, 'FII Lajes'],
  ['KNRI11', 'FII',     92,   151.35, 'FII Híbrido'],
  ['RBHG11', 'FII',     21,    62.81, 'FII Papel'],
  ['KNHY11', 'FII',     34,   105.52, 'FII Papel'],
  ['BRK.B',  'STOCK', 13.1890, 904.87, 'Holding (EUA)'],
  ['META',   'STOCK', 14.3461, 1494.47, 'Tecnologia (EUA) — ex-FB'],
  ['AAPL',   'STOCK', 11.0908, 646.11, 'Tecnologia (EUA)'],
  ['QQQ',    'STOCK',  2.3150, 1569.60, 'ETF (EUA)']
];

/**
 * Substitui os dados de exemplo pelas posições reais e recalcula a carteira.
 */
function importarPosicoesIniciais() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.toast('Importando sua carteira...', 'Carteira', 20);

  limparDadosExemplo_(ss);
  escreverLancamentosAbertura_(ss);
  escreverTickersConfig_(ss);

  recalcularPosicoes(ss);
  recalcularImposto(ss);
  SpreadsheetApp.flush();
  sincronizarPatrimonio_(ss);
  calcularProjecao();
  atualizarDashboard();

  ss.setActiveSheet(ss.getSheetByName(ABAS.DASHBOARD));
  ss.toast('Carteira importada: ' + POSICOES_IMPORTADAS.length + ' ativos. 🎉', 'Carteira', 5);
}

/** Remove os dados de exemplo (mantém cabeçalhos, formatos e fórmulas-guarda). */
function limparDadosExemplo_(ss) {
  // Lançamentos: limpa A..G e I (mantém a fórmula de Valor Total na col H).
  limparColunas_(ss.getSheetByName(ABAS.LANCAMENTOS), [1, 2, 3, 4, 5, 6, 7, 9]);
  // Eventos: sem fórmulas; limpa A..J.
  limparColunas_(ss.getSheetByName(ABAS.EVENTOS), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  // Proventos: limpa A..E (mantém F,G,H e auxiliares P,Q).
  limparColunas_(ss.getSheetByName(ABAS.PROVENTOS), [1, 2, 3, 4, 5]);
  // Renda Fixa: limpa A..I e N (mantém J..M calculadas).
  limparColunas_(ss.getSheetByName(ABAS.RENDA_FIXA), [1, 2, 3, 4, 5, 6, 7, 8, 9, 14]);
}

/** Limpa o conteúdo de colunas específicas, da linha 2 até a última usada. */
function limparColunas_(sh, cols) {
  const ult = sh.getLastRow();
  if (ult < 2) return;
  cols.forEach(function (c) { sh.getRange(2, c, ult - 1, 1).clearContent(); });
}

/** Escreve um lançamento de COMPRA de abertura por ativo (data de hoje). */
function escreverLancamentosAbertura_(ss) {
  const sh = ss.getSheetByName(ABAS.LANCAMENTOS);
  const hoje = new Date();
  // Colunas A..G (entrada). NÃO escreve H (col 8): mantém a fórmula de Valor Total.
  const ag = POSICOES_IMPORTADAS.map(function (p) {
    return [hoje, 'COMPRA', p[0], 'Importado', p[2], p[3], 0];
  });
  sh.getRange(2, 1, ag.length, 7).setValues(ag);
  // Coluna I (Observação).
  const obs = POSICOES_IMPORTADAS.map(function () { return ['Posição inicial importada']; });
  sh.getRange(2, 9, obs.length, 1).setValues(obs);
}

/** Atualiza a tabela de tickers monitorados em Configurações. */
function escreverTickersConfig_(ss) {
  const sh = ss.getSheetByName(ABAS.CONFIG);
  // Limpa tickers de exemplo.
  const ult = sh.getLastRow();
  if (ult >= CFG.TICKERS_FIRST_ROW) {
    sh.getRange(CFG.TICKERS_FIRST_ROW, 2, ult - CFG.TICKERS_FIRST_ROW + 1, 2).clearContent();
  }
  const tickers = POSICOES_IMPORTADAS.map(function (p) { return [p[0], p[1]]; });
  sh.getRange(CFG.TICKERS_FIRST_ROW, 2, tickers.length, 2).setValues(tickers);
}

/** Mapa ticker -> setor das posições importadas (usado por recalcularPosicoes). */
function setoresImportados_() {
  const mapa = {};
  POSICOES_IMPORTADAS.forEach(function (p) { mapa[p[0]] = p[4]; });
  return mapa;
}
