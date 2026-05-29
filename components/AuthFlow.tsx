"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Activity, Mail, Lock, Eye, EyeOff, ArrowRight, MessageSquare,
  BarChart3, ShieldCheck, User, Briefcase, Phone, CheckCircle2,
  Heart, Stethoscope, Zap,
} from "lucide-react";
import { login, cadastrar, isAuthenticated } from "@/lib/auth";

type Modo = "login" | "cadastro";

export function AuthFlow({ initialMode }: { initialMode: Modo }) {
  const router = useRouter();
  const [modo, setModo] = useState<Modo>(initialMode);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) router.push("/");
    // Pequeno delay pra evitar flash da animacao no carregamento inicial
    const t = setTimeout(() => setMontado(true), 50);
    return () => clearTimeout(t);
  }, [router]);

  function alternar(novoModo: Modo) {
    setModo(novoModo);
    // Atualiza URL sem recarregar a pagina
    window.history.replaceState({}, "", `/${novoModo}`);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50">
      {/* Toggle flutuante no topo (mobile) */}
      <div className="lg:hidden absolute top-4 right-4 z-20 bg-white rounded-full shadow-lg p-1 flex">
        <button
          onClick={() => alternar("login")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            modo === "login" ? "bg-santana-600 text-white" : "text-slate-600"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => alternar("cadastro")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            modo === "cadastro" ? "bg-santana-600 text-white" : "text-slate-600"
          }`}
        >
          Cadastro
        </button>
      </div>

      {/* Trilha com 2 slides de 100vw cada */}
      <div
        className={`flex ${montado ? "transition-transform duration-700 ease-out" : ""}`}
        style={{
          width: "200vw",
          transform: modo === "login" ? "translateX(0)" : "translateX(-100vw)",
        }}
      >
        {/* SLIDE 1 - LOGIN */}
        <div className="w-screen min-h-screen flex">
          <BrandPanel
            posicao="esquerda"
            cor="azul"
            titulo="Gerencie atendimentos com inteligencia."
            subtitulo="Acompanhe em tempo real as conversas do bot de triagem WhatsApp e tome decisoes baseadas em dados."
            features={[
              { icone: MessageSquare, titulo: "Atendimento 24/7", descricao: "Bot responde pacientes a qualquer hora" },
              { icone: BarChart3, titulo: "Dados em tempo real", descricao: "Metricas, graficos e insights" },
              { icone: ShieldCheck, titulo: "Seguranca LGPD", descricao: "Dados de pacientes protegidos" },
            ]}
          />
          <FormPanel>
            <LoginForm onIrCadastro={() => alternar("cadastro")} />
          </FormPanel>
        </div>

        {/* SLIDE 2 - CADASTRO */}
        <div className="w-screen min-h-screen flex">
          <FormPanel>
            <CadastroForm onIrLogin={() => alternar("login")} />
          </FormPanel>
          <BrandPanel
            posicao="direita"
            cor="verde"
            titulo="Junte-se ao futuro do atendimento hospitalar."
            subtitulo="Mais de 73% dos atendimentos sao resolvidos sem precisar de um operador humano."
            stats={[
              { icone: Stethoscope, numero: "180+", label: "Atendimentos/mes" },
              { icone: Heart, numero: "98%", label: "Satisfacao" },
              { icone: Zap, numero: "2s", label: "Tempo resposta" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

// === Painel de branding (lado colorido) ===

interface Feature { icone: any; titulo: string; descricao: string }
interface Stat { icone: any; numero: string; label: string }

function BrandPanel({
  posicao, cor, titulo, subtitulo, features, stats,
}: {
  posicao: "esquerda" | "direita";
  cor: "azul" | "verde";
  titulo: string;
  subtitulo: string;
  features?: Feature[];
  stats?: Stat[];
}) {
  const gradiente = cor === "azul"
    ? "from-santana-700 via-santana-600 to-health-600"
    : "from-health-600 via-health-500 to-santana-600";

  return (
    <div className={`hidden lg:flex w-1/2 bg-gradient-to-br ${gradiente} relative overflow-hidden`}>
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-24 ${posicao === "esquerda" ? "-right-24" : "-left-24"} w-96 h-96 rounded-full bg-white/10 blur-3xl`}></div>
        <div className={`absolute -bottom-24 ${posicao === "esquerda" ? "-left-24" : "-right-24"} w-96 h-96 rounded-full bg-${cor === "azul" ? "health" : "santana"}-400/20 blur-3xl`}></div>
      </div>

      <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Activity className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Casa de Saude Santana</h2>
            <p className="text-sm text-white/80">Feira de Santana - BA</p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h1 className="text-5xl font-bold leading-tight mb-4">{titulo}</h1>
            <p className="text-lg text-white/90 max-w-md">{subtitulo}</p>
          </div>

          {features && (
            <div className="grid grid-cols-1 gap-4">
              {features.map((f, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <f.icone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{f.titulo}</h3>
                    <p className="text-sm text-white/80">{f.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {stats && (
            <div className="grid grid-cols-3 gap-3">
              {stats.map((s, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
                  <s.icone className="w-6 h-6 mx-auto mb-2 text-white" />
                  <p className="text-2xl font-bold">{s.numero}</p>
                  <p className="text-xs text-white/80 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-sm text-white/70">
          &copy; 2026 Hospital Casa de Saude Santana.
        </div>
      </div>
    </div>
  );
}

function FormPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

// === Formulario de login ===

function LoginForm({ onIrCadastro }: { onIrCadastro: () => void }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(true);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    setTimeout(() => {
      const r = login(email, senha);
      if (r.sucesso) router.push("/");
      else {
        setErro(r.erro || "Erro ao fazer login");
        setCarregando(false);
      }
    }, 600);
  }

  function preencherAdmin() {
    setEmail("admin@santana.com.br");
    setSenha("admin123");
  }

  return (
    <>
      <div className="lg:hidden mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-santana-500 to-health-500 flex items-center justify-center">
          <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="font-bold text-slate-900">Casa de Saude Santana</h2>
          <p className="text-xs text-slate-500">Feira de Santana - BA</p>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Bem-vindo de volta!</h1>
        <p className="text-slate-500 mt-2">Entre com suas credenciais para acessar o painel</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com" required
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-santana-500 focus:ring-2 focus:ring-santana-100 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Senha</label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={mostrarSenha ? "text" : "password"} value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Sua senha" required
              className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-santana-500 focus:ring-2 focus:ring-santana-100 transition-all"
            />
            <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {mostrarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {erro && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm animate-fade-in">
            {erro}
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={lembrar} onChange={(e) => setLembrar(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-santana-600 focus:ring-santana-500" />
            <span className="text-sm text-slate-600">Lembrar-me</span>
          </label>
          <button type="button" className="text-sm text-santana-600 hover:text-santana-700 font-medium">
            Esqueceu a senha?
          </button>
        </div>

        <button
          type="submit" disabled={carregando}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-santana-600 to-santana-700 hover:from-santana-700 hover:to-santana-800 text-white rounded-xl text-sm font-semibold shadow-lg shadow-santana-600/30 transition-all disabled:opacity-50"
        >
          {carregando ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Entrando...
            </>
          ) : (
            <>Entrar <ArrowRight className="w-4 h-4" /></>
          )}
        </button>

        <div className="text-center">
          <button type="button" onClick={preencherAdmin} className="text-xs text-slate-500 hover:text-santana-600 underline">
            Usar conta demo (admin@santana.com.br / admin123)
          </button>
        </div>

        <div className="relative flex items-center my-6">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-3 text-xs text-slate-400">OU</span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        <p className="text-center text-sm text-slate-600">
          Nao tem uma conta?{" "}
          <button type="button" onClick={onIrCadastro} className="text-santana-600 hover:text-santana-700 font-semibold">
            Cadastre-se gratis
          </button>
        </p>
      </form>
    </>
  );
}

// === Formulario de cadastro ===

function CadastroForm({ onIrLogin }: { onIrLogin: () => void }) {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function forcaSenha() {
    if (!senha) return { texto: "", cor: "", percent: 0 };
    let p = 0;
    if (senha.length >= 6) p++;
    if (senha.length >= 10) p++;
    if (/[A-Z]/.test(senha)) p++;
    if (/[0-9]/.test(senha)) p++;
    if (/[^A-Za-z0-9]/.test(senha)) p++;
    if (p <= 2) return { texto: "Fraca", cor: "bg-rose-500", percent: 33 };
    if (p <= 3) return { texto: "Media", cor: "bg-amber-500", percent: 66 };
    return { texto: "Forte", cor: "bg-health-500", percent: 100 };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    if (senha !== confirmSenha) { setErro("As senhas nao coincidem"); return; }
    if (!aceitouTermos) { setErro("Voce precisa aceitar os termos"); return; }

    setCarregando(true);
    setTimeout(() => {
      const r = cadastrar({ nome, email, senha, cargo, telefone });
      if (r.sucesso) router.push("/");
      else { setErro(r.erro || "Erro ao cadastrar"); setCarregando(false); }
    }, 600);
  }

  const forca = forcaSenha();

  return (
    <>
      <div className="lg:hidden mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-santana-500 to-health-500 flex items-center justify-center">
          <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="font-bold text-slate-900">Casa de Saude Santana</h2>
          <p className="text-xs text-slate-500">Feira de Santana - BA</p>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Crie sua conta</h1>
        <p className="text-slate-500 mt-2">Comece a gerenciar atendimentos em minutos</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nome completo *</label>
          <div className="relative">
            <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" required
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-santana-500 focus:ring-2 focus:ring-santana-100 transition-all" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email *</label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-santana-500 focus:ring-2 focus:ring-santana-100 transition-all" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Cargo</label>
            <div className="relative">
              <Briefcase className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Ex: Recepcao"
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-santana-500 focus:ring-2 focus:ring-santana-100 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Telefone</label>
            <div className="relative">
              <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(75) 9..."
                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-santana-500 focus:ring-2 focus:ring-santana-100 transition-all" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Senha *</label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type={mostrarSenha ? "text" : "password"} value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Minimo 6 caracteres" required
              className="w-full pl-11 pr-11 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-santana-500 focus:ring-2 focus:ring-santana-100 transition-all" />
            <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {mostrarSenha ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {senha && (
            <div className="mt-2 flex items-center">
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full transition-all ${forca.cor}`} style={{ width: `${forca.percent}%` }}></div>
              </div>
              <span className="text-xs text-slate-500 ml-2 min-w-[40px] text-right">{forca.texto}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirmar senha *</label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type={mostrarSenha ? "text" : "password"} value={confirmSenha} onChange={(e) => setConfirmSenha(e.target.value)} placeholder="Digite a senha novamente" required
              className="w-full pl-11 pr-11 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-santana-500 focus:ring-2 focus:ring-santana-100 transition-all" />
            {confirmSenha && senha === confirmSenha && (
              <CheckCircle2 className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-health-500" />
            )}
          </div>
        </div>

        {erro && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm animate-fade-in">
            {erro}
          </div>
        )}

        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" checked={aceitouTermos} onChange={(e) => setAceitouTermos(e.target.checked)} className="w-4 h-4 mt-0.5 rounded border-slate-300 text-santana-600 focus:ring-santana-500" />
          <span className="text-sm text-slate-600">
            Aceito os <a href="#" className="text-santana-600 hover:underline">termos de uso</a> e a{" "}
            <a href="#" className="text-santana-600 hover:underline">politica de privacidade</a> (LGPD)
          </span>
        </label>

        <button type="submit" disabled={carregando}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-santana-600 to-santana-700 hover:from-santana-700 hover:to-santana-800 text-white rounded-xl text-sm font-semibold shadow-lg shadow-santana-600/30 transition-all disabled:opacity-50">
          {carregando ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Criando conta...
            </>
          ) : (
            <>Criar conta <ArrowRight className="w-4 h-4" /></>
          )}
        </button>

        <p className="text-center text-sm text-slate-600 pt-2">
          Ja tem uma conta?{" "}
          <button type="button" onClick={onIrLogin} className="text-santana-600 hover:text-santana-700 font-semibold">
            Faca login
          </button>
        </p>
      </form>
    </>
  );
}
