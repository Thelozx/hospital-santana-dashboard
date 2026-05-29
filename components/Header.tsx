"use client";

import { Bell, Search } from "lucide-react";

interface HeaderProps {
  titulo: string;
  subtitulo?: string;
}

export function Header({ titulo, subtitulo }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{titulo}</h1>
          {subtitulo && <p className="text-sm text-slate-500 mt-1">{subtitulo}</p>}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 bg-slate-100 border border-transparent rounded-lg text-sm w-64 focus:outline-none focus:border-santana-500 focus:bg-white transition-colors"
            />
          </div>
          <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
}
