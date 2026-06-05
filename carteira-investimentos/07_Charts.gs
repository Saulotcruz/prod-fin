/**
 * 07_Charts.gs
 * ----------------------------------------------------------------------------
 * Gráficos e proteção das abas.
 *   - construirGraficos() : pizza (alocação classe/setor), barras (proventos),
 *                           área (evolução do patrimônio) e linha (retirada).
 *   - protegerAbas_()     : protege abas/áreas só de fórmulas.
 *
 * As tabelas-fonte dos gráficos de alocação são montadas com fórmulas em áreas
 * auxiliares do Dashboard (atualizam sozinhas).
 * ----------------------------------------------------------------------------
 */

function construirGraficos(ss) {
  limparGraficos_(ss.getSheetByName(ABAS.DASHBOARD)); // evita duplicar ao reexecutar
  montarDadosGraficos_(ss);
  graficoAlocacaoClasse_(ss);
  graficoAlocacaoSetor_(ss);
  graficoProventos_(ss);
  graficoEvolucao_(ss);
  graficoRetirada_(ss);
}

/** Remove gráficos existentes de uma aba (idempotência). */
function limparGraficos_(sh) {
  sh.getCharts().forEach(function (c) { sh.removeChart(c); });
}

/**
 * Tabelas auxiliares no Dashboard para os gráficos de alocação:
 *   - Classe:  J30:K35
 *   - Setor:   M30:N (via QUERY)
 */
function montarDadosGraficos_(ss) {
  const sh = ss.getSheetByName(ABAS.DASHBOARD);
  const RV = "'" + ABAS.RENDA_VARIAVEL + "'!";
  const RF = "'" + ABAS.RENDA_FIXA + "'!";

  // Título das áreas auxiliares.
  sh.getRange('J29').setValue('Alocação por Classe').setFontWeight('bold');
  const classe = [
    ['Ações',   '=SUMIF(' + RV + 'B:B,"AÇÃO",' + RV + 'I:I)'],
    ['FIIs',    '=SUMIF(' + RV + 'B:B,"FII",' + RV + 'I:I)'],
    ['BDRs',    '=SUMIF(' + RV + 'B:B,"BDR",' + RV + 'I:I)'],
    ['Tesouro', '=SUMIF(' + RF + 'B:B,"TESOURO*",' + RF + 'G:G)'],
    ['CDB',     '=SUMIF(' + RF + 'B:B,"CDB",' + RF + 'G:G)'],
    ['LCI/LCA', '=SUMIF(' + RF + 'B:B,"LCI",' + RF + 'G:G)+SUMIF(' + RF + 'B:B,"LCA",' + RF + 'G:G)']
  ];
  sh.getRange(30, 10, classe.length, 2).setValues(classe);
  sh.getRange(30, 11, classe.length, 1).setNumberFormat(FMT.MOEDA);

  // Alocação por setor (renda variável) via QUERY dinâmica.
  sh.getRange('M29').setValue('Alocação por Setor (RV)').setFontWeight('bold');
  sh.getRange('M30').setFormula(
    '=IFERROR(QUERY(' + RV + 'A2:I, "select C, sum(I) where C is not null group by C order by sum(I) desc label sum(I) \'\'", 0), )');
  sh.getRange(30, 14, 20, 1).setNumberFormat(FMT.MOEDA);
}

function graficoAlocacaoClasse_(ss) {
  const sh = ss.getSheetByName(ABAS.DASHBOARD);
  const chart = sh.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(sh.getRange('J30:K35'))
    .setOption('title', 'Alocação por Classe')
    .setOption('pieHole', 0.4)
    .setOption('width', 380).setOption('height', 260)
    .setPosition(30, 2, 0, 0)
    .build();
  sh.insertChart(chart);
}

function graficoAlocacaoSetor_(ss) {
  const sh = ss.getSheetByName(ABAS.DASHBOARD);
  const chart = sh.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(sh.getRange('M30:N40'))
    .setOption('title', 'Alocação por Setor (RV)')
    .setOption('pieHole', 0.4)
    .setOption('width', 380).setOption('height', 260)
    .setPosition(30, 6, 0, 0)
    .build();
  sh.insertChart(chart);
}

