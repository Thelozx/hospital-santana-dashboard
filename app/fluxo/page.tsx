"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { FLUXO_PADRAO, NoFluxo } from "@/lib/mockData";
import { Plus, Trash2, ArrowRight, MessageSquare, Type, CheckSquare, X, Save, Edit3 } from "lucide-react";

export default function FluxoPage() {
  const [nos, setNos] = useState<NoFluxo[]>(FLUXO_PADRAO);
  const [selecionado, setSelecionado] = useState<NoFluxo | null>(null);
  const [editando, setEditando] = useState<NoFluxo | null>(null);

  function salvarEdicao() {
    if (!editando) return;
    setNos((prev) => prev.map((n) => (n.id === editando.id ? editando : n)));
    setEditando(null);
    setSelecionado(editando);
  }

  function removerNo(id: string) {
    if (!confirm("Tem certeza que deseja remover este passo?")) return;
    setNos((prev) => prev.filter((n) => n.id !== id));
    setSelecionado(null);
  }

  function adicionarNo() {
    const novo: NoFluxo = {
      id: `novo_${Date.now()}`,
      pergunta: "Nova mensagem do bot",
      tipo: "menu",
      opcoes: [{ texto: "Opcao 1" }],
    };
    setNos([...nos, novo]);
    setEditando(novo);
  }

  function adicionarOpcao() {
    if (!editando) return;
    setEditando({
      ...editando,
      opcoes: [...editando.opcoes, { texto: "Nova opcao" }],
    });
  }

  function removerOpcao(i: number) {
    if (!editando) return;
    setEditando({
      ...editando,
      opcoes: editando.opcoes.filter((_, idx) => idx !== i),
    });
  }

  function atualizarOpcao(i: number, campo: "texto" | "proximo", valor: string) {
    if (!editando) return;
    const novasOpcoes = [...editando.opcoes];
    novasOpcoes[i] = { ...novasOpcoes[i], [campo]: valor };
    setEditando({ ...editando, opcoes: novasOpcoes });
  }

  return (
    <>
      <Header titulo="Fluxo de Triagem" subtitulo="Configure as perguntas e respostas do bot" />

      <div className="p-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Edit3 className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <p className="font-semibold text-amber-900">Editor visual de fluxo</p>
            <p className="text-sm text-amber-800 mt-1">
              Cada card representa uma etapa da conversa. Clique para editar perguntas, opcoes e conexoes.
              As mudancas aqui sao aplicadas imediatamente ao bot do WhatsApp.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{nos.length} passos configurados</h2>
            <p className="text-sm text-slate-500">Bot ativo - todas as mudancas sao salvas automaticamente</p>
          </div>
          <button
            onClick={adicionarNo}
            className="inline-flex items-center gap-2 px-4 py-2 bg-santana-600 text-white rounded-lg text-sm font-medium hover:bg-santana-700"
          >
            <Plus className="w-4 h-4" />
            Adicionar passo
          </button>
        </div>

        {/* Grid de nos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nos.map((no) => (
            <div
              key={no.id}
              onClick={() => setSelecionado(no)}
              className="bg-white rounded-xl border border-slate-200 p-5 cursor-pointer hover:border-santana-400 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-2 mb-3">
                <TipoBadge tipo={no.tipo} />
                <span className="text-xs text-slate-400 ml-auto font-mono">{no.id}</span>
              </div>
              <p className="text-sm text-slate-900 line-clamp-3 min-h-[60px]">{no.pergunta}</p>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {no.opcoes.length > 0 ? (
                    <>
                      <ArrowRight className="w-3 h-3" />
                      <span>{no.opcoes.length} {no.opcoes.length === 1 ? "saida" : "saidas"}</span>
                    </>
                  ) : (
                    <span className="text-rose-600">Fim do fluxo</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal detalhe / edicao */}
      {(selecionado || editando) && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => {
            setSelecionado(null);
            setEditando(null);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl max-w-2xl w-full p-6 animate-slide-up max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TipoBadge tipo={(editando || selecionado)!.tipo} />
                <h2 className="text-lg font-bold text-slate-900">
                  {editando ? "Editando passo" : "Detalhes do passo"}
                </h2>
              </div>
              <button onClick={() => { setSelecionado(null); setEditando(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {editando ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">ID do passo</label>
                  <input
                    type="text"
                    value={editando.id}
                    onChange={(e) => setEditando({ ...editando, id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:border-santana-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tipo</label>
                  <select
                    value={editando.tipo}
                    onChange={(e) => setEditando({ ...editando, tipo: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-santana-500"
                  >
                    <option value="menu">Menu de opcoes</option>
                    <option value="input">Entrada de texto</option>
                    <option value="final">Mensagem final</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Mensagem do bot</label>
                  <textarea
                    value={editando.pergunta}
                    onChange={(e) => setEditando({ ...editando, pergunta: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-santana-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium text-slate-700">Opcoes / proximos passos</label>
                    <button
                      onClick={adicionarOpcao}
                      className="text-xs text-santana-600 hover:text-santana-700 inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Adicionar
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editando.opcoes.map((op, i) => (
                      <div key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg">
                        <input
                          type="text"
                          value={op.texto}
                          onChange={(e) => atualizarOpcao(i, "texto", e.target.value)}
                          placeholder="Texto da opcao"
                          className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:border-santana-500 bg-white"
                        />
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <select
                          value={op.proximo || ""}
                          onChange={(e) => atualizarOpcao(i, "proximo", e.target.value)}
                          className="px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:border-santana-500 bg-white"
                        >
                          <option value="">(fim)</option>
                          {nos.filter((n) => n.id !== editando.id).map((n) => (
                            <option key={n.id} value={n.id}>{n.id}</option>
                          ))}
                        </select>
                        <button onClick={() => removerOpcao(i)} className="text-rose-500 hover:text-rose-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={() => removerNo(editando.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-sm"
                  >
                    <Trash2 className="w-4 h-4" /> Remover passo
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditando(null)}
                      className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={salvarEdicao}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-santana-600 text-white rounded-lg text-sm font-medium hover:bg-santana-700"
                    >
                      <Save className="w-4 h-4" /> Salvar
                    </button>
                  </div>
                </div>
              </div>
            ) : selecionado ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">ID</p>
                  <p className="text-sm font-mono text-slate-900">{selecionado.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Mensagem do bot</p>
                  <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-900 whitespace-pre-wrap">
                    {selecionado.pergunta}
                  </div>
                </div>
                {selecionado.opcoes.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Opcoes</p>
                    <div className="space-y-2">
                      {selecionado.opcoes.map((op, i) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg text-sm">
                          <span className="flex-1">{op.texto}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className="font-mono text-xs text-slate-600">{op.proximo || "(fim)"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    onClick={() => { setEditando(selecionado); setSelecionado(null); }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-santana-600 text-white rounded-lg text-sm font-medium hover:bg-santana-700"
                  >
                    <Edit3 className="w-4 h-4" /> Editar passo
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}

function TipoBadge({ tipo }: { tipo: "menu" | "input" | "final" }) {
  const config = {
    menu: { icon: CheckSquare, label: "Menu", color: "bg-santana-50 text-santana-700" },
    input: { icon: Type, label: "Entrada", color: "bg-violet-50 text-violet-700" },
    final: { icon: MessageSquare, label: "Final", color: "bg-rose-50 text-rose-700" },
  }[tipo];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}
