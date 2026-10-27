import { Lead, Projeto, Interacao } from "../types/crm";

// Gerador de datas relativas para manter os alertas de SLA ativos dinamicamente
const now = new Date();
const hoursAgo = (hours: number) =>
  new Date(now.getTime() - hours * 3600 * 1000).toISOString();
const daysAgo = (days: number) =>
  new Date(now.getTime() - days * 24 * 3600 * 1000).toISOString();
const daysAhead = (days: number) => {
  const d = new Date(now.getTime() + days * 24 * 3600 * 1000);
  return d.toISOString().split("T")[0];
};

export const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-01",
    nome_empresa: "LogiFlow Logística Integrada S.A.",
    nome_contato: "Carlos Eduardo Silveira",
    cargo: "Diretor de Operações e Supply Chain",
    cnpj: "45892134000188",
    email: "carlos.silveira@logiflow.com.br",
    telefone_whatsapp: "11984521190",
    origem: "Indicação B2B",
    segmento_atuacao: "Logística",
    categoria_servico: "Engenharia/Integração de Dados (ETL, Supabase, n8n)",
    status_etapa: "Lead Qualificado",
    valor_estimado: 78000,
    data_criacao: daysAgo(5),
    ultima_interacao: hoursAgo(62), // > 48h sem interação -> Alerta SLA ⚠️ Lead Parado
    diagnostico_realizado: false,
    probabilidade: 30,
    prioridade: "Alta",
  },
  {
    id: "lead-02",
    nome_empresa: "FinTech Ágora Capital",
    nome_contato: "Mariana Drummond",
    cargo: "Head de Dados & BI",
    cnpj: "33419082000145",
    email: "mariana.drummond@agoracapital.com.br",
    telefone_whatsapp: "11971204481",
    origem: "LinkedIn",
    segmento_atuacao: "FinTech",
    categoria_servico: "Business Intelligence/Dashboards",
    status_etapa: "Reunião de Diagnóstico",
    valor_estimado: 95000,
    data_criacao: daysAgo(6),
    ultima_interacao: hoursAgo(14),
    diagnostico_realizado: true,
    resumo_diagnostico:
      "Cliente possui dados dispersos em Postgres e ERP Protheus. Necessitam centralizar métricas de churn e LTV em data warehouse Snowflake com visualização no Power BI / Superset.",
    probabilidade: 60,
    prioridade: "Crítica",
  },
  {
    id: "lead-03",
    nome_empresa: "Sync Saúde & Diagnósticos",
    nome_contato: "Dr. Roberto Fagundes",
    cargo: "VP de Tecnologia & Inovação",
    cnpj: "18994512000109",
    email: "roberto.fagundes@syncdiagnosticos.med.br",
    telefone_whatsapp: "21998341052",
    origem: "Busca Ativa",
    segmento_atuacao: "Saúde",
    categoria_servico: "Automação de Processos/IA",
    status_etapa: "Proposta Enviada",
    valor_estimado: 145000,
    data_criacao: daysAgo(18),
    ultima_interacao: daysAgo(8), // > 5 dias úteis sem resposta -> Alerta SLA ⏳ Proposta Sem Resposta
    diagnostico_realizado: true,
    resumo_diagnostico:
      "Desenvolvimento de agentes de IA com RAG para triagem e leitura de laudos e exames laboratoriais, integrado a sistema legado MV.",
    probabilidade: 70,
    prioridade: "Alta",
  },
  {
    id: "lead-04",
    nome_empresa: "VarejoGlobal Omnichannel",
    nome_contato: "Patrícia Albuquerque",
    cargo: "Gerente Geral de E-commerce",
    cnpj: "07123984000172",
    email: "patricia.a@varejoglobal.com.br",
    telefone_whatsapp: "31988293310",
    origem: "Site",
    segmento_atuacao: "Varejo",
    categoria_servico: "Engenharia/Integração de Dados (ETL, Supabase, n8n)",
    status_etapa: "Negociação / Contrato",
    valor_estimado: 120000,
    data_criacao: daysAgo(25),
    ultima_interacao: hoursAgo(18),
    diagnostico_realizado: true,
    resumo_diagnostico:
      "Integração bidirecional entre Shopify, VTEX, Bling e ERP TOTVS via n8n auto-hospedado e Supabase para controle de estoque em tempo real.",
    probabilidade: 90,
    prioridade: "Crítica",
  },
  {
    id: "lead-05",
    nome_empresa: "Indústria MetalBrasil Ltda",
    nome_contato: "Henrique Vasconcelos",
    cargo: "Gerente de TI Industrial",
    cnpj: "61458923000115",
    email: "henrique.ti@metalbrasil.ind.br",
    telefone_whatsapp: "19991283041",
    origem: "Abordagem Direta",
    segmento_atuacao: "Indústria",
    categoria_servico: "Consultoria/Suporte em TI",
    status_etapa: "Lead Qualificado",
    valor_estimado: 54000,
    data_criacao: daysAgo(1),
    ultima_interacao: hoursAgo(8),
    diagnostico_realizado: false,
    probabilidade: 25,
    prioridade: "Média",
  },
  {
    id: "lead-06",
    nome_empresa: "AgroData Soluções Rurais",
    nome_contato: "Fernando Castilho",
    cargo: "Sócio-Diretor de Operações",
    cnpj: "22876140000199",
    email: "fernando@agrodata.com.br",
    telefone_whatsapp: "67992015542",
    origem: "Indicação B2B",
    segmento_atuacao: "Agronegócio",
    categoria_servico: "Business Intelligence/Dashboards",
    status_etapa: "Fechado (Ganho)",
    valor_estimado: 110000,
    data_criacao: daysAgo(35),
    ultima_interacao: daysAgo(2),
    diagnostico_realizado: true,
    resumo_diagnostico:
      "Pipeline de telemetria de colheitadeiras e previsão de safra consolidada em lakehouse BigQuery.",
    probabilidade: 100,
    prioridade: "Alta",
  },
  {
    id: "lead-07",
    nome_empresa: "CrediMais Soluções Financeiras",
    nome_contato: "Juliana Penteado",
    cargo: "Head de Novos Produtos",
    cnpj: "50124873000160",
    email: "juliana.p@credimais.com.br",
    telefone_whatsapp: "11981120093",
    origem: "LinkedIn",
    segmento_atuacao: "Serviços Financeiros",
    categoria_servico: "Automação de Processos/IA",
    status_etapa: "Perdido",
    valor_estimado: 85000,
    data_criacao: daysAgo(40),
    ultima_interacao: daysAgo(12),
    diagnostico_realizado: true,
    motivo_perda: "Preço/Orçamento",
    observacao_perda:
      "Cliente optou por postergar o investimento para o próximo Q3 devido ao corte de budget corporativo na matriz.",
    probabilidade: 0,
    prioridade: "Baixa",
  },
];

