/**
 * 00_Config.gs
 * ----------------------------------------------------------------------------
 * Constantes globais da Carteira de Investimentos.
 * Centraliza paleta de cores, nomes das abas, formatos numéricos, listas de
 * validação e constantes fiscais. Nenhum código de build aqui — só dados.
 * ----------------------------------------------------------------------------
 */

/** Nomes oficiais das 9 abas (usados em todo o projeto). */
const ABAS = {
  DASHBOARD: 'Dashboard',
  LANCAMENTOS: 'Lançamentos',
  RENDA_VARIAVEL: 'Renda Variável',
  RENDA_FIXA: 'Renda Fixa',
  PROVENTOS: 'Proventos',
  IMPOSTO: 'Imposto de Renda',
  EVENTOS: 'Eventos Corporativos',
  PROJECAO: 'Projeção',
  CONFIG: 'Configurações'
};

/** Ordem de criação das abas na planilha. */
const ORDEM_ABAS = [
  ABAS.DASHBOARD, ABAS.LANCAMENTOS, ABAS.RENDA_VARIAVEL, ABAS.RENDA_FIXA,
  ABAS.PROVENTOS, ABAS.IMPOSTO, ABAS.EVENTOS, ABAS.PROJECAO, ABAS.CONFIG
];

/** Paleta de cores (spec de design). */
const COR = {
  HEADER_BG: '#1E3A5F',   // azul escuro - cabeçalhos
  HEADER_TX: '#FFFFFF',   // texto branco do cabeçalho
  ZEBRA: '#F8F9FA',       // linha alternada
  BRANCO: '#FFFFFF',
  POSITIVO: '#1D9E75',    // verde
  NEGATIVO: '#C84B0F',    // vermelho
  NEUTRO: '#888780',      // cinza
  ALERTA: '#E8A020',      // âmbar
  INPUT_BG: '#FFFDE7',    // amarelo suave - células editáveis
  SECAO_BG: '#0D3B44',    // faixa de seção (Projeção)
  CARD_BG: '#EAF1F7'      // fundo de cards do dashboard
};

/** Formatos numéricos padrão. */
const FMT = {
  MOEDA: 'R$ #,##0.00',
  MOEDA_GRANDE: 'R$ #,##0.00',
  PERC: '0.00%',
  PERC_SIMPLES: '0.0%',
  DATA: 'dd/mm/yyyy',
  QTD: '#,##0',
  QTD_DEC: '#,##0.00######'
};

/** Tipos válidos para a coluna Tipo de Lançamentos (dropdown de 8 itens). */
const TIPOS_LANCAMENTO = [
  'COMPRA', 'VENDA', 'DIVIDENDO', 'JCP',
  'SPLIT', 'GRUPAMENTO', 'BONIFICAÇÃO', 'SUBSCRIÇÃO'
];

/** Classes de ativo de renda variável. */
const TIPOS_RV = ['AÇÃO', 'FII', 'BDR', 'ETF', 'STOCK'];

/** Tipos de renda fixa. */
const TIPOS_RF = [
  'CDB', 'LCI', 'LCA', 'LIG',
  'TESOURO_SELIC', 'TESOURO_IPCA', 'TESOURO_PREFIXADO', 'DEBENTURE'
];

/** Indexadores de renda fixa. */
const INDEXADORES = ['CDI', 'IPCA', 'PREFIXADO', 'SELIC'];

/** Tipos de evento corporativo. */
const TIPOS_EVENTO = ['SPLIT', 'GRUPAMENTO', 'BONIFICAÇÃO', 'SUBSCRIÇÃO', 'INCORPORAÇÃO'];

/** Tipos de provento. */
const TIPOS_PROVENTO = ['DIVIDENDO', 'JCP'];

/** Constantes fiscais (IR). */
const IR = {
  LIMITE_ISENCAO_ACOES: 20000,  // vendas mensais de ações/BDR isentas até R$20k
  ALIQUOTA_ACOES: 0.15,         // 15% sobre lucro de ações/BDR/ETF
  ALIQUOTA_FIIS: 0.20,          // 20% sobre lucro de FIIs
  ALIQUOTA_DAYTRADE: 0.20,      // 20% day trade
  ALIQUOTA_JCP: 0.15            // 15% retido na fonte sobre JCP
};

/**
 * Tabela regressiva de IR para renda fixa (por prazo em dias).
 * Retorna a alíquota correspondente ao número de dias decorridos.
 */
function aliquotaRegressivaRF(dias) {
  if (dias > 720) return 0.15;
  if (dias > 360) return 0.175;
  if (dias > 180) return 0.20;
  return 0.225;
}

