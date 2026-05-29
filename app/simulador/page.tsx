"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { MoreVertical, Phone, Video, ArrowLeft, Send, Smile, Paperclip, Mic, RefreshCw, Check, CheckCheck, Info } from "lucide-react";

interface Mensagem {
  id: number;
  texto: string;
  remetente: "bot" | "paciente";
  hora: string;
  lida?: boolean;
}

interface OpcaoResposta {
  texto: string;
  proximo: string;
}

interface PassoFluxo {
  textoBot: string;
  opcoes?: OpcaoResposta[];
  inputLivre?: boolean;
  proximoAposInput?: string;
}

const FLUXO: Record<string, PassoFluxo> = {
  inicio: {
    textoBot: "Ola! Bem-vindo(a) ao *Hospital Casa de Saude Santana* 🏥\n\nSou o assistente virtual. Como posso te ajudar hoje?\n\nEscolha uma opcao:",
    opcoes: [
      { texto: "1️⃣ Agendar consulta", proximo: "agendar_especialidade" },
      { texto: "2️⃣ Resultado de exame", proximo: "resultado_codigo" },
      { texto: "3️⃣ Marcar exame", proximo: "marcar_exame" },
      { texto: "4️⃣ Pronto atendimento", proximo: "emergencia" },
      { texto: "5️⃣ Falar com atendente", proximo: "humano" },
    ],
  },
  agendar_especialidade: {
    textoBot: "Otimo! Qual especialidade voce precisa?",
    opcoes: [
      { texto: "Clinica Geral", proximo: "agendar_dados" },
      { texto: "Cardiologia", proximo: "agendar_dados" },
      { texto: "Pediatria", proximo: "agendar_dados" },
      { texto: "Ginecologia", proximo: "agendar_dados" },
      { texto: "Ortopedia", proximo: "agendar_dados" },
      { texto: "Outras", proximo: "agendar_dados" },
    ],
  },
  agendar_dados: {
    textoBot: "Para prosseguir, preciso de algumas informacoes.\n\nPor favor, digite seu *nome completo*:",
    inputLivre: true,
    proximoAposInput: "agendar_cpf",
  },
  agendar_cpf: {
    textoBot: "Obrigado! Agora me informe seu *CPF* (apenas numeros):",
    inputLivre: true,
    proximoAposInput: "agendar_horario",
  },
  agendar_horario: {
    textoBot: "Perfeito! Estes sao os *horarios disponiveis*:\n\n📅 *Segunda 02/06*\n- 09:00\n- 14:30\n\n📅 *Terca 03/06*\n- 10:00\n- 15:00\n\n📅 *Quinta 05/06*\n- 08:30\n- 16:00\n\nDigite o numero do horario:",
    opcoes: [
      { texto: "Seg 02/06 - 09:00", proximo: "confirmar_agendamento" },
      { texto: "Ter 03/06 - 14:30", proximo: "confirmar_agendamento" },
      { texto: "Qui 05/06 - 08:30", proximo: "confirmar_agendamento" },
    ],
  },
  confirmar_agendamento: {
    textoBot: "✅ *Consulta agendada com sucesso!*\n\n📍 *Hospital Casa de Saude Santana*\nAv. Getulio Vargas, Centro\nFeira de Santana - BA\n\nLembre-se de levar:\n- Documento com foto\n- Cartao do convenio\n- Chegar 15 min antes\n\nVoce recebera um SMS de confirmacao.\n\nDeseja algo mais?",
    opcoes: [
      { texto: "Sim, novo atendimento", proximo: "inicio" },
      { texto: "Nao, obrigado", proximo: "despedida" },
    ],
  },
  resultado_codigo: {
    textoBot: "Por favor, digite o *codigo do exame* (presente no protocolo, ex: EX1234):",
    inputLivre: true,
    proximoAposInput: "resultado_encontrado",
  },
  resultado_encontrado: {
    textoBot: "🔍 Buscando seu exame...\n\n✅ *Exame encontrado!*\n\n📋 *Hemograma Completo*\nData de realizacao: 26/05/2026\nStatus: *Disponivel*\n\nComo deseja receber?",
    opcoes: [
      { texto: "Por email", proximo: "enviado_email" },
      { texto: "Portal do paciente", proximo: "info_portal" },
    ],
  },
  enviado_email: {
    textoBot: "📧 Resultado enviado para o email cadastrado!\n\nDeseja algo mais?",
    opcoes: [
      { texto: "Sim", proximo: "inicio" },
      { texto: "Nao, obrigado", proximo: "despedida" },
    ],
  },
  info_portal: {
    textoBot: "🌐 Acesse: portal.casadesaudesantana.com.br\n\nUse seu CPF e senha cadastrada.\n\nDeseja algo mais?",
    opcoes: [
      { texto: "Nao, obrigado", proximo: "despedida" },
    ],
  },
  marcar_exame: {
    textoBot: "Qual exame voce deseja marcar?",
    inputLivre: true,
    proximoAposInput: "agendar_dados",
  },
  emergencia: {
    textoBot: "⚠️ *Pronto Atendimento 24h*\n\nDescreva brevemente o que esta sentindo:",
    inputLivre: true,
    proximoAposInput: "emergencia_orientacao",
  },
  emergencia_orientacao: {
    textoBot: "Obrigado pela informacao.\n\n🏥 *Recomendamos atendimento presencial*\n\n📍 *Endereco:*\nAv. Getulio Vargas, Centro\nFeira de Santana - BA\n\n🕐 Funciona 24h, todos os dias\n\nVou notificar nossa equipe sobre sua chegada. Pode vir agora?",
    opcoes: [
      { texto: "Sim, estou indo", proximo: "emergencia_confirmado" },
      { texto: "Nao posso ir agora", proximo: "humano" },
    ],
  },
  emergencia_confirmado: {
    textoBot: "✅ Equipe notificada!\n\nVa com cuidado. Caso a situacao piore, ligue para 192 (SAMU).",
    opcoes: [
      { texto: "Voltar ao menu", proximo: "inicio" },
    ],
  },
  humano: {
    textoBot: "👨‍💼 Transferindo para um atendente humano...\n\n⏱️ Tempo medio de espera: 2 minutos\n\nVoce esta na posicao *3* na fila.",
    opcoes: [
      { texto: "Voltar ao menu", proximo: "inicio" },
    ],
  },
  despedida: {
    textoBot: "Foi um prazer atender voce! 🙏\n\nLembre-se: o *Hospital Casa de Saude Santana* esta sempre a disposicao.\n\nTenha um otimo dia! 💙",
    opcoes: [
      { texto: "Reiniciar", proximo: "inicio" },
    ],
  },
};

