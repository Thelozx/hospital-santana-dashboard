// Dados mock realistas para o Hospital Casa de Saude Santana - Feira de Santana/BA

export type TipoAtendimento =
  | "Agendamento de Consulta"
  | "Resultado de Exame"
  | "Marcacao de Exame"
  | "Informacoes sobre Internacao"
  | "Planos de Saude"
  | "Pronto Atendimento"
  | "Reagendamento"
  | "Cancelamento"
  | "Falar com Atendente";

export type StatusAtendimento =
  | "Concluido"
  | "Em andamento"
  | "Abandonado"
  | "Transferido humano";

export type Especialidade =
  | "Clinica Geral"
  | "Cardiologia"
  | "Pediatria"
  | "Ginecologia"
  | "Ortopedia"
  | "Dermatologia"
  | "Neurologia"
  | "Oftalmologia"
  | "Otorrinolaringologia"
  | "Urologia";

export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  email?: string;
  endereco?: string;
  convenio?: string;
  cadastradoEm: string;
  totalAtendimentos: number;
}

export interface MensagemChat {
  remetente: "bot" | "paciente";
  texto: string;
  hora: string;
}

export interface Atendimento {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  tipo: TipoAtendimento;
  especialidade?: Especialidade;
  status: StatusAtendimento;
  iniciadoEm: string;
  finalizadoEm?: string;
  duracaoSegundos: number;
  mensagens: MensagemChat[];
  satisfacao?: number; // 1 a 5
}

// === Dados base para geracao ===

const NOMES = [
  "Maria Silva Santos", "Jose Pereira Oliveira", "Ana Carolina Rodrigues",
  "Joao Carlos Almeida", "Fernanda Costa Lima", "Pedro Henrique Souza",
  "Luciana Ferreira", "Roberto Carlos Mendes", "Patricia Goncalves",
  "Carlos Eduardo Ribeiro", "Juliana Martins", "Antonio Marcos Barbosa",
  "Beatriz Cardoso Nunes", "Marcelo Augusto Silva", "Camila Andrade",
  "Rafael Lima Castro", "Vanessa Pinto Araujo", "Eduardo Tavares",
  "Adriana Moreira Dias", "Felipe Nogueira", "Sandra Regina Cunha",
  "Bruno Cesar Rocha", "Tatiana Vieira Lopes", "Gustavo Henrique Mota",
  "Renata Carvalho", "Diego Fernandes Reis", "Aline Pacheco",
  "Marcos Vinicius Costa", "Priscila Batista", "Leonardo Borges",
  "Cintia Maria Freitas", "Vinicius Aguiar", "Daniela Sampaio",
  "Ricardo Augusto Macedo", "Larissa Bandeira", "Thiago Brito Sales",
  "Monica Leite Correia", "Hugo Alencar Pires", "Vivian Pessoa",
  "Sergio Murilo Antunes", "Carla Beatriz Xavier", "Otavio Mascarenhas",
  "Isabella Cruz Veloso", "Fabio Junior Galvao", "Natalia Bezerra",
  "Wagner Souza Magalhaes", "Lorena Caldas", "Mateus Pacheco Soares",
  "Helena Bittencourt", "Rodrigo Vasconcelos",
];

const TIPOS: TipoAtendimento[] = [
  "Agendamento de Consulta",
  "Resultado de Exame",
  "Marcacao de Exame",
  "Informacoes sobre Internacao",
  "Planos de Saude",
  "Pronto Atendimento",
  "Reagendamento",
  "Cancelamento",
  "Falar com Atendente",
];

// Pesos realistas (Agendamento e Resultado sao mais comuns)
const PESOS_TIPO = [25, 22, 15, 7, 6, 9, 6, 4, 6];

const ESPECIALIDADES: Especialidade[] = [
  "Clinica Geral", "Cardiologia", "Pediatria", "Ginecologia",
  "Ortopedia", "Dermatologia", "Neurologia", "Oftalmologia",
  "Otorrinolaringologia", "Urologia",
];

const PESOS_ESPECIALIDADE = [28, 14, 12, 10, 11, 8, 5, 5, 4, 3];

const CONVENIOS = ["SUS", "Unimed", "Bradesco Saude", "Hapvida", "Particular", "Amil"];

// === Geradores deterministicos (seed-based) ===

let seed = 42;
function rand() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickWeighted<T>(arr: T[], pesos: number[]): T {
  const total = pesos.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < arr.length; i++) {
    r -= pesos[i];
    if (r <= 0) return arr[i];
  }
  return arr[arr.length - 1];
}

