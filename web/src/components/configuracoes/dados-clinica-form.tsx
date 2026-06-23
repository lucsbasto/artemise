"use client";
import * as React from "react";
import { User } from "lucide-react";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-sm">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {hint && <p className="mt-1 text-sm text-muted-2">{hint}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Bloco de endereço/contato (reutilizado em comercial e cobrança). */
function AddressFields() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Field label="Telefone" required>
        <div className="flex gap-2">
          <span className="inline-flex h-9 shrink-0 items-center gap-1 rounded-lg border border-border px-2 text-sm text-foreground">
            🇧🇷 +55
          </span>
          <Input placeholder="(99) 9999-9999" className="flex-1" />
        </div>
      </Field>
      <Field label="E-mail" required>
        <Input type="email" placeholder="Digite" />
      </Field>
      <Field label="País" required>
        <Select defaultValue="">
          <option value="" disabled>
            Selecione
          </option>
          <option value="BR">Brasil</option>
        </Select>
      </Field>
      <Field label="Código postal" required>
        <Input placeholder="00000-000" />
      </Field>
      <Field label="Estado" required>
        <Select defaultValue="">
          <option value="" disabled>
            Selecione
          </option>
          <option value="SP">São Paulo</option>
        </Select>
      </Field>
      <Field label="Cidade" required>
        <Select defaultValue="">
          <option value="" disabled>
            Selecione
          </option>
        </Select>
      </Field>
      <Field label="Bairro" required>
        <Input placeholder="Digite" />
      </Field>
      <Field label="Rua" required>
        <Input placeholder="Digite" />
      </Field>
      <Field label="Número" required>
        <Input placeholder="Digite" />
      </Field>
      <Field label="Complemento">
        <Input placeholder="Digite" />
      </Field>
    </div>
  );
}

/** Tela 31 — Dados da clínica (formulário de registro único). */
export function DadosClinicaForm() {
  const [tipo, setTipo] = React.useState<"fisica" | "juridica">("juridica");

  return (
    <div className="flex flex-col gap-5">
      <Section title="Dados da clínica">
        <div className="grid grid-cols-2 gap-6">
          {/* coluna esquerda — identificação */}
          <div className="flex flex-col gap-4">
            <Field label="Tipo de pessoa" required>
              <div className="inline-flex rounded-lg bg-background p-1">
                {(["fisica", "juridica"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipo(t)}
                    className={cn(
                      "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                      tipo === t ? "bg-brand text-white" : "text-muted-2 hover:text-foreground"
                    )}
                  >
                    {t === "fisica" ? "Física" : "Jurídica"}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={tipo === "fisica" ? "CPF" : "CNPJ"} required>
              <Input placeholder={tipo === "fisica" ? "000.000.000-00" : "00.000.000/0000-00"} />
            </Field>
            <Field label="Nome fantasia" required>
              <Input defaultValue="ateste" />
            </Field>
            <Field label="Razão social" required>
              <Input defaultValue="Lucas Bastos" />
            </Field>
          </div>

          {/* coluna direita — logotipo */}
          <Field label="Logotipo">
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border px-4 py-6 text-center">
              <span className="grid size-16 place-items-center rounded-full bg-background text-muted-2">
                <User className="size-7" />
              </span>
              <p className="text-sm text-muted-2">
                Selecione um arquivo JPG, PNG ou JPEG do seu dispositivo
              </p>
              <p className="text-xs text-muted-2">Arraste e solte arquivos aqui, ou</p>
              <Button variant="soft" size="sm">
                Escolher foto
              </Button>
            </div>
          </Field>
        </div>
      </Section>

      <Section
        title="Endereço e contato comercial"
        hint="Informe os dados comerciais da sua clínica. Eles serão utilizados em notificações enviadas para seus pacientes."
      >
        <AddressFields />
      </Section>

      <Section
        title="Endereço e contato de cobrança"
        hint="Informe os dados de cobrança da sua clínica. Eles serão utilizados para emissão da nota fiscal."
      >
        <AddressFields />
      </Section>

      <div className="flex justify-center">
        <Button variant="brand">Salvar</Button>
      </div>
    </div>
  );
}
