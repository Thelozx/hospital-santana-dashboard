"use client";

import { useEffect, useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { getPacientes, Paciente } from "@/lib/mockData";
import { formatarDataCurta, tempoRelativo } from "@/lib/utils";
import { Search, UserPlus, Filter, X, Phone, Mail, MapPin, Calendar, Activity } from "lucide-react";

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busca, setBusca] = useState("");
  const [convenioFiltro, setConvenioFiltro] = useState("");
  const [selecionado, setSelecionado] = useState<Paciente | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoPaciente, setNovoPaciente] = useState({
    nome: "", cpf: "", telefone: "", dataNascimento: "", email: "", endereco: "", convenio: "SUS",
  });

  useEffect(() => {
    setPacientes(getPacientes());
  }, []);

  const convenios = useMemo(() => Array.from(new Set(pacientes.map((p) => p.convenio).filter(Boolean))) as string[], [pacientes]);

  const filtrados = useMemo(() => {
    return pacientes.filter((p) => {
      const buscaOk =
        !busca ||
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.cpf.includes(busca) ||
        p.telefone.includes(busca);
      const convenioOk = !convenioFiltro || p.convenio === convenioFiltro;
      return buscaOk && convenioOk;
    });
  }, [pacientes, busca, convenioFiltro]);

  function adicionarPaciente() {
    if (!novoPaciente.nome || !novoPaciente.cpf) {
      alert("Nome e CPF sao obrigatorios");
      return;
    }
    const novo: Paciente = {
      id: `P${String(pacientes.length + 1).padStart(4, "0")}`,
      ...novoPaciente,
      cadastradoEm: new Date().toISOString(),
      totalAtendimentos: 0,
    };
    setPacientes([novo, ...pacientes]);
    setModalAberto(false);
    setNovoPaciente({ nome: "", cpf: "", telefone: "", dataNascimento: "", email: "", endereco: "", convenio: "SUS" });
  }

  return (
    <>
      <Header titulo="Pacientes" subtitulo={`${pacientes.length} pacientes cadastrados via bot`} />

      <div className="p-8 space-y-6">
        {/* Filtros e acoes */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, CPF ou telefone..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-santana-500"
            />
          </div>

          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={convenioFiltro}
              onChange={(e) => setConvenioFiltro(e.target.value)}
              className="pl-10 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-santana-500 appearance-none bg-white"
            >
              <option value="">Todos convenios</option>
              {convenios.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setModalAberto(true)}
            className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-santana-600 text-white rounded-lg text-sm font-medium hover:bg-santana-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Novo Paciente
          </button>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-xs text-slate-500 uppercase">
                  <th className="px-6 py-3 font-medium">Paciente</th>
                  <th className="px-6 py-3 font-medium">CPF</th>
                  <th className="px-6 py-3 font-medium">Telefone</th>
                  <th className="px-6 py-3 font-medium">Convenio</th>
                  <th className="px-6 py-3 font-medium">Atendimentos</th>
                  <th className="px-6 py-3 font-medium">Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelecionado(p)}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-santana-400 to-health-500 flex items-center justify-center text-white text-sm font-semibold">
                          {p.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{p.nome}</p>
                          <p className="text-xs text-slate-500">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-mono">{p.cpf}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.telefone}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700">
                        {p.convenio}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-slate-900">{p.totalAtendimentos}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{tempoRelativo(p.cadastradoEm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtrados.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">Nenhum paciente encontrado</div>
          )}
        </div>
      </div>

      {/* Modal detalhes */}
      {selecionado && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelecionado(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full p-6 animate-slide-up"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-santana-500 to-health-500 flex items-center justify-center text-white text-xl font-bold">
                  {selecionado.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selecionado.nome}</h2>
                  <p className="text-sm text-slate-500">{selecionado.id}</p>
                </div>
              </div>
              <button onClick={() => setSelecionado(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <Info icone={Activity} label="CPF" valor={selecionado.cpf} />
              <Info icone={Phone} label="Telefone" valor={selecionado.telefone} />
              <Info icone={Mail} label="Email" valor={selecionado.email || "-"} />
              <Info icone={Calendar} label="Nascimento" valor={selecionado.dataNascimento ? formatarDataCurta(selecionado.dataNascimento) : "-"} />
              <Info icone={MapPin} label="Endereco" valor={selecionado.endereco || "-"} />
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-santana-600">{selecionado.totalAtendimentos}</p>
                <p className="text-xs text-slate-500">Atendimentos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-health-600">{selecionado.convenio}</p>
                <p className="text-xs text-slate-500">Convenio</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal novo paciente */}
      {modalAberto && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setModalAberto(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-lg w-full p-6 animate-slide-up"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Novo Paciente</h2>
              <button onClick={() => setModalAberto(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Campo label="Nome completo *" valor={novoPaciente.nome} onChange={(v) => setNovoPaciente({ ...novoPaciente, nome: v })} />
              <div className="grid grid-cols-2 gap-3">
                <Campo label="CPF *" valor={novoPaciente.cpf} onChange={(v) => setNovoPaciente({ ...novoPaciente, cpf: v })} />
                <Campo label="Telefone" valor={novoPaciente.telefone} onChange={(v) => setNovoPaciente({ ...novoPaciente, telefone: v })} />
              </div>
              <Campo label="Email" valor={novoPaciente.email} onChange={(v) => setNovoPaciente({ ...novoPaciente, email: v })} />
              <Campo label="Endereco" valor={novoPaciente.endereco} onChange={(v) => setNovoPaciente({ ...novoPaciente, endereco: v })} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nascimento</label>
                  <input
                    type="date"
                    value={novoPaciente.dataNascimento}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, dataNascimento: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-santana-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Convenio</label>
                  <select
                    value={novoPaciente.convenio}
                    onChange={(e) => setNovoPaciente({ ...novoPaciente, convenio: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-santana-500"
                  >
                    {["SUS", "Unimed", "Bradesco Saude", "Hapvida", "Particular", "Amil"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setModalAberto(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">
                Cancelar
              </button>
              <button onClick={adicionarPaciente} className="px-4 py-2 bg-santana-600 text-white rounded-lg text-sm font-medium hover:bg-santana-700">
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Info({ icone: Icone, label, valor }: { icone: any; label: string; valor: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icone className="w-4 h-4 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-900 truncate">{valor}</p>
      </div>
    </div>
  );
}

function Campo({ label, valor, onChange }: { label: string; valor: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-700 mb-1">{label}</label>
      <input
        type="text"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-santana-500"
      />
    </div>
  );
}
