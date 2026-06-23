import { redirect } from "next/navigation";

export default async function PacienteFichaIndex({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/pacientes/${id}/informacoes`);
}
