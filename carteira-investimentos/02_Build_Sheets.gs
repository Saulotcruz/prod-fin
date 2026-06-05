/**
 * 02_Build_Sheets.gs
 * ----------------------------------------------------------------------------
 * Builders de estrutura de cada uma das 9 abas: cabeçalhos, larguras, formatos,
 * validações, formatação condicional e fórmulas-base. Os dados de exemplo são
 * inseridos depois (03_SampleData) e os valores calculados são escritos pelos
 * módulos de cálculo (04/05/06).
 * ----------------------------------------------------------------------------
 */

/* ========================== ABA 2 — LANÇAMENTOS ============================ */
function buildLancamentos(ss) {
  const sh = ss.getSheetByName(ABAS.LANCAMENTOS);
  const titulos = ['Data', 'Tipo', 'Ticker', 'Corretora', 'Quantidade',
                   'Preço Unitário', 'Taxas', 'Valor Total', 'Observação'];
  escreverHeader_(sh, 1, titulos);

  const N = 300; // linhas pré-formatadas para lançamentos futuros
  sh.getRange(2, 1, N, 1).setNumberFormat(FMT.DATA);          // Data
  sh.getRange(2, 5, N, 1).setNumberFormat(FMT.QTD);           // Quantidade
  sh.getRange(2, 6, N, 1).setNumberFormat(FMT.MOEDA);         // Preço
  sh.getRange(2, 7, N, 1).setNumberFormat(FMT.MOEDA);         // Taxas
  sh.getRange(2, 8, N, 1).setNumberFormat(FMT.MOEDA);         // Valor total

  // Valor Total = quantidade × preço + taxas (spec).
  const formulas = [];
  for (let i = 0; i < N; i++) {
    const r = i + 2;
    formulas.push(['=IF($E' + r + '="","",$E' + r + '*$F' + r + '+N($G' + r + '))']);
  }
  sh.getRange(2, 8, N, 1).setFormulas(formulas);

  dropdown_(sh, 'B2:B' + (N + 1), TIPOS_LANCAMENTO);
  larguras_(sh, [95, 130, 90, 130, 95, 110, 90, 120, 240]);
  aplicarZebra_(sh, 2, N, titulos.length);
  sh.getRange(2, 3, N, 1).setHorizontalAlignment('center');  // Ticker centralizado
}

/* ===================== ABA 7 — EVENTOS CORPORATIVOS ======================= */
function buildEventos(ss) {
  const sh = ss.getSheetByName(ABAS.EVENTOS);
  const titulos = ['Data', 'Ticker', 'Tipo', 'Descrição', 'Fator',
                   'Qtd Antes', 'Qtd Depois', 'PM Antes', 'PM Depois',
                   'Custo Adicional'];
  escreverHeader_(sh, 1, titulos);

  const N = 100;
  sh.getRange(2, 1, N, 1).setNumberFormat(FMT.DATA);
  sh.getRange(2, 5, N, 1).setNumberFormat(FMT.QTD_DEC);
  sh.getRange(2, 6, N, 2).setNumberFormat(FMT.QTD);
  sh.getRange(2, 8, N, 2).setNumberFormat(FMT.MOEDA);
  sh.getRange(2, 10, N, 1).setNumberFormat(FMT.MOEDA);

  dropdown_(sh, 'C2:C' + (N + 1), TIPOS_EVENTO);
  larguras_(sh, [95, 90, 120, 170, 70, 90, 90, 100, 100, 120]);
  aplicarZebra_(sh, 2, N, titulos.length);

  // Nota: colunas F..I (antes/depois) são preenchidas por recalcularPosicoes().
  notaCabecalho_(sh, 'G1', 'Qtd/PM antes e depois são calculados automaticamente.');
}