function graficoProventos_(ss) {
  const sh = ss.getSheetByName(ABAS.PROVENTOS);
  limparGraficos_(sh);
  const chart = sh.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(sh.getRange('M2:N40'))
    .setOption('title', 'Proventos por Mês')
    .setOption('legend', { position: 'none' })
    .setOption('colors', [COR.HEADER_BG])
    .setOption('width', 560).setOption('height', 300)
    .setPosition(2, 17, 0, 0)
    .build();
  sh.insertChart(chart);
}

function graficoEvolucao_(ss) {
  const sh = ss.getSheetByName(ABAS.PROJECAO);
  limparGraficos_(sh);
  // Ano (A) vs Patrim. Fim (F) e Meta (H).
  const first = PROJ.TAB_ANUAL_HEADER;
  const chart = sh.newChart()
    .setChartType(Charts.ChartType.AREA)
    .addRange(sh.getRange(first, 1, PROJ.TAB_ANUAL_MAX + 1, 1)) // Ano
    .addRange(sh.getRange(first, 6, PROJ.TAB_ANUAL_MAX + 1, 1)) // Patrim. Fim
    .addRange(sh.getRange(first, 8, PROJ.TAB_ANUAL_MAX + 1, 1)) // Meta
    .setOption('title', 'Evolução do Patrimônio vs Meta')
    .setOption('colors', [COR.POSITIVO, COR.ALERTA])
    .setOption('width', 620).setOption('height', 320)
    .setOption('useFirstColumnAsDomain', true)
    .setPosition(PROJ.TAB_ANUAL_HEADER, 9, 0, 0)
    .build();
  sh.insertChart(chart);
}

function graficoRetirada_(ss) {
  const sh = ss.getSheetByName(ABAS.PROJECAO);
  // Ano (A) vs Patrim. Fim (F) na fase de retirada.
  const first = PROJ.TAB_RET_HEADER;
  const chart = sh.newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(sh.getRange(first, 1, PROJ.TAB_RET_MAX + 1, 1)) // Ano
    .addRange(sh.getRange(first, 6, PROJ.TAB_RET_MAX + 1, 1)) // Patrim. Fim
    .setOption('title', 'Declínio do Patrimônio na Fase de Retirada')
    .setOption('colors', [COR.NEGATIVO])
    .setOption('legend', { position: 'none' })
    .setOption('width', 620).setOption('height', 300)
    .setOption('useFirstColumnAsDomain', true)
    .setPosition(PROJ.TAB_RET_HEADER, 8, 0, 0)
    .build();
  sh.insertChart(chart);
}

/* ------------------------------- PROTEÇÃO -------------------------------- */

/**
 * Protege as abas que são "só fórmulas" (Dashboard, Renda Variável, Renda Fixa,
 * Proventos, Imposto de Renda). Mantém abertas: Lançamentos, Eventos,
 * Configurações e a Seção A da Projeção (inputs amarelos).
 */
function protegerAbas_(ss) {
  const me = Session.getEffectiveUser();
  const protegidas = [ABAS.DASHBOARD, ABAS.RENDA_VARIAVEL, ABAS.RENDA_FIXA,
                      ABAS.PROVENTOS, ABAS.IMPOSTO];
  protegidas.forEach(function (nome) {
    const sh = ss.getSheetByName(nome);
    // Remove proteções anteriores.
    sh.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(function (p) { p.remove(); });
    const prot = sh.protect().setDescription('Aba calculada — somente fórmulas');
    prot.addEditor(me);
    prot.setWarningOnly(true); // aviso ao editar, sem travar (evita bloqueio total)
  });

  // Projeção: protege tudo, exceto a Seção A (inputs C4:C18) e a célula de
  // rentabilidade na retirada (C121).
  const shP = ss.getSheetByName(ABAS.PROJECAO);
  shP.getProtections(SpreadsheetApp.ProtectionType.SHEET).forEach(function (p) { p.remove(); });
  const protP = shP.protect().setDescription('Projeção — edite apenas as células amarelas');
  protP.setUnprotectedRanges([
    shP.getRange('C4:C18'),
    shP.getRange(PROJ.RET_RENT)
  ]);
  protP.addEditor(me);
  protP.setWarningOnly(true);
}
