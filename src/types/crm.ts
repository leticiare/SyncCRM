export type OrigemLead = string;
export type SegmentoAtuacao = string;
export type CategoriaServico = string;

export type StatusEtapa = 
  | 'Lead Qualificado'
  | 'Reunião de Diagnóstico'
  | 'Proposta Enviada'
  | 'Negociação / Contrato'
  | 'Fechado (Ganho)'
  | 'Perdido';

export type MotivoPerda = 
  | 'Preço/Orçamento'
  | 'Prazo de Entrega'
  | 'Concorrente'
  | 'Escopo Fora de Perfil'
  | 'Prioridade Mudou no Cliente';

export interface Lead {
  id: string;
  nome_contato: string;
  cargo: string;
  nome_empresa: string;
  cnpj: string;
  email: string;
  telefone_whatsapp: string;
  origem: OrigemLead;
  segmento_atuacao: SegmentoAtuacao;
  categoria_servico: CategoriaServico[];
  status_etapa: StatusEtapa;
  valor_estimado: number;
  data_criacao: string; // ISO
  ultima_interacao: string; // ISO
  diagnostico_realizado?: boolean;
  resumo_diagnostico?: string;
  motivo_perda?: MotivoPerda;
  observacao_perda?: string;
  probabilidade?: number; // 0 a 100%
  prioridade?: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
}

export interface ChecklistItem {
  id: string;
  texto: string;
  concluido: boolean;
  responsavel?: string;
}

export interface Projeto {
  id: string;
  lead_id: string;
  nome_projeto: string;
  cliente: string;
  responsavel_tecnico: string;
  valor: number;
  data_inicio: string; // YYYY-MM-DD
  status: 'Kick-off' | 'Em Andamento' | 'Em Homologação' | 'Concluído';
  checklist_inicial: ChecklistItem[];
  descricao_escopo?: string;
}

export type TipoInteracao = 
  | 'Ata de Reunião' 
  | 'E-mail/Mensagem' 
  | 'Link do Drive/SharePoint' 
  | 'Arquivo/Proposta' 
  | 'Feedback';

export interface Interacao {
  id: string;
  lead_id: string;
  tipo: TipoInteracao;
  conteudo: string;
  autor: string;
  data_hora: string; // ISO
  anexo_nome?: string;
  anexo_url?: string;
}

export type TipoAlerta = 'lead_parado' | 'proposta_sem_resposta' | 'inicio_projeto';

export interface AlertaSLA {
  id: string;
  tipo: TipoAlerta;
  titulo: string;
  descricao: string;
  lead_id?: string;
  projeto_id?: string;
  data_referencia: string;
  severidade: 'urgente' | 'atencao' | 'info';
}
