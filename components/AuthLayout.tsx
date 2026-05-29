"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { isAuthenticated } from "@/lib/auth";
import { SidebarProvider } from "@/lib/SidebarContext";

const ROTAS_PUBLICAS = ["/login", "/cadastro"];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [verificado, setVerificado] = useState(false);

  const ehPublica = ROTAS_PUBLICAS.includes(pathname);

  useEffect(() => {
    if (ehPublica) {
      setVerificado(true);
      return;
    }
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      setVerificado(true);
    }
  }, [pathname, ehPublica, router]);

  if (ehPublica) {
    return <>{children}</>;
  }

  if (!verificado) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-5 h-5 border-2 border-santana-600 border-t-transparent rounded-full animate-spin"></div>
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="lg:flex min-h-screen">
        <Sidebar />
        <main className="flex-1 min-w-0 w-full">{children}</main>
      </div>
    </SidebarProvider>
  );
}