/* ======================= ABA 3 — RENDA VARIÁVEL =========================== */
function buildRendaVariavel(ss) {
  const sh = ss.getSheetByName(ABAS.RENDA_VARIAVEL);
  const titulos = ['Ticker', 'Tipo', 'Setor', 'Qtd Atual', 'PM Ajustado',
                   'Custo Total', 'Cotação Atual', 'Variação Dia', 'Valor Mercado',
                   'L/P R$', 'L/P %', '% Carteira', 'Yield on Cost', 'Últ. Atualização'];
  escreverHeader_(sh, 1, titulos);
  larguras_(sh, [80, 70, 150, 80, 100, 110, 100, 90, 120, 110, 80, 90, 100, 130]);

  // Formatos das colunas de dados (a partir da linha 2).
  const N = 60;
  sh.getRange(2, 4, N, 1).setNumberFormat(FMT.QTD);
  sh.getRange(2, 5, N, 1).setNumberFormat(FMT.MOEDA);
  sh.getRange(2, 6, N, 1).setNumberFormat(FMT.MOEDA);
  sh.getRange(2, 7, N, 1).setNumberFormat(FMT.MOEDA);
  sh.getRange(2, 8, N, 1).setNumberFormat(FMT.PERC);
  sh.getRange(2, 9, N, 1).setNumberFormat(FMT.MOEDA);
  sh.getRange(2, 10, N, 1).setNumberFormat(FMT.MOEDA);
  sh.getRange(2, 11, N, 1).setNumberFormat(FMT.PERC);
  sh.getRange(2, 12, N, 1).setNumberFormat(FMT.PERC);
  sh.getRange(2, 13, N, 1).setNumberFormat(FMT.PERC);

  // Formatação condicional verde/vermelho: L/P R$ (J), L/P % (K) e Variação (H).
  condFormatSinal_(sh, 'J2:J' + (N + 1));
  condFormatSinal_(sh, 'K2:K' + (N + 1));
  condFormatSinal_(sh, 'H2:H' + (N + 1));

  // Linhas e PM/Qtd são preenchidos por recalcularPosicoes(); cotações via GOOGLEFINANCE.
}

/* ========================= ABA 4 — RENDA FIXA ============================= */
function buildRendaFixa(ss) {
  const sh = ss.getSheetByName(ABAS.RENDA_FIXA);
  const titulos = ['Título', 'Tipo', 'Emissor', 'Corretora', 'Data Aplicação',
                   'Data Vencimento', 'Valor Aplicado', 'Indexador', 'Taxa',
                   'Alíquota IR', 'Valor Bruto Venc.', 'IR Estimado',
                   'Valor Líquido Venc.', 'Status'];
  escreverHeader_(sh, 1, titulos);
  larguras_(sh, [170, 130, 120, 120, 105, 110, 110, 90, 100, 90, 120, 100, 120, 100]);

  const N = 50;
  sh.getRange(2, 5, N, 2).setNumberFormat(FMT.DATA);
  sh.getRange(2, 7, N, 1).setNumberFormat(FMT.MOEDA);
  sh.getRange(2, 9, N, 1).setNumberFormat(FMT.PERC_SIMPLES); // taxa (% do CDI ou a.a.)
  sh.getRange(2, 10, N, 1).setNumberFormat(FMT.PERC);
  sh.getRange(2, 11, N, 3).setNumberFormat(FMT.MOEDA);

  dropdown_(sh, 'B2:B' + (N + 1), TIPOS_RF);
  dropdown_(sh, 'H2:H' + (N + 1), INDEXADORES);
  dropdown_(sh, 'N2:N' + (N + 1), ['ATIVO', 'VENCIDO', 'RESGATADO']);
  aplicarZebra_(sh, 2, N, titulos.length);

  // Fórmulas estimativas (J alíquota regressiva, K bruto, L IR, M líquido).
  const cfg = "'" + ABAS.CONFIG + "'!";
  const f = [];
  for (let i = 0; i < N; i++) {
    const r = i + 2;
    const dias = 'DATEDIF($E' + r + ',$F' + r + ',"D")';
    const anos = '(' + dias + '/365)';
    // alíquota regressiva
    const aliq = '=IF($E' + r + '="","",IF(' + dias + '>720,0.15,IF(' + dias +
                 '>360,0.175,IF(' + dias + '>180,0.20,0.225))))';
    // taxa anual efetiva conforme indexador (usa premissas em Configurações)
    const cdi = cfg + CFG.CDI_ANUAL;
    const ipca = cfg + CFG.IPCA_ANUAL;
    const taxaEf = 'IF($H' + r + '="CDI",$I' + r + '*' + cdi +
                   ',IF($H' + r + '="SELIC",$I' + r + '*' + cdi +
                   ',IF($H' + r + '="IPCA",(1+' + ipca + ')*(1+$I' + r + ')-1,$I' + r + ')))';
    const bruto = '=IF($G' + r + '="","",$G' + r + '*(1+' + taxaEf + ')^' + anos + ')';
    const ir = '=IF($K' + r + '="","",($K' + r + '-$G' + r + ')*$J' + r + ')';
    const liq = '=IF($K' + r + '="","",$K' + r + '-$L' + r + ')';
    f.push([aliq, bruto, ir, liq]);
  }
  sh.getRange(2, 10, N, 4).setFormulas(f); // J,K,L,M
}

