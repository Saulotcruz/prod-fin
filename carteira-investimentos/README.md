# Carteira de Investimentos — Google Sheets Premium (Apps Script)

Planilha profissional de controle de investimentos para investidor avançado:
**9 abas**, cotações em tempo quase real (GOOGLEFINANCE), motor de **preço médio**
e **Imposto de Renda** (regras brasileiras), eventos corporativos, proventos e um
**modelo completo de projeção/aposentadoria** (Seções A–E), com gráficos,
formatação condicional, validação de dados, proteção de abas e dados de exemplo.

Tudo é construído por um único script Apps Script. Você cola os arquivos, roda
`setup()` uma vez e a planilha se monta sozinha.

---

## 1. Instalação (≈ 2 minutos)

1. Crie uma planilha nova em <https://sheets.new>.
2. Menu **Extensões → Apps Script**.
3. No editor, **apague** o `Código.gs` padrão e **crie um arquivo para cada `.gs`**
   deste projeto (mesmo nome), colando o conteúdo. Crie também o `appsscript.json`
   (Configurações do projeto → marque "Mostrar arquivo de manifesto appsscript.json").

   | Arquivo | Conteúdo |
   |---------|----------|
   | `appsscript.json` | Manifesto (fuso `America/Sao_Paulo`, runtime V8) |
   | `00_Config.gs` | Constantes (cores, formatos, regras fiscais, âncoras de células) |
   | `01_Setup.gs` | `setup()`, menu, helpers de formatação |
   | `02_Build_Sheets.gs` | Construção das 9 abas |
   | `03_SampleData.gs` | Dados de exemplo |
   | `04_Calculos.gs` | Preço médio, quantidade, IR mensal, posições |
   | `05_Projecao.gs` | Projeção, tabela anual e fase de retirada |
   | `06_Dashboard_Triggers.gs` | Dashboard, `onEdit`, triggers |
   | `07_Charts.gs` | Gráficos e proteção de abas |

4. Selecione a função **`setup`** na barra superior e clique **Executar**.
5. Autorize quando o Google pedir (é a sua conta autorizando o seu próprio script —
   por isso esta etapa acontece no seu navegador e não pode ser feita por terceiros).
6. Volte para a planilha: as 9 abas estarão prontas, populadas e com gráficos. 🎉

A partir daí, o menu **📊 Carteira** aparece automaticamente ao abrir a planilha.

> Reexecutar `setup()` é seguro: ele reconstrói tudo do zero (idempotente).

---

## 2. As 9 abas

| # | Aba | O que faz | Editável? |
|---|-----|-----------|-----------|
| 1 | **Dashboard** | Patrimônio, rentabilidade total e do mês, Top 5, próximos proventos, IR do mês, prejuízo acumulado, card de projeção, gráficos de pizza | Calculada |
| 2 | **Lançamentos** | Entrada de dados (compras, vendas, proventos, eventos). `Valor Total` é automático | **Aberta** |
| 3 | **Renda Variável** | Posição consolidada por ticker, cotação/variação via GOOGLEFINANCE, L/P, % carteira, Yield on Cost | Calculada |
| 4 | **Renda Fixa** | CDB/LCI/LCA/Tesouro/etc., alíquota IR regressiva, valor bruto/líquido no vencimento | **Aberta** |
| 5 | **Proventos** | Dividendos/JCP, IR retido, pivôs por ticker e por mês, gráfico de barras | **Aberta** |
| 6 | **Imposto de Renda** | IR mês a mês com todas as regras (ver abaixo) | Calculada |
| 7 | **Eventos Corporativos** | Split, grupamento, bonificação, subscrição, incorporação; qtd/PM antes/depois automáticos | **Aberta** |
| 8 | **Projeção** | Planejamento de aposentadoria completo, Seções A–E | Seção A **aberta** |
| 9 | **Configurações** | Tickers monitorados, corretoras, USD/BRL, CDI/IPCA, ano fiscal, nome | **Aberta** |

### Como adicionar um lançamento (Aba 2)
Preencha **Data**, **Tipo** (dropdown), **Ticker**, **Corretora**, **Quantidade**,
**Preço Unitário** e **Taxas**. `Valor Total` calcula sozinho e, ao terminar a
edição, posições e IR são recalculados automaticamente (trigger `onEdit`).
Ticker fica em MAIÚSCULAS automaticamente.

### Cadastrar um ticker novo
Adicione-o em **Configurações → Tickers Monitorados** com a classe correta
(AÇÃO/FII/BDR/ETF/STOCK). Isso define a regra de IR e o símbolo do GOOGLEFINANCE.

---

## 3. Regras de Imposto de Renda implementadas (Aba 6)

- Isenção de **ações/BDR**: total de **vendas ≤ R$ 20.000** no mês = isento.
- **FIIs nunca** têm isenção (alíquota **20%**).
- **BDRs** seguem a regra de ações (isenção até R$ 20k, **15%**).
- **ETFs** não têm isenção (**15%** sempre).
- **Prejuízo** compensa apenas lucro da **mesma categoria** (encadeado mês a mês).
- **JCP**: 15% retido na fonte — não entra no cálculo mensal de ganho de capital.
- **Dividendos** são isentos.

> Simplificação documentada: o grupo de 15% (ações/BDR/ETF) compartilha um único
> saldo de prejuízo a compensar; FIIs têm saldo próprio. O custo das vendas é
> derivado do preço médio ajustado no momento de cada venda (replay cronológico).

---

## 4. Projeção / Aposentadoria (Aba 8)

- **Seção A** — inputs (células amarelas, editáveis): idade, renda desejada,
  aporte, crescimento do aporte, rentabilidade real, IPCA, taxa de retirada, INSS…
