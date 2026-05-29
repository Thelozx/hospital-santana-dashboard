"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { classNames } from "@/lib/utils";

interface KPICardProps {
  titulo: string;
  valor: string | number;
  icone: LucideIcon;
  cor: "santana" | "health" | "amber" | "rose" | "violet";
  variacao?: number;
  subtitulo?: string;
}

const cores = {
  santana: "from-santana-500 to-santana-600 bg-santana-50 text-santana-600",
  health: "from-health-500 to-health-600 bg-health-50 text-health-600",
  amber: "from-amber-500 to-amber-600 bg-amber-50 text-amber-600",
  rose: "from-rose-500 to-rose-600 bg-rose-50 text-rose-600",
  violet: "from-violet-500 to-violet-600 bg-violet-50 text-violet-600",
};

export function KPICard({ titulo, valor, icone: Icone, cor, variacao, subtitulo }: KPICardProps) {
  const [gradient, bg, text] = cores[cor].split(" ");

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 card-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{titulo}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{valor}</p>
          {subtitulo && <p className="text-xs text-slate-400 mt-1">{subtitulo}</p>}
        </div>
        <div className={classNames("w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br", gradient)}>
          <Icone className="w-6 h-6 text-white" />
        </div>
      </div>
      {variacao !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          <div className={classNames(
            "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold",
            variacao >= 0 ? "bg-health-50 text-health-700" : "bg-rose-50 text-rose-700"
          )}>
            {variacao >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(variacao)}%
          </div>
          <span className="text-xs text-slate-500">vs ultima semana</span>
        </div>
      )}
    </div>
  );
}
