"use client";
/**
 * Mapa de injetáveis facial (MVP — vista frontal).
 * Dois modos escolhidos pelo profissional:
 *  - "mão livre": clica em qualquer ponto do rosto e registra unidades.
 *  - "selecionável": clica numa região anatômica pré-definida (semente; futura config da clínica).
 * Rastreabilidade (marca/lote/diluição/validade) é POR substância.
 *
 * Estado serializável (`FichaInjetaveis`) é controlado via `value`/`onChange` quando
 * embutido na ficha do paciente; sem props roda em modo não-controlado (rota demo).
 * Substâncias vêm do Estoque (itens categoria "Injetáveis"); a baixa por ui é feita
 * pelo container ao salvar — aqui só avisamos saldo insuficiente.
 * Spec: .specs/features/mapa-injetaveis/spec.md + procedimentos-aba/spec.md
 */
import * as React from "react";
import { Check, X, Hand, MapPin, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Field, Input } from "@/components/ui/field";
import { useCollection } from "@/lib/data/create-collection";
import { estoqueStore } from "@/lib/data/stores";
import {
  fichaInjetaveisVazia,
  type FichaInjetaveis,
  type ModoMapa,
  type PontoInjetavel,
  type RastreioInjetavel,
} from "@/lib/mock";

/* ---------- Tipos de apresentação ---------- */
type IconeMarcador = "dot" | "triangle" | "square";

type Substancia = {
  id: string; // = id do item de Estoque
  nome: string;
  cor: string; // hex
  icone: IconeMarcador;
  unidade: string;
  saldo: number; // saldo atual em estoque (live)
};

type RegiaoFacial = {
  id: string;
  nome: string;
  x: number; // 0..1 relativo ao viewBox da imagem
  y: number; // 0..1
};

// Paleta/ícones atribuídos por ordem aos itens injetáveis do estoque.
const PALETA: { cor: string; icone: IconeMarcador }[] = [
  { cor: "#2563eb", icone: "dot" },
  { cor: "#dc2626", icone: "dot" },
  { cor: "#16a34a", icone: "triangle" },
  { cor: "#d97706", icone: "square" },
  { cor: "#7c3aed", icone: "dot" },
  { cor: "#0891b2", icone: "triangle" },
];

// Regiões faciais comuns (coordenadas relativas à vista frontal). Editáveis pela clínica no futuro.
const REGIOES_SEED: RegiaoFacial[] = [
  { id: "testa", nome: "Testa", x: 0.5, y: 0.4 },
  { id: "glabela", nome: "Glabela", x: 0.5, y: 0.44 },
  { id: "pe-galinha-e", nome: "Pés-de-galinha E", x: 0.22, y: 0.47 },
  { id: "pe-galinha-d", nome: "Pés-de-galinha D", x: 0.8, y: 0.47 },
  { id: "sobrancelha-e", nome: "Cauda da sobrancelha E", x: 0.3, y: 0.45 },
  { id: "sobrancelha-d", nome: "Cauda da sobrancelha D", x: 0.7, y: 0.45 },
  { id: "bunny", nome: "Bunny lines", x: 0.5, y: 0.5 },
  { id: "malar-e", nome: "Malar E", x: 0.27, y: 0.55 },
  { id: "malar-d", nome: "Malar D", x: 0.73, y: 0.55 },
  { id: "nasolabial-e", nome: "Sulco nasolabial E", x: 0.4, y: 0.62 },
  { id: "nasolabial-d", nome: "Sulco nasolabial D", x: 0.61, y: 0.62 },
  { id: "labios", nome: "Lábios / código de barras", x: 0.5, y: 0.68 },
  { id: "dao-e", nome: "DAO E", x: 0.42, y: 0.72 },
  { id: "dao-d", nome: "DAO D", x: 0.59, y: 0.72 },
  { id: "masseter-e", nome: "Masseter E", x: 0.2, y: 0.66 },
  { id: "masseter-d", nome: "Masseter D", x: 0.8, y: 0.66 },
  { id: "mento", nome: "Mento", x: 0.5, y: 0.78 },
];

const emptyRastreio = (): RastreioInjetavel => ({
  marca: "",
  numeroLote: "",
  dataDiluicao: "",
  volumeDiluicao: "",
  dataValidade: "",
});

let _seq = 0;
const novoId = () => `pt-${++_seq}`;

