import { CategoriasContasView } from "@/components/financeiro/categorias-contas-view";
import { categoriasContas } from "@/lib/mock";

export default function CategoriasContasPage() {
  return <CategoriasContasView categorias={categoriasContas} />;
}