/* ========================== ABA 5 — PROVENTOS ============================= */
function buildProventos(ss) {
  const sh = ss.getSheetByName(ABAS.PROVENTOS);
  const titulos = ['Data Pagamento', 'Ticker', 'Tipo', 'Qtd Data Ex',
                   'Valor por Cota', 'Valor Total', 'IR Retido', 'Valor Líquido'];
  escreverHeader_(sh, 1, titulos);
  larguras_(sh, [115, 90, 110, 95, 110, 110, 100, 110]);

  const N = 200;
  sh.getRange(2, 1, N, 1).setNumberFormat(FMT.DATA);
  sh.getRange(2, 4, N, 1).setNumberFormat(FMT.QTD);
  sh.getRange(2, 5, N, 1).setNumberFormat('R$ #,##0.0000000');
  sh.getRange(2, 6, N, 3).setNumberFormat(FMT.MOEDA);
  dropdown_(sh, 'C2:C' + (N + 1), TIPOS_PROVENTO);
  aplicarZebra_(sh, 2, N, titulos.length);

  // F = D*E ; G = JCP retém 15% ; H = F-G.
  const f = [];
  for (let i = 0; i < N; i++) {
    const r = i + 2;
    f.push([
      '=IF($D' + r + '="","",$D' + r + '*$E' + r + ')',
      '=IF($D' + r + '="","",IF($C' + r + '="JCP",$F' + r + '*' + IR.ALIQUOTA_JCP + ',0))',
      '=IF($D' + r + '="","",$F' + r + '-$G' + r + ')'
    ]);
  }
  sh.getRange(2, 6, N, 3).setFormulas(f);

  // --- Resumo: pivot por ticker (col J/K) e por mês/ano (col M/N) ---
  faixaSecao_(sh, 1, 10, 2, 'Total por Ticker', COR.HEADER_BG);
  sh.getRange(2, 10).setValue('Ticker').setFontWeight('bold');
  sh.getRange(2, 11).setValue('Total Líquido').setFontWeight('bold');
  // QUERY agrupando por ticker (dinâmico).
  sh.getRange(3, 10).setFormula(
    '=IFERROR(QUERY($A$2:$H, "select B, sum(H) where B is not null group by B label sum(H) \'\'", 0), )');
  sh.getRange(3, 11, 50, 1).setNumberFormat(FMT.MOEDA);

  faixaSecao_(sh, 1, 13, 2, 'Total por Mês/Ano', COR.HEADER_BG);
  sh.getRange(2, 13).setValue('Mês/Ano').setFontWeight('bold');
  sh.getRange(2, 14).setValue('Total Líquido').setFontWeight('bold');
  // Colunas auxiliares contíguas (escondidas) P=mês/ano texto, Q=líquido, para
  // a pivot temporal sem depender do separador de array (locale-safe).
  const aux = [];
  for (let i = 0; i < N; i++) {
    const r = i + 2;
    aux.push([
      '=IF($A' + r + '="","",TEXT($A' + r + ',"yyyy-mm"))',
      '=IF($A' + r + '="","",$H' + r + ')'
    ]);
  }
  sh.getRange(2, 16, N, 2).setFormulas(aux); // cols P, Q
  sh.getRange(3, 13).setFormula(
    '=IFERROR(QUERY($P$2:$Q, "select P, sum(Q) where P is not null group by P order by P label sum(Q) \'\'", 0), )');
  sh.getRange(3, 14, 60, 1).setNumberFormat(FMT.MOEDA);
  sh.hideColumns(16, 2); // esconde colunas auxiliares P e Q
}

