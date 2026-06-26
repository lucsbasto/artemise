import { MapaInjetaveis } from "@/components/ficha/mapa-injetaveis";

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-1 text-lg font-semibold text-foreground">Mapa de Injetáveis</h1>
      <p className="mb-4 text-sm text-muted-2">
        Demo (MVP) — vista frontal. Escolha o modo Mão livre ou Selecionável.
      </p>
      <MapaInjetaveis />
    </div>
  );
}
