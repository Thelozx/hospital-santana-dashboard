"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  GitBranch,
  ClipboardList,
  Activity,
} from "lucide-react";
import { classNames } from "@/lib/utils";

const menu = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/atendimentos", label: "Atendimentos", icon: ClipboardList },
  { href: "/pacientes", label: "Pacientes", icon: Users },
  { href: "/simulador", label: "Simulador Bot", icon: MessageSquare },
  { href: "/fluxo", label: "Fluxo de Triagem", icon: GitBranch },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-santana-500 to-health-500 flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">Casa de Saude</h1>
            <p className="text-xs text-slate-400">Santana - FSA/BA</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
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

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-health-400 to-santana-500 flex items-center justify-center text-white font-semibold text-sm">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin Hospital</p>
            <p className="text-xs text-slate-400 truncate">admin@santana.com.br</p>
          </div>
        </div>
        <div className="mt-3 px-2">
          <div className="flex items-center gap-2 text-xs text-health-400">
            <span className="w-2 h-2 rounded-full bg-health-500 animate-pulse"></span>
            Bot online
          </div>
        </div>
      </div>
    </aside>
  );
}
