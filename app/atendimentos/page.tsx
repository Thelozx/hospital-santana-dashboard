"use client";

import { useEffect, useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { getAtendimentos, Atendimento, StatusAtendimento, TipoAtendimento } from "@/lib/mockData";
import { formatarData, formatarDuracao, tempoRelativo } from "@/lib/utils";
import { Search, Filter, X, CheckCheck, MessageSquare, Clock, Calendar, User, Star } from "lucide-react";

const TIPOS: TipoAtendimento[] = [
  "Agendamento de Consulta", "Resultado de Exame", "Marcacao de Exame",
  "Informacoes sobre Internacao", "Planos de Saude", "Pronto Atendimento",
  "Reagendamento", "Cancelamento", "Falar com Atendente",
];

const STATUS: StatusAtendimento[] = ["Concluido", "Em andamento", "Abandonado", "Transferido humano"];

export default function AtendimentosPage() {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [busca, setBusca] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("");
  const [filtroStatus, setFiltroStatus] = useState<string>("");
  const [selecionado, setSelecionado] = useState<Atendimento | null>(null);

  useEffect(() => {
    setAtendimentos(getAtendimentos());
  }, []);

  const filtrados = useMemo(() => {
    return atendimentos.filter((a) => {
      const buscaOk = !busca || a.pacienteNome.toLowerCase().includes(busca.toLowerCase()) || a.id.toLowerCase().includes(busca.toLowerCase());
      const tipoOk = !filtroTipo || a.tipo === filtroTipo;
      const statusOk = !filtroStatus || a.status === filtroStatus;
      return buscaOk && tipoOk && statusOk;
    });
  }, [atendimentos, busca, filtroTipo, filtroStatus]);

  return (
    <>
      <Header titulo="Atendimentos" subtitulo={`${atendimentos.length} conversas registradas`} />

      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Filtros */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por paciente ou protocolo..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-santana-500"
            />
          </div>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-santana-500 bg-white"
          >
            <option value="">Todos tipos</option>
            {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-santana-500 bg-white"
          >
            <option value="">Todos status</option>
            {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-xs text-slate-500 uppercase">
                  <th className="px-6 py-3 font-medium">Protocolo</th>
                  <th className="px-6 py-3 font-medium">Paciente</th>
                  <th className="px-6 py-3 font-medium">Tipo</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Duracao</th>
                  <th className="px-6 py-3 font-medium">Iniciado</th>
                  <th className="px-6 py-3 font-medium">Satisfacao</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.slice(0, 50).map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => setSelecionado(a)}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-slate-600">{a.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{a.pacienteNome}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{a.tipo}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatarDuracao(a.duracaoSegundos)}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{tempoRelativo(a.iniciadoEm)}</td>
                    <td className="px-6 py-4">
                      {a.satisfacao ? (
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s <= a.satisfacao! ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtrados.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">Nenhum atendimento encontrado</div>
          )}
          {filtrados.length > 50 && (
            <div className="border-t border-slate-100 px-6 py-3 text-xs text-slate-500 bg-slate-50">
              Mostrando 50 de {filtrados.length} atendimentos
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalhe da conversa */}
      {selecionado && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelecionado(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-3xl w-full p-0 animate-slide-up max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header modal */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-slate-900">Protocolo {selecionado.id}</h2>
                  <StatusBadge status={selecionado.status} />
                </div>
                <p className="text-sm text-slate-500 mt-1">{selecionado.tipo}</p>
              </div>
              <button onClick={() => setSelecionado(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info bar */}
            <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-slate-200">
              <InfoBlock icone={User} label="Paciente" valor={selecionado.pacienteNome} />
              <InfoBlock icone={Calendar} label="Iniciado" valor={formatarData(selecionado.iniciadoEm)} />
              <InfoBlock icone={Clock} label="Duracao" valor={formatarDuracao(selecionado.duracaoSegundos)} />
              <InfoBlock icone={MessageSquare} label="Mensagens" valor={`${selecionado.mensagens.length}`} />
            </div>

            {/* Conversa */}
            <div className="flex-1 overflow-y-auto whatsapp-bg p-4 space-y-2">
              {selecionado.mensagens.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.remetente === "paciente" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] px-3 py-2 ${m.remetente === "bot" ? "chat-bubble-in" : "chat-bubble-out"}`}>
                    <p className="text-sm text-slate-900 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: m.texto.replace(/\*(.+?)\*/g, "<strong>$1</strong>") }} />
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] text-slate-500">{m.hora}</span>
                      {m.remetente === "paciente" && <CheckCheck className="w-3.5 h-3.5 text-santana-500" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selecionado.satisfacao && (
              <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-sm text-slate-600">Avaliacao do paciente:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= selecionado.satisfacao! ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cores: Record<string, string> = {
    "Concluido": "bg-health-50 text-health-700",
    "Em andamento": "bg-santana-50 text-santana-700",
    "Abandonado": "bg-amber-50 text-amber-700",
    "Transferido humano": "bg-rose-50 text-rose-700",
  };
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${cores[status] || "bg-slate-100"}`}>
      {status}
    </span>
  );
}

function InfoBlock({ icone: Icone, label, valor }: { icone: any; label: string; valor: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icone className="w-4 h-4 text-slate-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-900 truncate">{valor}</p>
      </div>
    </div>
  );
}