export const INITIAL_PROJETOS: Projeto[] = [
  {
    id: "proj-01",
    lead_id: "lead-06",
    nome_projeto: "Implementação Lakehouse & BI Agronegócio",
    cliente: "AgroData Soluções Rurais",
    responsavel_tecnico: "Lucas Alencar (Senior Data Architect)",
    valor: 110000,
    data_inicio: daysAhead(2), // Inicia em 2 dias -> Alerta SLA 🚀 Início de Projeto
    status: "Kick-off",
    descricao_escopo:
      "Configuração da ingestão de telemetria IoT agrícola, modelagem dimensional em BigQuery e homologação de 4 painéis operacionais.",
    checklist_inicial: [
      {
        id: "c1",
        texto: "Reunião de alinhamento com dev e sponsor do projeto",
        concluido: true,
        responsavel: "Lucas Alencar",
      },
      {
        id: "c2",
        texto: "Acesso aos ambientes concedido (GCP, BigQuery, VPN)",
        concluido: true,
        responsavel: "Cliente",
      },
      {
        id: "c3",
        texto: "Validação de escopo técnico e baseline de dados",
        concluido: false,
        responsavel: "Lucas Alencar",
      },
      {
        id: "c4",
        texto: "Setup do repositório Git e pipelines CI/CD de ETL",
        concluido: false,
        responsavel: "Time DevOps",
      },
      {
        id: "c5",
        texto: "Aprovação formal do blueprint de arquitetura",
        concluido: false,
        responsavel: "Lucas Alencar",
      },
    ],
  },
  {
    id: "proj-02",
    lead_id: "lead-legacy-01",
    nome_projeto: "Pipelines n8n & Supabase Enterprise",
    cliente: "sync Retail Brasil",
    responsavel_tecnico: "Beatriz Mendes (Data Engineer)",
    valor: 92000,
    data_inicio: daysAgo(15).split("T")[0],
    status: "Em Andamento",
    descricao_escopo:
      "Orquestração de fluxos de cancelamento e emissão de notas fiscais com sincronização Supabase PostgreSQL.",
    checklist_inicial: [
      {
        id: "c11",
        texto: "Reunião de alinhamento com dev",
        concluido: true,
        responsavel: "Beatriz Mendes",
      },
      {
        id: "c12",
        texto: "Acesso aos ambientes concedido",
        concluido: true,
        responsavel: "Cliente",
      },
      {
        id: "c13",
        texto: "Validação de escopo técnico",
        concluido: true,
        responsavel: "Beatriz Mendes",
      },
      {
        id: "c14",
        texto: "Setup do ambiente de staging n8n",
        concluido: true,
        responsavel: "Beatriz Mendes",
      },
      {
        id: "c15",
        texto: "Deploy em produção e treinamento da equipe",
        concluido: false,
        responsavel: "Beatriz Mendes",
      },
    ],
  },
];

