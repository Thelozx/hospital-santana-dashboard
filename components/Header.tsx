"use client";

import { Bell, Search, Menu } from "lucide-react";
import { useSidebar } from "@/lib/SidebarContext";

interface HeaderProps {
  titulo: string;
  subtitulo?: string;
}

export function Header({ titulo, subtitulo }: HeaderProps) {
  const { alternar } = useSidebar();

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 sticky top-0 z-30">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={alternar}
            className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>

          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">{titulo}</h1>
            {subtitulo && <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1 truncate">{subtitulo}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-lg text-sm w-48 lg:w-64 focus:outline-none focus:border-santana-500 focus:bg-white transition-colors"
            />
          </div>
          <button className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Buscar">
            <Search className="w-5 h-5 text-slate-600" />
          </button>
          <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Notificacoes">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