/* ====================== ABA 6 — IMPOSTO DE RENDA ========================= */
function buildImposto(ss) {
  const sh = ss.getSheetByName(ABAS.IMPOSTO);
  const titulos = ['Mês/Ano', 'Vendas Ações', 'Vendas FIIs', 'Custo Ações Vend.',
                   'Custo FIIs Vend.', 'Lucro Bruto Ações', 'Lucro Bruto FIIs',
                   'Prej. Acum. Ant. Ações', 'Prej. Acum. Ant. FIIs',
                   'Lucro Líq. Ações', 'Lucro Líq. FIIs', 'Isenção Ações',
                   'Alíquota', 'IR Ações', 'IR FIIs', 'IR Total', 'Status'];
  escreverHeader_(sh, 1, titulos);
  larguras_(sh, [90, 110, 100, 120, 120, 120, 110, 130, 130, 110, 110, 90, 90, 100, 100, 100, 130]);

  const N = 12; // 12 meses do ano fiscal
  sh.getRange(2, 2, N, 15).setNumberFormat(FMT.MOEDA); // B..P (inclui IR Total)
  sh.getRange(2, 12, N, 1).setNumberFormat('@');       // isenção como texto SIM/NÃO
  sh.getRange(2, 13, N, 1).setNumberFormat('@');       // alíquota como texto "15% / 20%"
  sh.getRange(2, 12, N, 1).setHorizontalAlignment('center');
  aplicarZebra_(sh, 2, N, titulos.length);

  // Valores são escritos por recalcularImposto(). Aqui só a moldura.
}

