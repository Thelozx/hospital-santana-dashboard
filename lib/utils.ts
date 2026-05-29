import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatarData(iso: string): string {
  return format(new Date(iso), "dd/MM/yyyy HH:mm", { locale: ptBR });
}

export function formatarDataCurta(iso: string): string {
  return format(new Date(iso), "dd/MM/yyyy", { locale: ptBR });
}

export function tempoRelativo(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: ptBR });
}

export function formatarDuracao(segundos: number): string {
  if (segundos < 60) return `${segundos}s`;
  const min = Math.floor(segundos / 60);
  const seg = segundos % 60;
  return `${min}m ${seg}s`;
}

export function classNames(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