let nextId = 0;

export default function SimuladorPage() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [passoAtual, setPassoAtual] = useState<string>("inicio");
  const [digitando, setDigitando] = useState(false);
  const [aguardandoInput, setAguardandoInput] = useState(false);
  const [inputValor, setInputValor] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  function formatHora() {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }

  function executarPasso(idPasso: string) {
    const passo = FLUXO[idPasso];
    if (!passo) return;
    setDigitando(true);
    setTimeout(() => {
      setMensagens((prev) => [
        ...prev,
        { id: nextId++, texto: passo.textoBot, remetente: "bot", hora: formatHora() },
      ]);
      setDigitando(false);
      setAguardandoInput(!!passo.inputLivre);
      setPassoAtual(idPasso);
    }, 900);
  }

  function escolherOpcao(opcao: OpcaoResposta) {
    setMensagens((prev) => [
      ...prev,
      { id: nextId++, texto: opcao.texto, remetente: "paciente", hora: formatHora(), lida: true },
    ]);
    setTimeout(() => executarPasso(opcao.proximo), 500);
  }

  function enviarInput() {
    if (!inputValor.trim()) return;
    setMensagens((prev) => [
      ...prev,
      { id: nextId++, texto: inputValor, remetente: "paciente", hora: formatHora(), lida: true },
    ]);
    const proximo = FLUXO[passoAtual].proximoAposInput;
    setInputValor("");
    setAguardandoInput(false);
    if (proximo) setTimeout(() => executarPasso(proximo), 500);
  }

  function reiniciar() {
    setMensagens([]);
    setInputValor("");
    setAguardandoInput(false);
    setTimeout(() => executarPasso("inicio"), 300);
  }

  const inicializadoRef = useRef(false);
  useEffect(() => {
    if (inicializadoRef.current) return;
    inicializadoRef.current = true;
    executarPasso("inicio");
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [mensagens, digitando]);

  const passo = FLUXO[passoAtual];

  return (
    <>
      <Header titulo="Simulador do Bot" subtitulo="Veja como sera a experiencia do paciente no WhatsApp" />

      <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Coluna lateral - info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-whatsapp flex items-center justify-center">
                <Info className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900">Como funciona</h3>
            </div>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-2"><span className="text-santana-600 font-bold">1.</span> Paciente envia mensagem ao numero do hospital</li>
              <li className="flex gap-2"><span className="text-santana-600 font-bold">2.</span> Bot inicia atendimento automaticamente</li>
              <li className="flex gap-2"><span className="text-santana-600 font-bold">3.</span> Faz triagem por menu de opcoes</li>
              <li className="flex gap-2"><span className="text-santana-600 font-bold">4.</span> Coleta dados (nome, CPF) quando necessario</li>
              <li className="flex gap-2"><span className="text-santana-600 font-bold">5.</span> Resolve ou transfere para atendente humano</li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Estatisticas do bot</h3>
            <div className="space-y-3">
              <Stat label="Resolucao sem humano" valor="73%" cor="text-health-600" />
              <Stat label="Tempo medio resposta" valor="< 2s" cor="text-santana-600" />
              <Stat label="Disponibilidade" valor="24/7" cor="text-violet-600" />
              <Stat label="Idioma" valor="PT-BR" cor="text-amber-600" />
            </div>
          </div>

          <button
            onClick={reiniciar}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-santana-600 text-white rounded-lg text-sm font-medium hover:bg-santana-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reiniciar conversa
          </button>
        </div>

        {/* Telefone WhatsApp */}
        <div className="lg:col-span-2">
          <div className="mx-auto max-w-md bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl">
            <div className="bg-white rounded-[2rem] overflow-hidden h-[640px] flex flex-col">
              {/* Header WhatsApp */}
              <div className="bg-whatsapp-dark text-white px-4 py-3 flex items-center gap-3">
                <ArrowLeft className="w-5 h-5" />
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                  H
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">Hospital Casa de Saude Santana</p>
                  <p className="text-xs text-white/80">online</p>
                </div>
                <Video className="w-5 h-5" />
                <Phone className="w-5 h-5" />
                <MoreVertical className="w-5 h-5" />
              </div>

              {/* Chat */}
              <div ref={chatRef} className="flex-1 overflow-y-auto whatsapp-bg p-4 space-y-2">
                <div className="text-center my-2">
                  <span className="inline-block px-3 py-1 bg-white/70 rounded-md text-xs text-slate-600">Hoje</span>
                </div>

                {mensagens.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.remetente === "paciente" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[85%] px-3 py-2 ${m.remetente === "bot" ? "chat-bubble-in" : "chat-bubble-out"} animate-fade-in`}>
                      <p className="text-sm text-slate-900 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: m.texto.replace(/\*(.+?)\*/g, "<strong>$1</strong>") }} />
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] text-slate-500">{m.hora}</span>
                        {m.remetente === "paciente" && (
                          <CheckCheck className="w-3.5 h-3.5 text-santana-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {digitando && (
                  <div className="flex justify-start">
                    <div className="chat-bubble-in px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                        <span className="typing-dot"></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Area de opcoes/input */}
              {!digitando && (
                <div className="bg-white border-t border-slate-200 p-3 max-h-[200px] overflow-y-auto">
                  {aguardandoInput ? (
                    <div className="flex items-center gap-2">
                      <Smile className="w-6 h-6 text-slate-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={inputValor}
                        onChange={(e) => setInputValor(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && enviarInput()}
                        placeholder="Digite sua resposta..."
                        autoFocus
                        className="flex-1 bg-slate-100 px-4 py-2 rounded-full text-sm focus:outline-none"
                      />
                      <Paperclip className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      <button
                        onClick={enviarInput}
                        className="w-10 h-10 rounded-full bg-whatsapp-dark text-white flex items-center justify-center flex-shrink-0 hover:bg-whatsapp transition-colors"
                      >
                        {inputValor ? <Send className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
                    </div>
                  ) : passo.opcoes && passo.opcoes.length > 0 ? (
                    <div className="space-y-1.5">
                      <p className="text-[10px] uppercase text-slate-400 font-medium px-2">Opcoes rapidas (clique para responder):</p>
                      {passo.opcoes.map((op, i) => (
                        <button
                          key={i}
                          onClick={() => escolherOpcao(op)}
                          className="w-full text-left px-3 py-2 bg-slate-50 hover:bg-santana-50 hover:text-santana-700 rounded-lg text-sm text-slate-700 transition-colors border border-slate-200"
                        >
                          {op.texto}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, valor, cor }: { label: string; valor: string; cor: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={`text-sm font-bold ${cor}`}>{valor}</span>
    </div>
  );
}
