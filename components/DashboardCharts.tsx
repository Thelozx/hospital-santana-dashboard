"use client";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Atendimento, TipoAtendimento, Especialidade } from "@/lib/mockData";

const CORES_GRAFICO = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1"];

export function AtendimentosPorDia({ atendimentos }: { atendimentos: Atendimento[] }) {
  const dados: Record<string, number> = {};
  const hoje = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() - i);
    const chave = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    dados[chave] = 0;
  }
  atendimentos.forEach((a) => {
    const d = new Date(a.iniciadoEm);
    const chave = `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (dados[chave] !== undefined) dados[chave]++;
  });
  const data = Object.entries(dados).map(([dia, atendimentos]) => ({ dia, atendimentos }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-slate-900">Atendimentos por Dia</h3>
        <p className="text-sm text-slate-500">Ultimos 14 dias</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAtend" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="dia" tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip
            contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "8px" }}
            labelStyle={{ color: "#0f172a", fontWeight: 600 }}
          />
          <Area type="monotone" dataKey="atendimentos" stroke="#2563eb" strokeWidth={2} fill="url(#colorAtend)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AtendimentosPorTipo({ atendimentos }: { atendimentos: Atendimento[] }) {
  const contagem: Record<string, number> = {};
  atendimentos.forEach((a) => {
    contagem[a.tipo] = (contagem[a.tipo] || 0) + 1;
  });
  const data = Object.entries(contagem)
    .map(([tipo, qtd]) => ({ tipo: tipo.length > 18 ? tipo.slice(0, 18) + "..." : tipo, qtd, tipoCompleto: tipo }))
    .sort((a, b) => b.qtd - a.qtd);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-slate-900">Atendimentos por Tipo</h3>
        <p className="text-sm text-slate-500">Top servicos procurados</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis type="category" dataKey="tipo" tick={{ fontSize: 11, fill: "#64748b" }} width={140} />
          <Tooltip
            contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "8px" }}
            formatter={(v: number) => [`${v} atendimentos`, ""]}
            labelFormatter={(label, payload) => payload?.[0]?.payload?.tipoCompleto || label}
          />
          <Bar dataKey="qtd" fill="#10b981" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AtendimentosPorHorario({ atendimentos }: { atendimentos: Atendimento[] }) {
  const horarios = Array.from({ length: 24 }, (_, h) => ({ hora: `${String(h).padStart(2, "0")}h`, qtd: 0 }));
  atendimentos.forEach((a) => {
    const h = new Date(a.iniciadoEm).getHours();
    horarios[h].qtd++;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-slate-900">Distribuicao por Horario</h3>
        <p className="text-sm text-slate-500">Quando o bot mais atende</p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={horarios}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="hora" tick={{ fontSize: 10, fill: "#64748b" }} interval={1} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip
            contentStyle={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "8px" }}
          />
          <Bar dataKey="qtd" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusPie({ atendimentos }: { atendimentos: Atendimento[] }) {
  const contagem: Record<string, number> = {};
  atendimentos.forEach((a) => {
    contagem[a.status] = (contagem[a.status] || 0) + 1;
  });
  const data = Object.entries(contagem).map(([name, value]) => ({ name, value }));
  const cores: Record<string, string> = {
    "Concluido": "#10b981",
    "Em andamento": "#3b82f6",
    "Abandonado": "#f59e0b",
    "Transferido humano": "#ef4444",
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-slate-900">Status dos Atendimentos</h3>
        <p className="text-sm text-slate-500">Resultado final das conversas</p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            label={({ name, value }) => `${value}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={cores[entry.name] || CORES_GRAFICO[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function EspecialidadesChart({ atendimentos }: { atendimentos: Atendimento[] }) {
  const contagem: Record<string, number> = {};
  atendimentos.forEach((a) => {
    if (a.especialidade) contagem[a.especialidade] = (contagem[a.especialidade] || 0) + 1;
  });
  const data = Object.entries(contagem)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-slate-900">Especialidades Mais Procuradas</h3>
        <p className="text-sm text-slate-500">Apenas agendamentos de consulta</p>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CORES_GRAFICO[index % CORES_GRAFICO.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
