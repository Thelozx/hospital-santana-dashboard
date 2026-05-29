"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  aberta: boolean;
  abrir: () => void;
  fechar: () => void;
  alternar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  aberta: false,
  abrir: () => {},
  fechar: () => {},
  alternar: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [aberta, setAberta] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        aberta,
        abrir: () => setAberta(true),
        fechar: () => setAberta(false),
        alternar: () => setAberta((a) => !a),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
