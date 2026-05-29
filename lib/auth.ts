"use client";

export interface Usuario {
  nome: string;
  email: string;
  cargo?: string;
  telefone?: string;
}

interface UsuarioCadastro extends Usuario {
  senha: string;
}

const KEY_USUARIOS = "santana_usuarios";
const KEY_CURRENT = "santana_current_user";

// Usuario admin padrao (sempre funciona)
const ADMIN_DEFAULT = {
  nome: "Admin Hospital",
  email: "admin@santana.com.br",
  senha: "admin123",
  cargo: "Administrador",
};

function getUsuarios(): UsuarioCadastro[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(KEY_USUARIOS);
  return data ? JSON.parse(data) : [];
}

function salvarUsuarios(usuarios: UsuarioCadastro[]) {
  localStorage.setItem(KEY_USUARIOS, JSON.stringify(usuarios));
}

export function login(email: string, senha: string): { sucesso: boolean; erro?: string } {
  if (!email || !senha) return { sucesso: false, erro: "Preencha email e senha" };

  // Admin default
  if (email === ADMIN_DEFAULT.email && senha === ADMIN_DEFAULT.senha) {
    const { senha: _, ...user } = ADMIN_DEFAULT;
    localStorage.setItem(KEY_CURRENT, JSON.stringify(user));
    return { sucesso: true };
  }

  const usuarios = getUsuarios();
  const usuario = usuarios.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!usuario) return { sucesso: false, erro: "Email nao cadastrado" };
  if (usuario.senha !== senha) return { sucesso: false, erro: "Senha incorreta" };

  const { senha: _, ...user } = usuario;
  localStorage.setItem(KEY_CURRENT, JSON.stringify(user));
  return { sucesso: true };
}

export function cadastrar(dados: UsuarioCadastro): { sucesso: boolean; erro?: string } {
  if (!dados.nome || !dados.email || !dados.senha) {
    return { sucesso: false, erro: "Preencha todos os campos obrigatorios" };
  }
  if (dados.senha.length < 6) {
    return { sucesso: false, erro: "A senha deve ter no minimo 6 caracteres" };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
    return { sucesso: false, erro: "Email invalido" };
  }

  const usuarios = getUsuarios();
  if (usuarios.find((u) => u.email.toLowerCase() === dados.email.toLowerCase())) {
    return { sucesso: false, erro: "Este email ja esta cadastrado" };
  }

  usuarios.push(dados);
  salvarUsuarios(usuarios);

  const { senha: _, ...user } = dados;
  localStorage.setItem(KEY_CURRENT, JSON.stringify(user));
  return { sucesso: true };
}

export function logout() {
  localStorage.removeItem(KEY_CURRENT);
}

export function getCurrentUser(): Usuario | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(KEY_CURRENT);
  return data ? JSON.parse(data) : null;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
