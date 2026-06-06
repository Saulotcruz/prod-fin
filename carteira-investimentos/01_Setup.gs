/**
 * 01_Setup.gs
 * ----------------------------------------------------------------------------
 * Orquestrador da planilha + menu + helpers de formatação reutilizados pelos
 * builders das abas.
 *
 * FLUXO PRINCIPAL:
 *   setup()  -> constrói (ou reconstrói) toda a planilha do zero, popula dados
 *               de exemplo, desenha gráficos e instala os triggers.
 *
 * setup() é IDEMPOTENTE: pode ser rodado quantas vezes quiser. Ele apaga as
 * abas existentes com os nomes conhecidos e recria tudo.
 * ----------------------------------------------------------------------------
 */

/**
 * Ponto de entrada único. Rode esta função uma vez após colar o projeto.
 */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.toast('Construindo a carteira... aguarde ~30s', 'Carteira', 30);

  // 1. (Re)cria as 9 abas na ordem correta.
  criarAbasVazias_(ss);

  // 2. Monta estrutura, formatação, validação e fórmulas de cada aba.
  buildLancamentos(ss);
  buildEventos(ss);
  buildRendaVariavel(ss);
  buildRendaFixa(ss);
  buildProventos(ss);
  buildImposto(ss);
  buildProjecao(ss);
  buildConfig(ss);
  buildDashboard(ss);

  // 3. Popula dados de exemplo (Lançamentos, Eventos, RF, Proventos, params).
  popularDadosExemplo(ss);

  // 4. Recalcula posições e IR; sincroniza o patrimônio inicial da projeção
  //    com o total da carteira de exemplo (depois fica editável) e projeta.
  recalcularPosicoes(ss);
  recalcularImposto(ss);
  SpreadsheetApp.flush();
  sincronizarPatrimonio_(ss);
  calcularProjecao();

  // 5. Desenha os gráficos.
  construirGraficos(ss);

  // 6. Protege as abas/áreas calculadas e instala triggers.
  protegerAbas_(ss);
  instalarTriggers();

  // 7. Posiciona o usuário no Dashboard.
  ss.setActiveSheet(ss.getSheetByName(ABAS.DASHBOARD));
  ss.toast('Carteira pronta! 🎉', 'Carteira', 5);
}

/**
 * Menu personalizado, criado automaticamente ao abrir a planilha.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📊 Carteira')
    .addItem('▶ Construir / Reconstruir tudo (setup)', 'setup')
    .addSeparator()
    .addItem('🔄 Atualizar dashboard e cotações', 'atualizarDashboard')
    .addItem('🧮 Recalcular posições (RV)', 'recalcularPosicoesMenu_')
    .addItem('🧾 Recalcular Imposto de Renda', 'recalcularImpostoMenu_')
    .addItem('📈 Recalcular Projeção', 'calcularProjecao')
    .addItem('💰 Sincronizar patrimônio da carteira', 'sincronizarPatrimonioMenu_')
    .addSeparator()
    .addItem('📥 Importar minha carteira (substitui exemplo)', 'importarPosicoesIniciais')
    .addSeparator()
    .addItem('⏰ Instalar triggers (hourly + onEdit)', 'instalarTriggers')
    .addToUi();
}

/** Wrappers chamados pelo menu (precisam de 0 argumentos). */
function recalcularPosicoesMenu_() {
  recalcularPosicoes(SpreadsheetApp.getActiveSpreadsheet());
  SpreadsheetApp.getActiveSpreadsheet().toast('Posições recalculadas.', 'Carteira', 3);
}
function recalcularImpostoMenu_() {
  recalcularImposto(SpreadsheetApp.getActiveSpreadsheet());
  SpreadsheetApp.getActiveSpreadsheet().toast('IR recalculado.', 'Carteira', 3);
}

/**
 * Recria as 9 abas vazias na ordem definida em ORDEM_ABAS, removendo
 * versões anteriores. Mantém uma aba temporária para nunca deletar todas.
 */
function criarAbasVazias_(ss) {
  // Garante uma aba "scratch" para poder remover as demais com segurança.
  let scratch = ss.getSheetByName('__scratch__') || ss.insertSheet('__scratch__');

  // Remove abas conhecidas que já existam.
  ORDEM_ABAS.forEach(function (nome) {
    const sh = ss.getSheetByName(nome);
    if (sh) ss.deleteSheet(sh);
  });

  // Cria na ordem.
  ORDEM_ABAS.forEach(function (nome, i) {
    const sh = ss.insertSheet(nome, i);
    sh.clear();
  });

  // Remove o scratch.
  ss.deleteSheet(ss.getSheetByName('__scratch__'));
}

/**
 * Recalcula posições de RV, IR mensal e projeção (usado por setup e triggers).
 */
function recalcularTudo(ss) {
  recalcularPosicoes(ss);
  recalcularImposto(ss);
  calcularProjecao();
}

