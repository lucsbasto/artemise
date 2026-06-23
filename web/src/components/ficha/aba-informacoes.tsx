import {
  User,
  Cake,
  VenusAndMars,
  Mail,
  Phone,
  Bell,
  MapPin,
  IdCard,
  FileText,
  Clock,
  Settings,
  Pencil,
  MessageCircle,
} from "lucide-react";
import { fichaPaciente } from "@/lib/mock";

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-border py-4 last:border-b-0">
      <span className="mt-0.5 text-muted-2">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-muted">{label}</p>
        <div className="mt-0.5 text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}

export function AbaInformacoes() {
  const p = fichaPaciente;
  return (
    <div className="rounded-[var(--radius-card)] border border-border bg-surface p-5 shadow-sm">
      <h2 className="text-base font-semibold text-foreground">Informações</h2>

      <div className="mt-2">
        <Row icon={<User className="size-4" />} label="Nome completo">{p.nome}</Row>
        <Row icon={<Cake className="size-4" />} label="Data de nascimento">
          {p.dataNascimento} ({p.idade} anos)
        </Row>
        <Row icon={<VenusAndMars className="size-4" />} label="Sexo">{p.sexo}</Row>
        <Row icon={<Mail className="size-4" />} label="Email">{p.email}</Row>
        <Row icon={<Phone className="size-4" />} label="Telefone">
          <span className="inline-flex items-center gap-1.5">
            {p.telefone}
            <MessageCircle className="size-4 text-green-500" />
          </span>
        </Row>
        <Row icon={<Bell className="size-4" />} label="Notificações">
          {p.recebeNotificacoes ? "Recebe notificações" : "Não recebe notificações"}
        </Row>
        <Row icon={<MapPin className="size-4" />} label="Endereço">
          {p.endereco.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </Row>
        <Row icon={<IdCard className="size-4" />} label="CPF">{p.cpf}</Row>
        <Row icon={<FileText className="size-4" />} label="Observações">{p.observacoes}</Row>
        <Row icon={<Clock className="size-4" />} label="Cadastrado em">{p.criadoEm}</Row>
        <Row icon={<Settings className="size-4" />} label="Status">{p.status}</Row>
      </div>

      <button className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
        <Pencil className="size-4" /> Editar informações
      </button>
    </div>
  );
}
