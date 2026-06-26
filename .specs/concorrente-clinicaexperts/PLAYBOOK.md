# Playbook de automação — documentar Clínica Experts (para agentes)

Você documenta páginas do app **Clínica Experts** (concorrente) via `playwright-cli`. Sistema já mapeado; siga este playbook à risca.

## Sua sessão isolada (NÃO use a sessão `default`)

Cada agente tem um nome de sessão próprio passado no prompt (ex.: `ag-vendas`). Use `-s=<sua-sessão>` em TODOS os comandos.

Setup (uma vez):
```bash
cd "C:/Users/lucsb/artemise"
playwright-cli -s=<sessão> open                      # headless, perfil isolado em memória
playwright-cli -s=<sessão> state-load auth.json      # injeta login (cookies+localStorage)
playwright-cli -s=<sessão> resize 1920 1000
```
Ao terminar TUDO: `playwright-cli -s=<sessão> close`

> `auth.json` está em `C:/Users/lucsb/artemise/auth.json`. Já autentica. Se cair em `/signin`, pare e reporte (token expirou).

## Scripts compartilhados (em `.specs/concorrente-clinicaexperts/`)

- **Extrair campos:** `playwright-cli -s=<sessão> --raw run-code --filename=".specs/concorrente-clinicaexperts/extract-fields.js" 2>/dev/null | node ".specs/concorrente-clinicaexperts/fmt.js"`
- **Matar overlays (Userpilot/tour/backdrop):** `playwright-cli -s=<sessão> --raw run-code --filename=".specs/concorrente-clinicaexperts/kill-overlays.js"`

## Rotina por página

```bash
playwright-cli -s=<sessão> goto <URL>
sleep 3
playwright-cli -s=<sessão> --raw run-code --filename=".../kill-overlays.js"   # remove tour
playwright-cli -s=<sessão> screenshot --filename=".specs/concorrente-clinicaexperts/paginas/<nome>.png"
# extrair campos (comando acima)
```
Leia o screenshot (Read tool) só se a extração não bastar.

## Abrir formulários de criação (FAB)

O botão **+** flutuante (`data-cy=floating-button`) abre menu de criação. Truque que funciona:
```bash
playwright-cli -s=<sessão> click "button[data-cy=floating-button]"
sleep 1
# listar opções:
playwright-cli -s=<sessão> --raw run-code "async page => { return await page.evaluate(() => [...new Set([...document.querySelectorAll('.eui-floating-button-action-tooltip')].map(e=>e.textContent.trim()).filter(Boolean))]); }"
# clicar uma opção pelo texto (clique JS direto no pill — clique por coordenada NÃO funciona):
playwright-cli -s=<sessão> --raw run-code "async page => { return await page.evaluate(() => { const el=[...document.querySelectorAll('.eui-floating-button-action-tooltip')].find(e=>e.textContent.trim()==='NOME_OPCAO'); if(el){el.click();return 'ok';} return 'nf'; }); }"
sleep 2
# matar overlays de novo (o tour pode reaparecer), extrair campos
```

Muitos modais são **deep-linkáveis** por query param (procure `*_modal_type`/`*_modal_mode` na URL após abrir). Reabrir por URL é mais barato.

## Preencher + salvar (fill/save) — registros de teste

Para CADA form de criação, crie 1 registro de teste:
- Texto/nome: prefixe com `[DOC-TESTE]` (ex.: `[DOC-TESTE] Venda 001`).
- Preencha o mínimo obrigatório (campos `*`). Se validar campos extras, capture a msg de validação (é documentação valiosa) e então preencha.
- Salvar: `playwright-cli -s=<sessão> click "getByRole('button', { name: 'Salvar' })"` (ou o label real).
- Fill por placeholder: `playwright-cli -s=<sessão> fill "getByPlaceholder('...')" "valor"`.
- Selects de busca: clique no campo, digite, e clique a opção que aparece.
- Confirme sucesso (toast/linha nova/URL) e capture no doc. Se não salvar por falta de dado, documente o que faltou.

Paciente de teste já existe: **Clara Ribeiro (Paciente de exemplo)** — use nos vínculos.

## Formato do doc (1 markdown por página em `paginas/<nome>.md`)

```markdown
# <Título>
**Rota:** `<url>`  ·  **Tipo:** <listagem/form/dashboard>  ·  **Screenshot:** `<nome>.png`

## Propósito
## Layout / listagem (colunas, ações, filtros, paginação)
## Sub-abas / sub-páginas
## Form(s): <nome>  — tabela: Campo | Tipo | Obrig. | Opções/Validação/Notas
## Fluxos (ex.: criar → salvar → resultado; teste [DOC-TESTE] criado)
## Observações para o Artemise (insights de produto/UX reaproveitáveis)
```

Seja exaustivo: TODOS os campos, opções de select, validações, sub-abas, botões de ação. Recursivo: se uma página tem sub-páginas/abas, documente cada uma.

## Regras de segurança
- Allowlist: criar/salvar/navegar/abrir. **NUNCA** deletar registros existentes, enviar e-mail/SMS/WhatsApp real, gerar cobrança/nota fiscal real, alterar config de pagamento/conta, ou clicar "Excluir" em dados que não sejam seus `[DOC-TESTE]`.
- Em dúvida se uma ação é destrutiva/externa: NÃO faça; documente o campo/botão e siga.

## Entregável
Liste no retorno: arquivos `.md` criados, registros `[DOC-TESTE]` criados, e qualquer bloqueio.
```
