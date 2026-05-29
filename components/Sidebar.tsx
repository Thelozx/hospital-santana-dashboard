"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  GitBranch,
  ClipboardList,
  Activity,
  LogOut,
  X,
} from "lucide-react";
import { classNames } from "@/lib/utils";
import { getCurrentUser, logout, Usuario } from "@/lib/auth";
import { ConfirmModal } from "./ConfirmModal";
import { useSidebar } from "@/lib/SidebarContext";

const menu = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/atendimentos", label: "Atendimentos", icon: ClipboardList },
  { href: "/pacientes", label: "Pacientes", icon: Users },
  { href: "/simulador", label: "Simulador Bot", icon: MessageSquare },
  { href: "/fluxo", label: "Fluxo de Triagem", icon: GitBranch },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<Usuario | null>(null);
  const [modalSairAberto, setModalSairAberto] = useState(false);
  const { aberta, fechar } = useSidebar();

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  // Fecha sidebar ao mudar de rota (mobile)
  useEffect(() => {
    fechar();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  function confirmarLogout() {
    logout();
    router.push("/login");
  }

  const iniciais = user
    ? user.nome.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "??";

  return (
    <>
      {/* Backdrop mobile */}
      <div
        onClick={fechar}
        className={classNames(
          "lg:hidden fixed inset-0 bg-slate-900/60 z-40 transition-opacity duration-300",
          aberta ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      <aside
        className={classNames(
          "bg-slate-900 text-white flex flex-col w-64 z-50 transition-transform duration-300",
          // Mobile: fixed, slides in/out
          "fixed top-0 left-0 h-screen",
          aberta ? "translate-x-0" : "-translate-x-full",
          // Desktop: sticky, sempre visivel
          "lg:sticky lg:translate-x-0"
        )}
      >
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-santana-500 to-health-500 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight">Casa de Saude</h1>
              <p className="text-xs text-slate-400">Santana - FSA/BA</p>
            </div>
          </div>
          <button
            onClick={fechar}
            className="lg:hidden text-slate-400 hover:text-white p-1"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const Icon = item.icon;
            const ativo = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={classNames(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  ativo
                    ? "bg-santana-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-health-400 to-santana-500 flex items-center justify-center text-white font-semibold text-sm">
              {iniciais}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.nome || "Usuario"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || ""}</p>
            </div>
          </div>

          <div className="px-2">
            <div className="flex items-center gap-2 text-xs text-health-400">
              <span className="w-2 h-2 rounded-full bg-health-500 animate-pulse"></span>
              Bot online
            </div>
          </div>

          <button
            onClick={() => setModalSairAberto(true)}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-rose-600 hover:text-white transition-colors group"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>

        <ConfirmModal
          aberto={modalSairAberto}
          variante="logout"
          titulo="Sair da plataforma?"
          descricao={`${user?.nome ? `Ate logo, ${user.nome.split(" ")[0]}!` : ""} Voce precisara fazer login novamente para acessar o painel.`}
          textoConfirmar="Sim, sair"
          textoCancelar="Continuar logado"
          onConfirmar={confirmarLogout}
          onCancelar={() => setModalSairAberto(false)}
        />
      </aside>
    </>
  );
}