/* ===========================================================================
 *  COMPATIBILIDADE DE LOCALE EM FÓRMULAS
 *  Em planilhas com locale pt-BR (e outros), o separador de argumentos de
 *  função é ";" e não ",". O Apps Script grava a fórmula literalmente, então
 *  fórmulas escritas com "," quebram (#ERROR!). Estes helpers convertem as
 *  vírgulas que são separadores (fora de aspas) para o separador do locale.
 * =========================================================================== */

var _SEP_LISTA = null;

/** Detecta o separador de lista do locale da planilha (',' para en_*, senão ';'). */
function sepLista_() {
  if (_SEP_LISTA === null) {
    var loc = '';
    try { loc = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetLocale() || ''; } catch (e) {}
    _SEP_LISTA = /^en/i.test(loc) ? ',' : ';';
  }
  return _SEP_LISTA;
}

/** Converte uma fórmula (string iniciada por '=') para o separador do locale. */
function fx_(f) {
  if (typeof f !== 'string' || f.charAt(0) !== '=') return f;
  var sep = sepLista_();
  if (sep === ',') return f;
  var out = '', inStr = false;
  for (var i = 0; i < f.length; i++) {
    var c = f.charAt(i);
    if (c === '"') inStr = !inStr;
    out += (c === ',' && !inStr) ? sep : c;
  }
  return out;
}

/** Converte uma matriz 2D de fórmulas/valores (passa valores não-fórmula adiante). */
function fxs_(arr) {
  return arr.map(function (row) { return row.map(fx_); });
}

/* ===========================================================================
 *  HELPERS DE FORMATAÇÃO (reutilizados por todos os builders)
 * =========================================================================== */

/**
 * Aplica o estilo de cabeçalho (#1E3A5F / branco, negrito, centralizado)
 * a um intervalo de uma linha de títulos.
 */
function estiloHeader_(range) {
  range.setBackground(COR.HEADER_BG)
       .setFontColor(COR.HEADER_TX)
       .setFontWeight('bold')
       .setHorizontalAlignment('center')
       .setVerticalAlignment('middle')
       .setWrap(true);
}

/**
 * Escreve uma linha de títulos na linha `row` da aba e aplica o estilo header.
 * Retorna o range dos títulos.
 */
function escreverHeader_(sheet, row, titulos) {
  const range = sheet.getRange(row, 1, 1, titulos.length);
  range.setValues([titulos]);
  estiloHeader_(range);
  sheet.setFrozenRows(row);
  return range;
}

/**
 * Aplica linhas zebradas (#F8F9FA / branco) a um intervalo de dados.
 */
function aplicarZebra_(sheet, primeiraLinha, numLinhas, numCols) {
  if (numLinhas <= 0) return;
  const rng = sheet.getRange(primeiraLinha, 1, numLinhas, numCols);
  const cores = [];
  for (let i = 0; i < numLinhas; i++) {
    const cor = (i % 2 === 0) ? COR.BRANCO : COR.ZEBRA;
    cores.push(new Array(numCols).fill(cor));
  }
  rng.setBackgrounds(cores);
}

/**
 * Marca um intervalo como célula de input (fundo amarelo suave + borda).
 */
function estiloInput_(range) {
  range.setBackground(COR.INPUT_BG)
       .setBorder(true, true, true, true, false, false, COR.NEUTRO,
                  SpreadsheetApp.BorderStyle.SOLID);
}

/**
 * Cria uma regra de formatação condicional verde/vermelho por sinal
 * (positivo = verde, negativo = vermelho) para um intervalo (notação A1).
 */
function condFormatSinal_(sheet, a1) {
  const rng = sheet.getRange(a1);
  const regras = sheet.getConditionalFormatRules();
  regras.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThan(0).setFontColor(COR.POSITIVO).setRanges([rng]).build());
  regras.push(SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0).setFontColor(COR.NEGATIVO).setRanges([rng]).build());
  sheet.setConditionalFormatRules(regras);
}

/**
 * Adiciona um dropdown de validação (lista fixa) a um intervalo A1.
 */
function dropdown_(sheet, a1, valores) {
  const regra = SpreadsheetApp.newDataValidation()
    .requireValueInList(valores, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(a1).setDataValidation(regra);
}

/**
 * Título grande de seção (faixa colorida) usado no Dashboard e na Projeção.
 */
function faixaSecao_(sheet, row, col, numCols, texto, bg) {
  const rng = sheet.getRange(row, col, 1, numCols);
  rng.merge()
     .setValue(texto)
     .setBackground(bg || COR.SECAO_BG)
     .setFontColor(COR.HEADER_TX)
     .setFontWeight('bold')
     .setFontSize(11)
     .setHorizontalAlignment('left')
     .setVerticalAlignment('middle');
  return rng;
}