/**
 * Mapa de qual classe de RV segue qual regra de IR.
 *  - 'ACOES'  : isenção até R$20k (AÇÃO, BDR)
 *  - 'FIIS'   : nunca isento, 20% (FII)
 *  - 'ETF'    : nunca isento, 15% sempre (ETF, STOCK)
 */
function categoriaIR(tipoAtivo) {
  switch (tipoAtivo) {
    case 'AÇÃO':
    case 'BDR':
      return 'ACOES';
    case 'FII':
      return 'FIIS';
    case 'ETF':
    case 'STOCK':
      return 'ETF';
    default:
      return 'ACOES';
  }
}

/** Meses abreviados em PT-BR (índice 1..12). */
const MESES_PT = ['', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

/**
 * Âncoras de células da aba Configurações (linha de cada parâmetro; valor na col B).
 * Mantém build e cálculos sincronizados.
 */
const CFG = {
  // Rótulos ficam na coluna B; VALORES na coluna C.
  NOME_INVESTIDOR: 'C2',
  ANO_FISCAL: 'C3',
  USD_BRL: 'C4',
  CDI_ANUAL: 'C5',
  IPCA_ANUAL: 'C6',
  ULTIMA_ATUALIZACAO: 'C7',
  TICKERS_HEADER_ROW: 10,   // cabeçalho da tabela de tickers monitorados
  TICKERS_FIRST_ROW: 11,
  CORRETORAS_COL: 'E',      // lista de corretoras a partir da linha 11
  CORRETORAS_FIRST_ROW: 11
};

/**
 * Âncoras das células de input/resultado da aba Projeção.
 * Coluna B = rótulo, coluna C = valor (inputs em amarelo; resultados calculados).
 */
const PROJ = {
  // Seção A — inputs (valor na coluna C)
  IDADE_ATUAL: 'C4',
  IDADE_ALVO: 'C5',
  RENDA_DESEJADA: 'C6',
  PATRIMONIO_ATUAL: 'C7',
  APORTE_MENSAL: 'C8',
  CRESC_APORTE: 'C9',
  RENT_REAL: 'C10',
  IPCA: 'C11',
  TAXA_RETIRADA: 'C12',
  // inputs opcionais
  RECEBE_INSS: 'C14',
  VALOR_INSS: 'C15',
  HERANCA: 'C16',
  TEM_IMOVEL: 'C17',
  VALOR_IMOVEL: 'C18',
  // Seção B — Bloco 1 diagnóstico (valor na coluna C)
  ANOS_RESTANTES: 'C22',
  MESES_RESTANTES: 'C23',
  PATRIMONIO_NECESSARIO: 'C24',
  GAP: 'C25',
  PCT_OBJETIVO: 'C26',
  BARRA_PROGRESSO: 'C27',
  // Bloco 2 — projeção
  PATRIMONIO_PROJETADO: 'C30',
  STATUS_META: 'C31',
  // Bloco 3 — renda passiva
  RENDA_BRUTA: 'C34',
  RENDA_LIQUIDA: 'C35',
  RENDA_TOTAL_INSS: 'C36',
  // Bloco 4 — sensibilidade: cabeçalho na linha 39, valores 3x3 nas linhas 40-42, cols C-E
  SENS_HEADER_ROW: 39,
  SENS_FIRST_VAL_ROW: 40,
  SENS_FIRST_VAL_COL: 3,
  SENS_RENTS: [0.05, 0.07, 0.09],         // linhas
  SENS_FATORES_APORTE: [1.0, 1.2, 1.5],   // colunas (atual, +20%, +50%)
  // Bloco 5 — aporte mínimo (3 cenários de rentabilidade), valor na coluna C
  APORTE_MIN_HEADER_ROW: 45,
  APORTE_MIN_FIRST_ROW: 46,               // 46,47,48 -> 5%,7%,9%
  APORTE_MIN_RENTS: [0.05, 0.07, 0.09],
  // Seção C — tabela ano a ano
  TAB_ANUAL_HEADER: 51,
  TAB_ANUAL_FIRST: 52,
  TAB_ANUAL_MAX: 65,                       // limpa/usa até esta qtd de linhas
  // Seção D — fase de retirada (bloco fixo, bem abaixo da tabela anual)
  SECAO_D_FAIXA: 120,
  RET_RENT: 'C121',                        // input: rentabilidade real na retirada
  RET_DURACAO: 'C122',                     // resultado: anos até esgotar
  TAB_RET_HEADER: 124,
  TAB_RET_FIRST: 125,
  TAB_RET_MAX: 60,
  // Seção E — notas e premissas
  SECAO_E_FAIXA: 190,
  SECAO_E_FIRST: 191
};