export const INITIAL_INTERACOES: Interacao[] = [
  {
    id: "int-01",
    lead_id: "lead-01",
    tipo: "E-mail/Mensagem",
    conteudo:
      "Envio de apresentação institucional de casos de sucesso em ETL e n8n para a equipe técnica de logística.",
    autor: "Renato Guimarães (Account Executive)",
    data_hora: hoursAgo(62),
  },
  {
    id: "int-02",
    lead_id: "lead-02",
    tipo: "Ata de Reunião",
    conteudo:
      "Reunião de Diagnóstico Técnico com Mariana (Head de Dados) e equipe de infraestrutura. Ficou evidenciada a dor de demora de 4h nas cargas noturnas no banco atual.",
    autor: "Thiago Rocha (Tech Lead Dados)",
    data_hora: hoursAgo(14),
  },
  {
    id: "int-03",
    lead_id: "lead-02",
    tipo: "Link do Drive/SharePoint",
    conteudo:
      "Pasta de especificações técnicas de schemas e dicionário de dados compartilhado pelo cliente.",
    autor: "Mariana Drummond",
    data_hora: hoursAgo(12),
    anexo_nome: "Dicionário_Dados_AgoraCapital_v2.xlsx",
    anexo_url: "https://sharepoint.com/folders/agora-capital-specs",
  },
  {
    id: "int-04",
    lead_id: "lead-03",
    tipo: "Arquivo/Proposta",
    conteudo:
      "Envio da Proposta Comercial e Técnica v1.0 contendo arquitetura de agentes IA para triagem de laudos.",
    autor: "Renato Guimarães (Account Executive)",
    data_hora: daysAgo(8),
    anexo_nome: "Proposta_Comercial_SyncSaude_v1.0.pdf",
    anexo_url: "https://docs.syncconsulting.com/propostas/sync-saude-v1.pdf",
  },
  {
    id: "int-05",
    lead_id: "lead-04",
    tipo: "Ata de Reunião",
    conteudo:
      "Alinhamento final com o Jurídico e Compras. Ajustes de cláusulas de SLA para 99.8% nas automações n8n aceitos.",
    autor: "Renato Guimarães (Account Executive)",
    data_hora: hoursAgo(18),
  },
  {
    id: "int-06",
    lead_id: "lead-06",
    tipo: "Feedback",
    conteudo:
      "Contrato assinado digitalmente via DocuSign! Cliente elogiou a profundidade técnica do assessment.",
    autor: "Diretoria Comercial",
    data_hora: daysAgo(2),
  },
];