/* ===================== ABA 8 — PROJEÇÃO E APOSENTADORIA =================== */
function buildProjecao(ss) {
  const sh = ss.getSheetByName(ABAS.PROJECAO);
  sh.getRange('A1').setValue('Projeção e Aposentadoria').setFontSize(16).setFontWeight('bold');
  larguras_(sh, [30, 320, 160, 160, 160, 160, 160]);

  // ---- SEÇÃO A — Parâmetros (inputs amarelos col C) ----
  faixaSecao_(sh, 3, 2, 5, 'SEÇÃO A — Parâmetros do Usuário (edite as células amarelas)', COR.SECAO_BG);
  const inputs = [
    ['Idade atual (anos)', 35, ''],
    ['Idade alvo de aposentadoria (anos)', 55, ''],
    ['Renda mensal desejada (R$, valores de hoje)', 10000, ''],
    ['Patrimônio atual total (R$)', 80000, 'Puxado da carteira, mas editável'],
    ['Aporte mensal atual (R$)', 3000, ''],
    ['Crescimento anual do aporte (%)', 0.05, 'Ex.: 5% a.a. conforme o salário cresce'],
    ['Rentabilidade real esperada (% a.a.)', 0.07, 'Carteira diversificada BR histórico: 6-8% a.a. real'],
    ['IPCA esperado (% a.a.)', 0.045, 'Padrão sugerido: 4,5% (meta Banco Central)'],
    ['Taxa de retirada segura (% a.a.)', 0.04, 'Regra dos 4%: patrimônio tende a não se esgotar em 30 anos']
  ];
  sh.getRange(4, 2, inputs.length, 3).setValues(inputs);
  estiloInput_(sh.getRange(4, 3, inputs.length, 1));
  sh.getRange(PROJ.IDADE_ATUAL).setNumberFormat(FMT.QTD);
  sh.getRange(PROJ.IDADE_ALVO).setNumberFormat(FMT.QTD);
  sh.getRange(PROJ.RENDA_DESEJADA).setNumberFormat(FMT.MOEDA);
  sh.getRange(PROJ.PATRIMONIO_ATUAL).setNumberFormat(FMT.MOEDA);
  sh.getRange(PROJ.APORTE_MENSAL).setNumberFormat(FMT.MOEDA);
  sh.getRange(PROJ.CRESC_APORTE + ':' + 'C12').setNumberFormat(FMT.PERC);
  sh.getRange(4, 4, inputs.length, 1).setFontColor(COR.NEUTRO).setFontStyle('italic');

  faixaSecao_(sh, 13, 2, 5, 'Inputs opcionais', COR.NEUTRO);
  const opc = [
    ['Recebe INSS na aposentadoria? (SIM/NÃO)', 'SIM', ''],
    ['Valor estimado do INSS (R$/mês)', 1500, ''],
    ['Herança / patrimônio externo esperado (R$)', 0, ''],
    ['Possui imóvel para venda futura? (SIM/NÃO)', 'NÃO', ''],
    ['Valor estimado do imóvel (R$)', 0, '']
  ];
  sh.getRange(14, 2, opc.length, 3).setValues(opc);
  estiloInput_(sh.getRange(14, 3, opc.length, 1));
  sh.getRange(PROJ.VALOR_INSS).setNumberFormat(FMT.MOEDA);
  sh.getRange(PROJ.HERANCA).setNumberFormat(FMT.MOEDA);
  sh.getRange(PROJ.VALOR_IMOVEL).setNumberFormat(FMT.MOEDA);
  dropdown_(sh, PROJ.RECEBE_INSS, ['SIM', 'NÃO']);
  dropdown_(sh, PROJ.TEM_IMOVEL, ['SIM', 'NÃO']);

  // ---- SEÇÃO B — Resultados ----
  faixaSecao_(sh, 20, 2, 5, 'SEÇÃO B — Resultado do Planejamento (calculado)', COR.SECAO_BG);
  rotulo_(sh, 21, 'Bloco 1 — Diagnóstico atual');
  rotulos_(sh, 22, [
    'Anos restantes', 'Meses restantes', 'Patrimônio necessário',
    'Gap (necessário − atual)', '% do objetivo já atingido', 'Progresso']);
  sh.getRange(PROJ.PATRIMONIO_NECESSARIO).setNumberFormat(FMT.MOEDA);
  sh.getRange(PROJ.GAP).setNumberFormat(FMT.MOEDA);
  sh.getRange(PROJ.PCT_OBJETIVO).setNumberFormat(FMT.PERC);

  rotulo_(sh, 29, 'Bloco 2 — Projeção do patrimônio na data alvo');
  rotulos_(sh, 30, ['Patrimônio projetado', 'Status']);
  sh.getRange(PROJ.PATRIMONIO_PROJETADO).setNumberFormat(FMT.MOEDA);

  rotulo_(sh, 33, 'Bloco 3 — Renda passiva mensal projetada');
  rotulos_(sh, 34, ['Renda bruta mensal', 'Renda líquida (após IR 15%)', 'Renda total c/ INSS']);
  sh.getRange(34, 3, 3, 1).setNumberFormat(FMT.MOEDA);

  rotulo_(sh, 38, 'Bloco 4 — Simulação de sensibilidade (patrimônio projetado)');
  sh.getRange(PROJ.SENS_HEADER_ROW, 2, 1, 4).setValues(
    [['Rentabilidade ↓ / Aporte →', 'Aporte atual', 'Aporte +20%', 'Aporte +50%']]);
  estiloHeader_(sh.getRange(PROJ.SENS_HEADER_ROW, 2, 1, 4));
  sh.getRange(40, 2, 3, 1).setValues([['5% a.a.'], ['7% a.a.'], ['9% a.a.']]).setFontWeight('bold');
  sh.getRange(40, 3, 3, 3).setNumberFormat(FMT.MOEDA);

  rotulo_(sh, 44, 'Bloco 5 — Aporte mensal mínimo p/ atingir a meta');
  sh.getRange(PROJ.APORTE_MIN_HEADER_ROW, 2, 1, 2).setValues([['Rentabilidade', 'Aporte mínimo mensal']]);
  estiloHeader_(sh.getRange(PROJ.APORTE_MIN_HEADER_ROW, 2, 1, 2));
  sh.getRange(46, 2, 3, 1).setValues([['5% a.a.'], ['7% a.a.'], ['9% a.a.']]).setFontWeight('bold');
  sh.getRange(46, 3, 3, 1).setNumberFormat(FMT.MOEDA);

  // ---- SEÇÃO C — tabela anual ----
  faixaSecao_(sh, 50, 2, 5, 'SEÇÃO C — Projeção Temporal (ano a ano)', COR.SECAO_BG);
  const hC = ['Ano', 'Idade', 'Aporte Anual', 'Patrim. Início', 'Rendimento',
              'Patrim. Fim', '% da Meta', 'Meta (necessário)'];
  sh.getRange(PROJ.TAB_ANUAL_HEADER, 1, 1, hC.length).setValues([hC]);
  estiloHeader_(sh.getRange(PROJ.TAB_ANUAL_HEADER, 1, 1, hC.length));

  // ---- SEÇÃO D — fase de retirada ----
  faixaSecao_(sh, PROJ.SECAO_D_FAIXA, 2, 5, 'SEÇÃO D — Fase de Retirada (pós-aposentadoria)', COR.SECAO_BG);
  sh.getRange(121, 2).setValue('Rentabilidade real na retirada (% a.a.)');
  sh.getRange(PROJ.RET_RENT).setValue(0.05).setNumberFormat(FMT.PERC);
  estiloInput_(sh.getRange(PROJ.RET_RENT));
  sh.getRange(122, 2).setValue('Patrimônio dura até (anos / ano de esgotamento)');
  const hD = ['Ano', 'Idade', 'Patrim. Início', 'Retirada Anual', 'Rendimento', 'Patrim. Fim'];
  sh.getRange(PROJ.TAB_RET_HEADER, 1, 1, hD.length).setValues([hD]);
  estiloHeader_(sh.getRange(PROJ.TAB_RET_HEADER, 1, 1, hD.length));

  // ---- SEÇÃO E — notas ----
  faixaSecao_(sh, PROJ.SECAO_E_FAIXA, 2, 5, 'SEÇÃO E — Notas e Premissas', COR.SECAO_BG);
}

