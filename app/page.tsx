"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { KPICard } from "@/components/KPICard";
import {
  AtendimentosPorDia,
  AtendimentosPorTipo,
  AtendimentosPorHorario,
  StatusPie,
  EspecialidadesChart,
} from "@/components/DashboardCharts";
import { getAtendimentos, getPacientes, Atendimento, Paciente } from "@/lib/mockData";
import { MessageSquare, Users, Clock, CheckCircle2, TrendingUp, Star } from "lucide-react";
import { formatarDuracao, tempoRelativo } from "@/lib/utils";

export default function DashboardPage() {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  useEffect(() => {
    setAtendimentos(getAtendimentos());
    setPacientes(getPacientes());
  }, []);

  if (atendimentos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500">Carregando dashboard...</div>
      </div>
    );
  }

  // Calculos
  const total = atendimentos.length;
  const concluidos = atendimentos.filter((a) => a.status === "Concluido").length;
  const taxaResolucao = ((concluidos / total) * 100).toFixed(1);
  const tempoMedio = Math.floor(atendimentos.reduce((acc, a) => acc + a.duracaoSegundos, 0) / total);
  const satisfacoes = atendimentos.filter((a) => a.satisfacao).map((a) => a.satisfacao!);
  const satisfacaoMedia = (satisfacoes.reduce((a, b) => a + b, 0) / satisfacoes.length).toFixed(1);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const atendimentosHoje = atendimentos.filter((a) => new Date(a.iniciadoEm) >= hoje).length;

  const ultimosAtendimentos = atendimentos.slice(0, 5);

  return (
    <>
      <Header
        titulo="Dashboard"
        subtitulo="Visao geral dos atendimentos automatizados via WhatsApp"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            titulo="Atendimentos Total"
            valor={total}
            subtitulo={`${atendimentosHoje} hoje`}
            icone={MessageSquare}
            cor="santana"
            variacao={12}
          />
          <KPICard
            titulo="Pacientes Cadastrados"
            valor={pacientes.length}
            subtitulo="Capturados pelo bot"
            icone={Users}
            cor="health"
            variacao={8}
          />
          <KPICard
            titulo="Taxa de Resolucao"
            valor={`${taxaResolucao}%`}
            subtitulo="Resolvidos sem atendente"
            icone={CheckCircle2}
            cor="violet"
            variacao={4}
          />
          <KPICard
            titulo="Tempo Medio"
            valor={formatarDuracao(tempoMedio)}
            subtitulo="Duracao por atendimento"
            icone={Clock}
            cor="amber"
            variacao={-6}
          />
        </div>

        {/* Graficos linha 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AtendimentosPorDia atendimentos={atendimentos} />
          </div>
          <StatusPie atendimentos={atendimentos} />
        </div>

        {/* Graficos linha 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AtendimentosPorTipo atendimentos={atendimentos} />
          <EspecialidadesChart atendimentos={atendimentos} />
        </div>

        {/* Linha 3: horario + ultimos atendimentos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AtendimentosPorHorario atendimentos={atendimentos} />
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Satisfacao Media</h3>
                <p className="text-sm text-slate-500">Avaliacoes do bot</p>
              </div>
            </div>
            <div className="flex items-center justify-center py-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-slate-900">{satisfacaoMedia}</div>
                <div className="flex items-center justify-center gap-1 mt-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-6 h-6 ${
                        s <= Math.round(parseFloat(satisfacaoMedia))
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">{satisfacoes.length} avaliacoes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ultimos atendimentos */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Ultimos Atendimentos</h3>
              <p className="text-sm text-slate-500">Conversas mais recentes</p>
            </div>
            <a href="/atendimentos" className="text-sm text-santana-600 hover:text-santana-700 font-medium">
              Ver todos
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase border-b border-slate-200">
                  <th className="py-3 font-medium">Paciente</th>
                  <th className="py-3 font-medium">Tipo</th>
                  <th className="py-3 font-medium">Status</th>
                  <th className="py-3 font-medium">Duracao</th>
                  <th className="py-3 font-medium">Iniciado</th>
                </tr>
              </thead>
              <tbody>
                {ultimosAtendimentos.map((a) => (
                  <tr key={a.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="py-3 text-sm font-medium text-slate-900">{a.pacienteNome}</td>
                    <td className="py-3 text-sm text-slate-600">{a.tipo}</td>
                    <td className="py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="py-3 text-sm text-slate-600">{formatarDuracao(a.duracaoSegundos)}</td>
                    <td className="py-3 text-sm text-slate-500">{tempoRelativo(a.iniciadoEm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