- **Seção B** — diagnóstico (patrimônio necessário, gap, % do objetivo, barra de
  progresso), patrimônio projetado, renda passiva, **matriz de sensibilidade 3×3**
  e **aporte mínimo** para 3 cenários de rentabilidade.
- **Seção C** — tabela ano a ano + **gráfico de área** (projetado vs meta).
- **Seção D** — fase de retirada + **gráfico de linha** (declínio do patrimônio).
- **Seção E** — premissas usadas no cálculo.

Cálculos em **valores reais**. Fórmulas-chave:

```
Patrimônio necessário = (renda_mensal × 12 / taxa_retirada) × (1 + ipca)^anos

VF aportes (anuidade crescente):
  PMT × [(1+r)^n − (1+g)^n] / (r − g)      (r ≠ g)
  PMT × n × (1+r)^(n−1)                      (r = g)
Patrimônio final = patrimônio_atual × (1+r)^n + VF_aportes

Aporte mínimo = PMT(r_mensal; meses; −patrimônio_atual; patrimônio_necessário)
Renda líquida = (patrimônio × taxa / 12) × (1 − 0,15) + INSS
```

Editar qualquer célula amarela da Seção A recalcula a projeção na hora.
Use **📊 Carteira → Sincronizar patrimônio da carteira** para puxar o patrimônio
atual real da carteira para dentro da projeção.

---

## 5. As 8 funções obrigatórias

| # | Função | Descrição |
|---|--------|-----------|
| 1 | `calcularPrecoMedio(ticker)` | Preço médio ajustado (replay de Lançamentos + Eventos). Também usável como fórmula: `=calcularPrecoMedio("PETR4")` |
| 2 | `calcularQuantidadeAtual(ticker)` | Quantidade atual considerando compras, vendas, splits, grupamentos, bonificações |
| 3 | `calcularIRMensal(mes, ano)` | IR do mês: `{lucro_acoes, lucro_fiis, ir_acoes, ir_fiis, isento, ...}` |
| 4 | `calcularProjecao()` | Recalcula toda a projeção; retorna patrimônio projetado, meta atingida, aporte mínimo, renda mensal projetada |
| 5 | `gerarTabelaAnual()` | Tabela ano a ano (Seção C) com juros compostos + aportes crescentes |
| 6 | `gerarTabelaRetirada()` | Tabela da fase de retirada (Seção D); calcula quando o patrimônio se esgota |
| 7 | `atualizarDashboard()` | Trigger horário: atualiza cotações, recalcula tudo e preenche o Dashboard |
| 8 | `onEdit(e)` | Recalcula posições/IR/projeção ao editar; padroniza ticker em maiúsculas |

Função extra: `instalarTriggers()` registra o gatilho **horário** (`atualizarDashboard`)
e o **onEdit instalável** (`onEditInstalled`). É chamada automaticamente pelo `setup()`.

---

## 6. Dados de exemplo incluídos

PETR4 (200, com split 2:1), VALE3 (150, com venda parcial de 50 para testar o IR),
ITUB4 (300), MXRF11 (500), HGLG11 (com bonificação 10%), AAPL34 (50 BDRs);
RF: CDB Nubank 110% CDI e Tesouro IPCA+ 2029; proventos mensais de FIIs nos últimos
6 meses; parâmetros de projeção: 35→55 anos, renda R$ 10.000, aporte R$ 3.000 (+5%/ano),
rentabilidade real 7%, IPCA 4,5%, retirada 4%, INSS R$ 1.500.

> Para começar a sua carteira real: rode `setup()`, depois limpe as linhas de
> exemplo de **Lançamentos**, **Renda Fixa**, **Proventos** e **Eventos** e insira
> seus dados. Ajuste **Configurações** (tickers/corretoras) e a **Seção A** da Projeção.

### Importar a sua carteira (substitui o exemplo)

O arquivo `08_Import.gs` já vem com as suas posições reais (extraídas da planilha
antiga: preço médio + quantidade por ativo). Para carregá-las:

1. Rode `setup()` uma vez (constrói a planilha correta, com o exemplo).
2. No menu **📊 Carteira → 📥 Importar minha carteira**, ou rode a função
   `importarPosicoesIniciais()` no editor.

Isso **remove os dados de exemplo** e cria 1 lançamento de COMPRA de abertura por
ativo (data de hoje, preço = preço médio), atualiza a lista de tickers e recalcula
tudo. Para ajustar quantidades/preços depois, edite a aba **Lançamentos**.

Ativos importados: 10 ações (BBAS3, BBSE3, TAEE11, CXSE3, VIVA3, ABCB4, ITSA4,
PARD3, KLBN4, LEVE3), 4 FIIs (BRCR11, KNRI11, RBHG11, KNHY11) e 4 internacionais
como STOCK (BRK.B, META (ex-FB), AAPL, QQQ). Excluídos: COGN3 e FAMB11 (vendidos)
e ENBR3 (deslistada). Edite `POSICOES_IMPORTADAS` em `08_Import.gs` para mudar.

> **Locale:** estas planilhas em português usam `;` como separador de fórmulas.
> O projeto detecta o locale e converte automaticamente (helpers `fx_`/`fxs_` em
> `01_Setup.gs`), então as fórmulas funcionam tanto em pt-BR quanto en-US.

---

## 7. Observações

- A cotação do GOOGLEFINANCE tem atraso (~15 min) e cobertura definida pelo Google;
  alguns FIIs/ativos podem não ter cotação — nesses casos o valor de mercado usa o custo.
- A "rentabilidade do mês" usa um *snapshot* do patrimônio no início do mês
  (guardado em `Configurações!I1:I2`); no primeiro mês ela parte do zero.
- As abas calculadas usam proteção com **aviso** (não travam totalmente) para você
  poder ajustar pontualmente se precisar.
