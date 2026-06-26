# Prontuário — Ficha Fotos e anexos

**Rota:** `/atendimentos/editar/{uuid}` (sidebar → **Fotos e anexos**)
**Tipo:** Formulário de atendimento (mídia/documentos)
**Screenshot:** (layout simples de upload)

## Propósito

Anexar imagens (antes/depois, exames visuais) e documentos ao atendimento.

> Estrutura comum (header/sidebar/rodapé) em `prontuario-ficha-anamnese.md`.

## Campos

| # | Campo | Tipo | Notas |
|---|---|---|---|
| 1 | Imagens | upload (file) | fotos do paciente/procedimento |
| 2 | Documentos | upload (file) | arquivos diversos (PDF, exames) |

## Observações para o Artemise

- Separar **Imagens** de **Documentos** facilita galeria de antes/depois vs. anexos administrativos.
- Vincular mídia ao atendimento específico (não só ao paciente) preserva contexto temporal/evolutivo.