function gerarCPF(): string {
  const n = () => Math.floor(rand() * 10);
  return `${n()}${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}-${n()}${n()}`;
}

function gerarTelefone(): string {
  const ddd = "75"; // Feira de Santana
  const n = () => Math.floor(rand() * 10);
  return `(${ddd}) 9${n()}${n()}${n()}${n()}-${n()}${n()}${n()}${n()}`;
}

function gerarDataNascimento(): string {
  const ano = 1940 + Math.floor(rand() * 70);
  const mes = String(1 + Math.floor(rand() * 12)).padStart(2, "0");
  const dia = String(1 + Math.floor(rand() * 28)).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

// Gera data dentro dos ultimos N dias com pico em horario comercial
function gerarDataAtendimento(diasAtras: number): Date {
  const agora = new Date();
  const data = new Date(agora);
  data.setDate(agora.getDate() - Math.floor(rand() * diasAtras));
  // Horario com pico 8-12h e 14-18h
  const r = rand();
  let hora;
  if (r < 0.45) hora = 8 + Math.floor(rand() * 4);
  else if (r < 0.85) hora = 14 + Math.floor(rand() * 4);
  else hora = Math.floor(rand() * 24);
  data.setHours(hora, Math.floor(rand() * 60), Math.floor(rand() * 60), 0);
  return data;
}

// === Conversas mock por tipo ===

function gerarConversa(tipo: TipoAtendimento, nomePaciente: string): MensagemChat[] {
  const horaBase = new Date();
  let minutos = 0;
  const next = () => {
    minutos += 1 + Math.floor(rand() * 2);
    const h = new Date(horaBase.getTime() + minutos * 60000);
    return `${String(h.getHours()).padStart(2, "0")}:${String(h.getMinutes()).padStart(2, "0")}`;
  };

  const base: MensagemChat[] = [
    { remetente: "bot", texto: "Ola! Bem-vindo(a) ao *Hospital Casa de Saude Santana*. Sou o assistente virtual. Como posso te ajudar hoje?\n\n1. Agendar consulta\n2. Resultado de exame\n3. Marcar exame\n4. Informacoes de internacao\n5. Plano de saude\n6. Pronto atendimento\n7. Reagendar\n8. Cancelar\n9. Falar com atendente", hora: next() },
    { remetente: "paciente", texto: getOpcao(tipo), hora: next() },
    { remetente: "bot", texto: "Otimo! Para te atender melhor, preciso de algumas informacoes.\n\nQual o seu *nome completo*?", hora: next() },
    { remetente: "paciente", texto: nomePaciente, hora: next() },
    { remetente: "bot", texto: `Obrigado, ${nomePaciente.split(" ")[0]}! Agora me informe o seu *CPF* (apenas numeros).`, hora: next() },
    { remetente: "paciente", texto: gerarCPF().replace(/\D/g, ""), hora: next() },
  ];

  // Continuacao especifica do fluxo
  if (tipo === "Agendamento de Consulta") {
    const esp = pickWeighted(ESPECIALIDADES, PESOS_ESPECIALIDADE);
    base.push(
      { remetente: "bot", texto: "Perfeito! Qual *especialidade* voce deseja agendar?", hora: next() },
      { remetente: "paciente", texto: esp, hora: next() },
      { remetente: "bot", texto: `Temos os seguintes horarios disponiveis para ${esp}:\n\n1. Seg 02/06 - 09:00\n2. Ter 03/06 - 14:30\n3. Qui 05/06 - 10:00\n\nDigite o numero da opcao desejada.`, hora: next() },
      { remetente: "paciente", texto: String(1 + Math.floor(rand() * 3)), hora: next() },
      { remetente: "bot", texto: `Consulta agendada com sucesso!\n\n*Hospital Casa de Saude Santana*\nFeira de Santana - BA\nLeve documento com foto e cartao do convenio.\n\nDeseja algo mais?`, hora: next() },
      { remetente: "paciente", texto: "Nao, obrigado!", hora: next() },
      { remetente: "bot", texto: "Por nada! Tenha um otimo dia.", hora: next() },
    );
  } else if (tipo === "Resultado de Exame") {
    base.push(
      { remetente: "bot", texto: "Qual o *codigo do exame* (presente no protocolo)?", hora: next() },
      { remetente: "paciente", texto: `EX${1000 + Math.floor(rand() * 9000)}`, hora: next() },
      { remetente: "bot", texto: "Encontrei seu exame! Ele esta *disponivel* desde 28/05.\n\nVoce pode acessa-lo:\n- Pelo portal do paciente\n- Ou recebe-lo por email\n\nDeseja receber por email?", hora: next() },
      { remetente: "paciente", texto: "Sim", hora: next() },
      { remetente: "bot", texto: "Enviado para o email cadastrado. Posso ajudar com mais alguma coisa?", hora: next() },
    );
  } else if (tipo === "Pronto Atendimento") {
    base.push(
      { remetente: "bot", texto: "Por favor, descreva *brevemente* o que esta sentindo:", hora: next() },
      { remetente: "paciente", texto: pick(["Dor de cabeca forte", "Febre alta ha 2 dias", "Dor abdominal", "Falta de ar"]), hora: next() },
      { remetente: "bot", texto: "Obrigado. Recomendo que va ao nosso pronto atendimento.\n\n*Endereco:* Av. Getulio Vargas, Centro - Feira de Santana\n*Aberto 24h*\n\nVou notificar a equipe sobre sua chegada. Pode vir agora?", hora: next() },
      { remetente: "paciente", texto: "Sim, vou agora", hora: next() },
      { remetente: "bot", texto: "Equipe notificada. Tenha uma boa vinda!", hora: next() },
    );
  } else if (tipo === "Falar com Atendente") {
    base.push(
      { remetente: "bot", texto: "Vou transferir voce para um atendente humano. Aguarde um momento...", hora: next() },
      { remetente: "bot", texto: "[Conversa transferida para atendente Maria - setor recepcao]", hora: next() },
    );
  } else {
    base.push(
      { remetente: "bot", texto: `Sua solicitacao de *${tipo}* foi registrada. Em breve um atendente entrara em contato. Posso ajudar com mais alguma coisa?`, hora: next() },
      { remetente: "paciente", texto: "Nao, obrigado", hora: next() },
      { remetente: "bot", texto: "Tenha um otimo dia!", hora: next() },
    );
  }

  return base;
}

function getOpcao(tipo: TipoAtendimento): string {
  const mapa: Record<TipoAtendimento, string> = {
    "Agendamento de Consulta": "1",
    "Resultado de Exame": "2",
    "Marcacao de Exame": "3",
    "Informacoes sobre Internacao": "4",
    "Planos de Saude": "5",
    "Pronto Atendimento": "6",
    "Reagendamento": "7",
    "Cancelamento": "8",
    "Falar com Atendente": "9",
  };
  return mapa[tipo];
}

// === Geracao do dataset ===

export function gerarPacientes(qtd: number = 80): Paciente[] {
  seed = 42;
  const pacientes: Paciente[] = [];
  for (let i = 0; i < qtd; i++) {
    const nome = NOMES[i % NOMES.length];
    pacientes.push({
      id: `P${String(i + 1).padStart(4, "0")}`,
      nome,
      cpf: gerarCPF(),
      telefone: gerarTelefone(),
      dataNascimento: gerarDataNascimento(),
      email: `${nome.toLowerCase().split(" ")[0]}.${nome.toLowerCase().split(" ").pop()}@email.com`,
      endereco: `Rua ${pick(["das Flores", "do Comercio", "Marechal Deodoro", "Senador Quintino", "Conselheiro Franco", "Sales Barbosa"])}, ${Math.floor(rand() * 500) + 1} - Feira de Santana/BA`,
      convenio: pick(CONVENIOS),
      cadastradoEm: gerarDataAtendimento(60).toISOString(),
      totalAtendimentos: 0, // calculado depois
    });
  }
  return pacientes;
}

export function gerarAtendimentos(pacientes: Paciente[], qtd: number = 180): Atendimento[] {
  seed = 100;
  const atendimentos: Atendimento[] = [];
  const contadorPaciente: Record<string, number> = {};

  for (let i = 0; i < qtd; i++) {
    const paciente = pacientes[Math.floor(rand() * pacientes.length)];
    const tipo = pickWeighted(TIPOS, PESOS_TIPO);
    const inicio = gerarDataAtendimento(30);
    const statusR = rand();
    let status: StatusAtendimento;
    if (statusR < 0.62) status = "Concluido";
    else if (statusR < 0.78) status = "Em andamento";
    else if (statusR < 0.92) status = "Abandonado";
    else status = "Transferido humano";

    const duracao = 60 + Math.floor(rand() * 480);
    const fim = new Date(inicio.getTime() + duracao * 1000);

    const conversa = gerarConversa(tipo, paciente.nome);
    contadorPaciente[paciente.id] = (contadorPaciente[paciente.id] || 0) + 1;

    atendimentos.push({
      id: `A${String(i + 1).padStart(5, "0")}`,
      pacienteId: paciente.id,
      pacienteNome: paciente.nome,
      tipo,
      especialidade: tipo === "Agendamento de Consulta" ? pickWeighted(ESPECIALIDADES, PESOS_ESPECIALIDADE) : undefined,
      status,
      iniciadoEm: inicio.toISOString(),
      finalizadoEm: status !== "Em andamento" ? fim.toISOString() : undefined,
      duracaoSegundos: duracao,
      mensagens: conversa,
      satisfacao: status === "Concluido" ? 3 + Math.floor(rand() * 3) : undefined,
    });
  }

  // Atualiza contador
  pacientes.forEach((p) => {
    p.totalAtendimentos = contadorPaciente[p.id] || 0;
  });

  // Ordena por data desc
  atendimentos.sort((a, b) => new Date(b.iniciadoEm).getTime() - new Date(a.iniciadoEm).getTime());
  return atendimentos;
}

// === Singleton de dados (gera uma vez) ===

let _pacientes: Paciente[] | null = null;
let _atendimentos: Atendimento[] | null = null;

export function getPacientes(): Paciente[] {
  if (!_pacientes) {
    _pacientes = gerarPacientes(80);
    _atendimentos = gerarAtendimentos(_pacientes, 180);
  }
  return _pacientes;
}

export function getAtendimentos(): Atendimento[] {
  if (!_atendimentos) {
    _pacientes = gerarPacientes(80);
    _atendimentos = gerarAtendimentos(_pacientes, 180);
  }
  return _atendimentos;
}

// === Fluxo de triagem padrao ===

export interface NoFluxo {
  id: string;
  pergunta: string;
  opcoes: { texto: string; proximo?: string }[];
  tipo: "menu" | "input" | "final";
}

export const FLUXO_PADRAO: NoFluxo[] = [
  {
    id: "inicio",
    pergunta: "Ola! Bem-vindo(a) ao Hospital Casa de Saude Santana. Como posso te ajudar?",
    tipo: "menu",
    opcoes: [
      { texto: "Agendar consulta", proximo: "agendamento" },
      { texto: "Resultado de exame", proximo: "resultado" },
      { texto: "Marcar exame", proximo: "marcar_exame" },
      { texto: "Pronto atendimento", proximo: "emergencia" },
      { texto: "Falar com atendente", proximo: "humano" },
    ],
  },
  {
    id: "agendamento",
    pergunta: "Qual especialidade voce deseja?",
    tipo: "menu",
    opcoes: [
      { texto: "Clinica Geral", proximo: "coletar_dados" },
      { texto: "Cardiologia", proximo: "coletar_dados" },
      { texto: "Pediatria", proximo: "coletar_dados" },
      { texto: "Outras especialidades", proximo: "coletar_dados" },
    ],
  },
  {
    id: "coletar_dados",
    pergunta: "Por favor informe seu nome completo e CPF para prosseguir.",
    tipo: "input",
    opcoes: [{ texto: "Continuar", proximo: "agendar_horario" }],
  },
  {
    id: "agendar_horario",
    pergunta: "Estes sao os horarios disponiveis:",
    tipo: "menu",
    opcoes: [
      { texto: "Manha (08h-12h)", proximo: "confirmacao" },
      { texto: "Tarde (14h-18h)", proximo: "confirmacao" },
    ],
  },
  {
    id: "confirmacao",
    pergunta: "Agendamento realizado com sucesso! Voce recebera a confirmacao por SMS.",
    tipo: "final",
    opcoes: [],
  },
  {
    id: "resultado",
    pergunta: "Informe o codigo do seu exame (presente no protocolo):",
    tipo: "input",
    opcoes: [{ texto: "Buscar", proximo: "envio_resultado" }],
  },
  {
    id: "envio_resultado",
    pergunta: "Resultado encontrado! Enviado para o email cadastrado.",
    tipo: "final",
    opcoes: [],
  },
  {
    id: "emergencia",
    pergunta: "Descreva brevemente o que esta sentindo:",
    tipo: "input",
    opcoes: [{ texto: "Continuar", proximo: "endereco_pa" }],
  },
  {
    id: "endereco_pa",
    pergunta: "Recomendamos que va ao Pronto Atendimento. Endereco: Av. Getulio Vargas, Centro - Feira de Santana. Aberto 24h.",
    tipo: "final",
    opcoes: [],
  },
  {
    id: "humano",
    pergunta: "Transferindo para um atendente humano. Aguarde um momento...",
    tipo: "final",
    opcoes: [],
  },
  {
    id: "marcar_exame",
    pergunta: "Qual exame voce gostaria de marcar?",
    tipo: "input",
    opcoes: [{ texto: "Continuar", proximo: "coletar_dados" }],
  },
];
