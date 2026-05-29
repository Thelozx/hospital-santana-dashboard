"use client";

import { LucideIcon, AlertTriangle, LogOut, Trash2, Info, X } from "lucide-react";
import { classNames } from "@/lib/utils";

type Variante = "danger" | "warning" | "info" | "logout";

interface ConfirmModalProps {
  aberto: boolean;
  titulo: string;
  descricao: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  variante?: Variante;
  icone?: LucideIcon;
  onConfirmar: () => void;
  onCancelar: () => void;
}

const VARIANTES = {
  danger: {
    icone: Trash2,
    iconeBg: "bg-rose-100",
    iconeCor: "text-rose-600",
    botao: "bg-rose-600 hover:bg-rose-700 shadow-rose-600/30",
  },
  warning: {
    icone: AlertTriangle,
    iconeBg: "bg-amber-100",
    iconeCor: "text-amber-600",
    botao: "bg-amber-600 hover:bg-amber-700 shadow-amber-600/30",
  },
  info: {
    icone: Info,
    iconeBg: "bg-santana-100",
    iconeCor: "text-santana-600",
    botao: "bg-santana-600 hover:bg-santana-700 shadow-santana-600/30",
  },
  logout: {
    icone: LogOut,
    iconeBg: "bg-rose-100",
    iconeCor: "text-rose-600",
    botao: "bg-rose-600 hover:bg-rose-700 shadow-rose-600/30",
  },
};

export function ConfirmModal({
  aberto,
  titulo,
  descricao,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  variante = "danger",
  icone,
  onConfirmar,
  onCancelar,
}: ConfirmModalProps) {
  if (!aberto) return null;

  const config = VARIANTES[variante];
  const Icone = icone || config.icone;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onCancelar}
    >
      {/* Backdrop com blur */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up"
      >
        <button
          onClick={onCancelar}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={classNames("w-16 h-16 rounded-full flex items-center justify-center mb-4", config.iconeBg)}>
            <Icone className={classNames("w-8 h-8", config.iconeCor)} />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">{titulo}</h3>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">{descricao}</p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onCancelar}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors"
            >
              {textoCancelar}
            </button>
            <button
              onClick={onConfirmar}
              className={classNames(
                "flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-semibold transition-all shadow-lg",
                config.botao
              )}
            >
              {textoConfirmar}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