/* ======================== ABA 9 — CONFIGURAÇÕES ========================== */
function buildConfig(ss) {
  const sh = ss.getSheetByName(ABAS.CONFIG);
  sh.getRange('A1').setValue('Configurações').setFontSize(16).setFontWeight('bold');
  larguras_(sh, [30, 240, 160, 40, 160, 120]);

  const params = [
    ['Nome do investidor', 'Investidor Exemplo'],
    ['Ano fiscal corrente', new Date().getFullYear()],
    ['Câmbio USD/BRL', '=GOOGLEFINANCE("CURRENCY:USDBRL")'],
    ['CDI esperado (% a.a.)', 0.105],
    ['IPCA esperado (% a.a.)', 0.045],
    ['Última atualização completa', '=NOW()']
  ];
  sh.getRange(2, 2, params.length, 2).setValues(params);
  estiloInput_(sh.getRange(CFG.NOME_INVESTIDOR));
  estiloInput_(sh.getRange(CFG.ANO_FISCAL));
  estiloInput_(sh.getRange(CFG.CDI_ANUAL));
  estiloInput_(sh.getRange(CFG.IPCA_ANUAL));
  sh.getRange(CFG.USD_BRL).setNumberFormat(FMT.MOEDA);
  sh.getRange(CFG.CDI_ANUAL).setNumberFormat(FMT.PERC);
  sh.getRange(CFG.IPCA_ANUAL).setNumberFormat(FMT.PERC);
  sh.getRange(CFG.ULTIMA_ATUALIZACAO).setNumberFormat('dd/mm/yyyy hh:mm');

  // Tabela de tickers monitorados.
  faixaSecao_(sh, CFG.TICKERS_HEADER_ROW - 1, 2, 2, 'Tickers Monitorados', COR.HEADER_BG);
  sh.getRange(CFG.TICKERS_HEADER_ROW, 2, 1, 2).setValues([['Ticker', 'Tipo']]);
  estiloHeader_(sh.getRange(CFG.TICKERS_HEADER_ROW, 2, 1, 2));
  dropdown_(sh, 'C' + CFG.TICKERS_FIRST_ROW + ':C' + (CFG.TICKERS_FIRST_ROW + 40), TIPOS_RV);

  // Lista de corretoras.
  faixaSecao_(sh, CFG.TICKERS_HEADER_ROW - 1, 5, 1, 'Corretoras', COR.HEADER_BG);
  sh.getRange(CFG.TICKERS_HEADER_ROW, 5).setValue('Corretora').setFontWeight('bold');
  estiloHeader_(sh.getRange(CFG.TICKERS_HEADER_ROW, 5, 1, 1));
}