/* ---------- Marcador (dot/triangle/square) ---------- */
function Marcador({ cor, icone, size = 14 }: { cor: string; icone: IconeMarcador; size?: number }) {
  if (icone === "triangle") {
    return (
      <span
        style={{ borderBottomColor: cor, borderLeftWidth: size / 2, borderRightWidth: size / 2, borderBottomWidth: size }}
        className="inline-block border-x-transparent border-x-solid"
      />
    );
  }
  return (
    <span
      style={{ background: cor, width: size, height: size, borderRadius: icone === "square" ? 3 : "50%" }}
      className="inline-block"
    />
  );
}

interface MapaInjetaveisProps {
  /** Estado controlado da ficha. Omitido → componente gerencia estado interno (demo). */
  value?: FichaInjetaveis;
  onChange?: (ficha: FichaInjetaveis) => void;
  /** ui já baixadas do estoque para este registro (por substanciaId), p/ cálculo de saldo disponível. */
  estoqueBaseline?: Record<string, number>;
}

export function MapaInjetaveis({ value, onChange, estoqueBaseline = {} }: MapaInjetaveisProps) {
  // Substâncias = itens de estoque na categoria "Injetáveis" (cor/ícone por ordem).
  const { items: estoque } = useCollection(estoqueStore);
  const substancias: Substancia[] = React.useMemo(
    () =>
      estoque
        .filter((i) => i.categoria === "Injetáveis")
        .map((i, idx) => ({
          id: i.id,
          nome: i.nome,
          cor: PALETA[idx % PALETA.length].cor,
          icone: PALETA[idx % PALETA.length].icone,
          unidade: i.unidade,
          saldo: i.saldo,
        })),
    [estoque]
  );

  // Estado serializável: controlado (value/onChange) ou interno (uncontrolled).
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<FichaInjetaveis>(() => value ?? fichaInjetaveisVazia());
  const ficha = isControlled ? (value as FichaInjetaveis) : internal;
  const setFicha = React.useCallback(
    (updater: (f: FichaInjetaveis) => FichaInjetaveis) => {
      const next = updater(isControlled ? (value as FichaInjetaveis) : internal);
      if (isControlled) onChange?.(next);
      else setInternal(next);
    },
    [isControlled, value, internal, onChange]
  );

  const { pontos, rastreioPorSub, relatorio } = ficha;

  // Estado de UI (não persiste no registro).
  const [modo, setModo] = React.useState<ModoMapa>("mao-livre");
  const [substanciaAtivaId, setSubstanciaAtivaId] = React.useState<string | null>(null);
  const [exibirQuantidades, setExibirQuantidades] = React.useState(true);
  const [popover, setPopover] = React.useState<
    | { tipo: "novo"; x: number; y: number; regiaoId?: string; valor: string }
    | { tipo: "edita"; pontoId: string; x: number; y: number; valor: string }
    | null
  >(null);

  const mapaRef = React.useRef<HTMLDivElement>(null);
  const substanciaAtiva = substancias.find((s) => s.id === substanciaAtivaId) ?? null;

  const totalPorSub = React.useMemo(() => {
    const acc: Record<string, number> = {};
    for (const p of pontos) acc[p.substanciaId] = (acc[p.substanciaId] ?? 0) + p.unidades;
    return acc;
  }, [pontos]);

  // Saldo disponível p/ uma substância = saldo em estoque + o que já foi baixado neste registro.
  function disponivelDe(sub: Substancia) {
    return sub.saldo + (estoqueBaseline[sub.id] ?? 0);
  }
  function corDe(substanciaId: string) {
    return substancias.find((s) => s.id === substanciaId)?.cor ?? "#666";
  }
  function iconeDe(substanciaId: string) {
    return substancias.find((s) => s.id === substanciaId)?.icone ?? "dot";
  }

  function selecionarSubstancia(id: string) {
    setSubstanciaAtivaId((cur) => (cur === id ? null : id)); // clicar de novo sai do "modo adicionar"
    setPopover(null);
  }

  // Mão livre: clique em qualquer ponto do mapa.
  function handleClickMapa(e: React.MouseEvent<HTMLDivElement>) {
    if (modo !== "mao-livre" || !substanciaAtiva) return;
    const rect = mapaRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setPopover({ tipo: "novo", x, y, valor: "" });
  }

  // Selecionável: clique numa região.
  function handleClickRegiao(r: RegiaoFacial, e: React.MouseEvent) {
    e.stopPropagation();
    if (!substanciaAtiva) return;
    setPopover({ tipo: "novo", x: r.x, y: r.y, regiaoId: r.id, valor: "" });
  }

  function handleClickPonto(p: PontoInjetavel, e: React.MouseEvent) {
    e.stopPropagation();
    setPopover({ tipo: "edita", pontoId: p.id, x: p.x, y: p.y, valor: String(p.unidades) });
  }

  function confirmarPopover() {
    if (!popover) return;
    const unidades = Number(popover.valor);
    if (!unidades || unidades <= 0) return; // exige quantidade > 0
    if (popover.tipo === "novo") {
      if (!substanciaAtiva) return;
      const novo: PontoInjetavel = {
        id: novoId(),
        substanciaId: substanciaAtiva.id,
        modo,
        x: popover.x,
        y: popover.y,
        regiaoId: popover.regiaoId,
        unidades,
      };
      setFicha((f) => ({ ...f, pontos: [...f.pontos, novo] }));
    } else {
      const id = popover.pontoId;
      setFicha((f) => ({
        ...f,
        pontos: f.pontos.map((p) => (p.id === id ? { ...p, unidades } : p)),
      }));
    }
    setPopover(null);
  }

  function removerPonto(pontoId: string) {
    setFicha((f) => ({ ...f, pontos: f.pontos.filter((p) => p.id !== pontoId) }));
    setPopover(null);
  }

  function setRastreioCampo(campo: keyof RastreioInjetavel, valor: string) {
    if (!substanciaAtiva) return;
    const sid = substanciaAtiva.id;
    setFicha((f) => ({
      ...f,
      rastreioPorSub: {
        ...f.rastreioPorSub,
        [sid]: { ...(f.rastreioPorSub[sid] ?? emptyRastreio()), [campo]: valor },
      },
    }));
  }
  const rastreioAtivo = substanciaAtiva
    ? rastreioPorSub[substanciaAtiva.id] ?? emptyRastreio()
    : null;

  const popoverPos = popover ? { left: `${popover.x * 100}%`, top: `${popover.y * 100}%` } : undefined;

  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-sm">
      {/* Toggle de modo */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Injetáveis (Facial)</h2>
        <div className="inline-flex rounded-lg border border-border p-0.5">
          <button
            onClick={() => setModo("mao-livre")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              modo === "mao-livre" ? "bg-brand text-white" : "text-muted hover:text-foreground"
            )}
          >
            <Hand className="size-4" /> Mão livre
          </button>
          <button
            onClick={() => setModo("selecionavel")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              modo === "selecionavel" ? "bg-brand text-white" : "text-muted hover:text-foreground"
            )}
          >
            <MapPin className="size-4" /> Selecionável
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Legenda de substâncias */}
        <div className="lg:w-64">
          <p className="mb-2 text-xs font-medium text-muted-2">Substâncias</p>
          {substancias.length === 0 ? (
            <p className="text-sm text-muted-2">
              Sem itens injetáveis no estoque. Cadastre itens na categoria “Injetáveis”.
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {substancias.map((s) => {
                const ativa = s.id === substanciaAtivaId;
                const aplicado = totalPorSub[s.id] ?? 0;
                const excede = aplicado > disponivelDe(s);
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => selecionarSubstancia(s.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                        ativa ? "border-brand bg-brand-50" : "border-border hover:bg-background"
                      )}
                    >
                      <Marcador cor={s.cor} icone={s.icone} />
                      <span className="flex-1 text-foreground">{s.nome}</span>
                      <span className={cn("tabular-nums font-medium", excede ? "text-danger" : "text-muted")}>
                        {aplicado} {s.unidade}
                      </span>
                    </button>
                    {ativa && (
                      <p className={cn("mt-1 px-3 text-xs", excede ? "text-danger" : "text-muted-2")}>
                        {excede
                          ? `Saldo insuficiente: ${disponivelDe(s)} ${s.unidade} disponíveis.`
                          : `Saldo disponível: ${disponivelDe(s)} ${s.unidade}.`}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mt-3 text-xs text-muted-2">
            {substanciaAtiva
              ? modo === "mao-livre"
                ? "Clique no rosto para marcar a aplicação."
                : "Clique numa região destacada."
              : "Selecione uma substância para começar."}
          </p>

          <label className="mt-4 flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={exibirQuantidades}
              onChange={(e) => setExibirQuantidades(e.target.checked)}
              className="size-4 accent-[var(--brand,#7c3aed)]"
            />
            Exibir quantidades
          </label>
        </div>

        {/* Mapa */}
        <div className="flex justify-center">
          <div
            ref={mapaRef}
            onClick={handleClickMapa}
            style={{ width: 320, height: Math.round(320 * (1280 / 729)) }}
            className={cn(
              "relative select-none rounded-lg bg-white",
              modo === "mao-livre" && substanciaAtiva ? "cursor-crosshair" : "cursor-default"
            )}
          >
            {/* Camada base: rosto frontal (asset CC0) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mapa-injetaveis/face-frontal.svg"
              alt="Mapa facial"
              draggable={false}
              className="pointer-events-none absolute inset-0 size-full object-contain"
            />

            {/* Regiões (modo selecionável) */}
            {modo === "selecionavel" &&
              REGIOES_SEED.map((r) => (
                <button
                  key={r.id}
                  title={r.nome}
                  onClick={(e) => handleClickRegiao(r, e)}
                  style={{ left: `${r.x * 100}%`, top: `${r.y * 100}%` }}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed transition-colors",
                    "size-7 border-brand/50 hover:border-brand hover:bg-brand-50/60",
                    !substanciaAtiva && "cursor-not-allowed opacity-50"
                  )}
                />
              ))}

            {/* Pontos aplicados */}
            {pontos.map((p) => (
              <button
                key={p.id}
                onClick={(e) => handleClickPonto(p, e)}
                style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
              >
                <span className="relative flex items-center justify-center">
                  <Marcador cor={corDe(p.substanciaId)} icone={iconeDe(p.substanciaId)} size={16} />
                  {exibirQuantidades && (
                    <span
                      className="absolute left-1/2 top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded bg-foreground/80 px-1 py-0.5 text-[10px] font-medium leading-none text-white"
                    >
                      {p.unidades} ui
                    </span>
                  )}
                </span>
              </button>
            ))}

            {/* Popover de unidades */}
            {popover && (
              <div
                style={popoverPos}
                onClick={(e) => e.stopPropagation()}
                className="absolute z-10 -translate-y-1/2 translate-x-3 rounded-lg border border-border bg-surface p-1.5 shadow-md"
              >
                <div className="flex items-center gap-1">
                  <input
                    autoFocus
                    type="number"
                    min={1}
                    value={popover.valor}
                    onChange={(e) => setPopover({ ...popover, valor: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && confirmarPopover()}
                    placeholder="ui"
                    className="h-8 w-16 rounded-md border border-border px-2 text-sm outline-none focus:border-brand"
                  />
                  <button
                    onClick={confirmarPopover}
                    className="flex size-8 items-center justify-center rounded-md bg-green-50 text-green-600 hover:bg-green-100"
                    title="Confirmar"
                  >
                    <Check className="size-4" />
                  </button>
                  {popover.tipo === "edita" ? (
                    <button
                      onClick={() => removerPonto(popover.pontoId)}
                      className="flex size-8 items-center justify-center rounded-md bg-red-50 text-red-500 hover:bg-red-100"
                      title="Remover"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setPopover(null)}
                      className="flex size-8 items-center justify-center rounded-md bg-background text-muted hover:text-foreground"
                      title="Cancelar"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rastreabilidade por substância + relatório */}
        <div className="flex-1 lg:max-w-sm">
          {substanciaAtiva ? (
            <>
              <p className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-2">
                <Marcador cor={substanciaAtiva.cor} icone={substanciaAtiva.icone} size={10} />
                Rastreio — {substanciaAtiva.nome}
              </p>
              <div className="flex flex-col gap-3">
                <Field label="Marca">
                  <Input
                    value={rastreioAtivo!.marca}
                    onChange={(e) => setRastreioCampo("marca", e.target.value)}
                    placeholder="Digite"
                  />
                </Field>
                <Field label="Número do lote">
                  <Input
                    value={rastreioAtivo!.numeroLote}
                    onChange={(e) => setRastreioCampo("numeroLote", e.target.value)}
                    placeholder="Digite"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Data de diluição">
                    <Input
                      type="date"
                      value={rastreioAtivo!.dataDiluicao}
                      onChange={(e) => setRastreioCampo("dataDiluicao", e.target.value)}
                    />
                  </Field>
                  <Field label="Volume de diluição">
                    <Input
                      value={rastreioAtivo!.volumeDiluicao}
                      onChange={(e) => setRastreioCampo("volumeDiluicao", e.target.value)}
                      placeholder="ex.: 2 ml"
                    />
                  </Field>
                </div>
                <Field label="Data de validade">
                  <Input
                    type="date"
                    value={rastreioAtivo!.dataValidade}
                    onChange={(e) => setRastreioCampo("dataValidade", e.target.value)}
                  />
                </Field>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-2">
              Selecione uma substância para registrar marca, lote e validade do produto.
            </p>
          )}

          <Field label="Relatório" className="mt-3">
            <textarea
              value={relatorio}
              onChange={(e) => setFicha((f) => ({ ...f, relatorio: e.target.value }))}
              rows={3}
              placeholder="Descrição da aplicação…"
              className="w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none placeholder:text-muted-2 focus:border-brand"
            />
          </Field>
        </div>
      </div>
    </div>
  );
}