/* ============================ ABA 1 — DASHBOARD ========================== */
function buildDashboard(ss) {
  const sh = ss.getSheetByName(ABAS.DASHBOARD);
  sh.getRange('A1').setValue('📊 Carteira de Investimentos — Dashboard')
    .setFontSize(18).setFontWeight('bold');
  sh.getRange('A2').setFormula(
    '="Investidor: "&\'' + ABAS.CONFIG + '\'!' + CFG.NOME_INVESTIDOR +
    '&"   •   Atualizado: "&TEXT(\'' + ABAS.CONFIG + '\'!' + CFG.ULTIMA_ATUALIZACAO + ',"dd/mm/yyyy hh:mm")')
    .setFontColor(COR.NEUTRO);
  larguras_(sh, [30, 200, 160, 40, 200, 160, 160]);

  const RV = "'" + ABAS.RENDA_VARIAVEL + "'!";
  const RF = "'" + ABAS.RENDA_FIXA + "'!";

  // --- Cards de patrimônio e rentabilidade (linhas 4-9) ---
  const cards = [
    ['Patrimônio Total', '=SUM(' + RV + 'I2:I)+SUM(' + RF + 'G2:G)'],
    ['Renda Variável', '=SUM(' + RV + 'I2:I)'],
    ['Renda Fixa', '=SUM(' + RF + 'G2:G)'],
    ['Custo Total (RV)', '=SUM(' + RV + 'F2:F)'],
    ['Rentabilidade Total (R$)', '=SUM(' + RV + 'J2:J)'],
    ['Rentabilidade Total (%)', '=IFERROR(SUM(' + RV + 'J2:J)/SUM(' + RV + 'F2:F),0)']
  ];
  sh.getRange(4, 2, cards.length, 2).setValues(cards);
  sh.getRange(4, 2, cards.length, 1).setFontWeight('bold');
  sh.getRange(4, 3, 4, 1).setNumberFormat(FMT.MOEDA);
  sh.getRange(8, 3).setNumberFormat(FMT.MOEDA);
  sh.getRange(9, 3).setNumberFormat(FMT.PERC);
  condFormatSinal_(sh, 'C8:C9');

  // Rentabilidade do mês (preenchida por atualizarDashboard como valor).
  sh.getRange(11, 2).setValue('Rentabilidade do Mês (R$)').setFontWeight('bold');
  sh.getRange(12, 2).setValue('Rentabilidade do Mês (%)').setFontWeight('bold');
  sh.getRange(11, 3).setNumberFormat(FMT.MOEDA);
  sh.getRange(12, 3).setNumberFormat(FMT.PERC);
  condFormatSinal_(sh, 'C11:C12');

  // --- Top 5 posições (linhas 4-9, colunas E/F) ---
  faixaSecao_(sh, 3, 5, 2, 'Top 5 Posições (valor de mercado)', COR.HEADER_BG);
  sh.getRange(4, 5).setFormula(
    '=IFERROR(QUERY(' + RV + 'A2:I, "select A, I where A is not null order by I desc limit 5 label I \'\'", 0), )');
  sh.getRange(4, 6, 5, 1).setNumberFormat(FMT.MOEDA);

  // --- Próximos 3 proventos (preenchido por atualizarDashboard) ---
  faixaSecao_(sh, 11, 5, 3, 'Próximos 3 Proventos', COR.HEADER_BG);
  sh.getRange(12, 5, 1, 3).setValues([['Data', 'Ticker', 'Valor Estimado']]).setFontWeight('bold');
  sh.getRange(13, 7, 3, 1).setNumberFormat(FMT.MOEDA);
  sh.getRange(13, 5, 3, 1).setNumberFormat(FMT.DATA);

  // --- Resultado IR do mês + prejuízo acumulado (preenchidos por dashboard) ---
  faixaSecao_(sh, 18, 2, 5, 'Imposto de Renda — mês atual', COR.HEADER_BG);
  sh.getRange(19, 2).setValue('Resultado IR do mês').setFontWeight('bold');
  sh.getRange(20, 2).setValue('Prejuízo acumulado p/ compensação').setFontWeight('bold');
  sh.getRange(20, 3).setNumberFormat(FMT.MOEDA);

  // --- Card resumo da projeção ---
  faixaSecao_(sh, 22, 2, 5, 'Projeção / Aposentadoria', COR.HEADER_BG);
  const PR = "'" + ABAS.PROJECAO + "'!";
  const proj = [
    ['Patrimônio necessário', '=' + PR + PROJ.PATRIMONIO_NECESSARIO],
    ['Patrimônio projetado', '=' + PR + PROJ.PATRIMONIO_PROJETADO],
    ['Anos restantes', '=' + PR + PROJ.ANOS_RESTANTES],
    ['% do objetivo atingido', '=' + PR + PROJ.PCT_OBJETIVO],
    ['Status', '=' + PR + PROJ.STATUS_META]
  ];
  sh.getRange(23, 2, proj.length, 2).setValues(proj);
  sh.getRange(23, 2, proj.length, 1).setFontWeight('bold');
  sh.getRange(23, 3, 2, 1).setNumberFormat(FMT.MOEDA);
  sh.getRange(26, 3).setNumberFormat(FMT.PERC);

  // Áreas para gráficos serão posicionadas por 07_Charts.
  sh.setHiddenGridlines && sh.setHiddenGridlines(true);
}

/* ============================ HELPERS LOCAIS ============================= */

/** Define larguras de colunas a partir da coluna 1 (ou `start`). */
function larguras_(sh, arr, start) {
  start = start || 1;
  arr.forEach(function (w, i) { sh.setColumnWidth(start + i, w); });
}

/** Rótulo (negrito, col B) numa linha de seção. */
function rotulo_(sh, row, texto) {
  sh.getRange(row, 2).setValue(texto).setFontWeight('bold').setFontColor(COR.HEADER_BG);
}

/** Escreve vários rótulos em col B a partir de `row` (um por linha). */
function rotulos_(sh, row, lista) {
  lista.forEach(function (t, i) { sh.getRange(row + i, 2).setValue(t); });
}

/** Nota cinza pequena ao lado de um cabeçalho. */
function notaCabecalho_(sh, a1, texto) {
  sh.getRange(a1).setNote(texto);
}
