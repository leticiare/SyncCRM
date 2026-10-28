import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Lead, 
  Projeto, 
  Interacao, 
  StatusEtapa, 
  MotivoPerda, 
  AlertaSLA,
  ChecklistItem 
} from '../types/crm';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

interface CrmContextType {
  leads: Lead[];
  projetos: Projeto[];
  interacoes: Interacao[];
  selectedLead: Lead | null;
  setSelectedLead: (lead: Lead | null) => void;
  activeTab: 'pipeline' | 'projetos' | 'analytics';
  setActiveTab: (tab: 'pipeline' | 'projetos' | 'analytics') => void;
  pipelineView: 'kanban' | 'tabela';
  setPipelineView: (view: 'kanban' | 'tabela') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterServico: string;
  setFilterServico: (servico: string) => void;
  filterSegmento: string;
  setFilterSegmento: (segmento: string) => void;
  filterOrigem: string;
  setFilterOrigem: (origem: string) => void;
  alertasSLA: AlertaSLA[];
  
  // Modais de validação de transição
  diagnosticModalLead: { lead: Lead; targetStatus: StatusEtapa } | null;
  setDiagnosticModalLead: (item: { lead: Lead; targetStatus: StatusEtapa } | null) => void;
  lossModalLead: { lead: Lead; targetStatus: StatusEtapa } | null;
  setLossModalLead: (item: { lead: Lead; targetStatus: StatusEtapa } | null) => void;
  wonModalLead: { lead: Lead; targetStatus: StatusEtapa } | null;
  setWonModalLead: (item: { lead: Lead; targetStatus: StatusEtapa } | null) => void;
  
  isNewLeadModalOpen: boolean;
  setIsNewLeadModalOpen: (open: boolean) => void;
  
  // Ações do Pipeline
  requestMoveLead: (leadId: string, newStatus: StatusEtapa) => void;
  confirmDiagnosticAndMove: (leadId: string, resumoDiagnostico: string) => void;
  confirmLossAndMove: (leadId: string, motivo: MotivoPerda, observacao: string) => void;
  confirmWonAndCreateProject: (
    leadId: string, 
    nomeProjeto: string, 
    responsavelTecnico: string, 
    dataInicio: string,
    checklist: string[]
  ) => void;
  
  // CRUD
  createLead: (newLead: Omit<Lead, 'id' | 'data_criacao' | 'ultima_interacao'>) => Lead;
  updateLead: (leadId: string, data: Partial<Lead>) => void;
  deleteLead: (leadId: string) => void;
  addInteracao: (interacao: Omit<Interacao, 'id' | 'data_hora'>) => void;
  toggleChecklistItem: (projetoId: string, itemId: string) => void;
  addChecklistItem: (projetoId: string, texto: string, responsavel?: string) => void;
  updateProjeto: (projetoId: string, data: Partial<Projeto>) => void;
  
  // Toasts
  toast: ToastNotification | null;
  showToast: (title: string, message: string, type?: ToastNotification['type']) => void;
  dismissToast: () => void;
  
}

const CrmContext = createContext<CrmContextType | undefined>(undefined);

const STORAGE_LEADS_KEY = 'synccrm_leads_v2';
const STORAGE_PROJETOS_KEY = 'synccrm_projetos_v2';
const STORAGE_INTERACOES_KEY = 'synccrm_interacoes_v2';
const LEGACY_STORAGE_KEYS = [
  'vortex_crm_leads_v1',
  'vortex_crm_projetos_v1',
  'vortex_crm_interacoes_v1'
];

const normalizeLead = (lead: Lead): Lead => {
  const rawCategoria = (lead as Lead & { categoria_servico?: string | string[] }).categoria_servico;
  return {
    ...lead,
    categoria_servico: Array.isArray(rawCategoria)
      ? rawCategoria.filter(Boolean)
      : rawCategoria
        ? [rawCategoria]
        : []
  };
};

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LEADS_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.map(normalizeLead) : [];
    } catch {
      return [];
    }
  });

  const [projetos, setProjetos] = useState<Projeto[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROJETOS_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [interacoes, setInteracoes] = useState<Interacao[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_INTERACOES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'projetos' | 'analytics'>('pipeline');
  const [pipelineView, setPipelineView] = useState<'kanban' | 'tabela'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterServico, setFilterServico] = useState('');
  const [filterSegmento, setFilterSegmento] = useState('');
  const [filterOrigem, setFilterOrigem] = useState('');
  
  // Modais de Transição
  const [diagnosticModalLead, setDiagnosticModalLead] = useState<{ lead: Lead; targetStatus: StatusEtapa } | null>(null);
  const [lossModalLead, setLossModalLead] = useState<{ lead: Lead; targetStatus: StatusEtapa } | null>(null);
  const [wonModalLead, setWonModalLead] = useState<{ lead: Lead; targetStatus: StatusEtapa } | null>(null);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState<ToastNotification | null>(null);

  useEffect(() => {
    LEGACY_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
  }, []);

  // Persistência
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error('Falha ao salvar leads:', e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROJETOS_KEY, JSON.stringify(projetos));
    } catch (e) {
      console.error('Falha ao salvar projetos:', e);
    }
  }, [projetos]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_INTERACOES_KEY, JSON.stringify(interacoes));
    } catch (e) {
      console.error('Falha ao salvar interações:', e);
    }
  }, [interacoes]);

  // Manter selectedLead sincronizado se leads mudarem
  useEffect(() => {
    if (selectedLead) {
      const updated = leads.find(l => l.id === selectedLead.id);
      if (updated) setSelectedLead(updated);
    }
  }, [leads]);

  const showToast = (title: string, message: string, type: ToastNotification['type'] = 'info') => {
    const id = Date.now().toString();
    setToast({ id, title, message, type });
    setTimeout(() => {
      setToast(current => (current?.id === id ? null : current));
    }, 4500);
  };

  const dismissToast = () => setToast(null);

  // Cálculo da Central de Alertas SLA
  const alertasSLA = useMemo<AlertaSLA[]>(() => {
    const alertas: AlertaSLA[] = [];
    const now = new Date().getTime();

    // 1. ⚠️ Lead Parado: Leads em "Lead Qualificado" sem interação há mais de 48 horas
    leads.forEach(lead => {
      if (lead.status_etapa === 'Lead Qualificado') {
        const lastInteraction = new Date(lead.ultima_interacao).getTime();
        const diffHours = (now - lastInteraction) / (1000 * 60 * 60);
        if (diffHours >= 48) {
          alertas.push({
            id: `sla-parado-${lead.id}`,
            tipo: 'lead_parado',
            titulo: 'Lead Parado há mais de 48h',
            descricao: `${lead.nome_empresa} (${lead.nome_contato}) está sem contato há ${Math.floor(diffHours)}h.`,
            lead_id: lead.id,
            data_referencia: lead.ultima_interacao,
            severidade: 'urgente'
          });
        }
      }
    });

    // 2. ⏳ Proposta Sem Resposta: Negociações em "Proposta Enviada" sem atualização há mais de 5 dias úteis (usamos >= 5 dias)
    leads.forEach(lead => {
      if (lead.status_etapa === 'Proposta Enviada') {
        const lastInteraction = new Date(lead.ultima_interacao).getTime();
        const diffDays = (now - lastInteraction) / (1000 * 60 * 60 * 24);
        if (diffDays >= 5) {
          alertas.push({
            id: `sla-proposta-${lead.id}`,
            tipo: 'proposta_sem_resposta',
            titulo: 'Proposta Sem Resposta (SLA Expirado)',
            descricao: `Proposta de ${lead.nome_empresa} enviada há ${Math.floor(diffDays)} dias sem retorno. Necessário follow-up imediato.`,
            lead_id: lead.id,
            data_referencia: lead.ultima_interacao,
            severidade: 'atencao'
          });
        }
      }
    });

    // 3. 🚀 Início de Projeto: Projetos ganhos que iniciam nos próximos 3 dias
    projetos.forEach(proj => {
      if (proj.status === 'Kick-off' || proj.status === 'Em Andamento') {
        const startDate = new Date(proj.data_inicio).getTime();
        const diffDays = (startDate - now) / (1000 * 60 * 60 * 24);
        // Se a data de início está entre hoje e os próximos 3 dias
        if (diffDays >= -1 && diffDays <= 3) {
          alertas.push({
            id: `sla-projeto-${proj.id}`,
            tipo: 'inicio_projeto',
            titulo: 'Kick-off Técnico Iminente',
            descricao: `Projeto "${proj.nome_projeto}" (${proj.cliente}) inicia em ${Math.max(0, Math.ceil(diffDays))} dia(s). Tech Lead: ${proj.responsavel_tecnico}.`,
            projeto_id: proj.id,
            data_referencia: proj.data_inicio,
            severidade: 'info'
          });
        }
      }
    });

    return alertas;
  }, [leads, projetos]);

  // Transições de Pipeline com Validações Estritas
  const requestMoveLead = (leadId: string, newStatus: StatusEtapa) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead || lead.status_etapa === newStatus) return;

    // Regra 1: "Proposta Enviada" exige diagnostico_realizado === true
    if (newStatus === 'Proposta Enviada') {
      if (!lead.diagnostico_realizado) {
        setDiagnosticModalLead({ lead, targetStatus: newStatus });
        return;
      }
    }

    // Regra 2: "Perdido" exige motivo da perda e observações detalhadas
    if (newStatus === 'Perdido') {
      setLossModalLead({ lead, targetStatus: newStatus });
      return;
    }

    // Regra 3: "Fechado (Ganho)" abre modal automático de geração de Projeto / Onboarding
    if (newStatus === 'Fechado (Ganho)') {
      setWonModalLead({ lead, targetStatus: newStatus });
      return;
    }

    // Transição direta padrão
    executeMoveLead(leadId, newStatus);
  };

  const executeMoveLead = (leadId: string, newStatus: StatusEtapa, extraData?: Partial<Lead>) => {
    const timestamp = new Date().toISOString();
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          status_etapa: newStatus,
          ultima_interacao: timestamp,
          ...extraData
        };
      }
      return lead;
    }));

    showToast(
      'Etapa Atualizada',
      `O lead foi movido com sucesso para "${newStatus}".`,
      'success'
    );
  };

  const confirmDiagnosticAndMove = (leadId: string, resumoDiagnostico: string) => {
    executeMoveLead(leadId, 'Proposta Enviada', {
      diagnostico_realizado: true,
      resumo_diagnostico: resumoDiagnostico
    });
    // Registra na timeline
    addInteracao({
      lead_id: leadId,
      tipo: 'Ata de Reunião',
      conteudo: `[Diagnóstico Técnico Concluído] ${resumoDiagnostico}`,
      autor: 'Tech Lead / Consultoria'
    });
    setDiagnosticModalLead(null);
  };

  const confirmLossAndMove = (leadId: string, motivo: MotivoPerda, observacao: string) => {
    executeMoveLead(leadId, 'Perdido', {
      motivo_perda: motivo,
      observacao_perda: observacao,
      probabilidade: 0
    });
    // Registra na timeline
    addInteracao({
      lead_id: leadId,
      tipo: 'Feedback',
      conteudo: `[Oportunidade Perdida - ${motivo}] ${observacao}`,
      autor: 'Equipe Comercial'
    });
    setLossModalLead(null);
  };

  const confirmWonAndCreateProject = (
    leadId: string, 
    nomeProjeto: string, 
    responsavelTecnico: string, 
    dataInicio: string,
    checklistTextos: string[]
  ) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    // Atualiza o lead para Fechado (Ganho)
    executeMoveLead(leadId, 'Fechado (Ganho)', {
      probabilidade: 100
    });

    // Cria o projeto automaticamente
    const novoProjeto: Projeto = {
      id: `proj-${Date.now()}`,
      lead_id: lead.id,
      nome_projeto: nomeProjeto || `Implantação ${lead.categoria_servico[0]?.split(' ')[0] || 'Consultoria'} - ${lead.nome_empresa}`,
      cliente: lead.nome_empresa,
      responsavel_tecnico: responsavelTecnico || 'A Definir',
      valor: lead.valor_estimado,
      data_inicio: dataInicio || new Date().toISOString().split('T')[0],
      status: 'Kick-off',
      descricao_escopo: `Projeto originado da proposta fechada de ${lead.categoria_servico.join(', ')}. Contato: ${lead.nome_contato}.`,
      checklist_inicial: checklistTextos.map((texto, index) => ({
        id: `chk-${Date.now()}-${index}`,
        texto,
        concluido: false,
        responsavel: index === 0 ? responsavelTecnico : 'Time do Projeto'
      }))
    };

    setProjetos(prev => [novoProjeto, ...prev]);

    // Registra na timeline
    addInteracao({
      lead_id: leadId,
      tipo: 'Feedback',
      conteudo: `🎉 Contrato Fechado! Projeto de Onboarding gerado com sucesso sob liderança de ${responsavelTecnico}.`,
      autor: 'Diretoria Comercial'
    });

    showToast(
      'Negócio fechado',
      `O projeto "${novoProjeto.nome_projeto}" foi adicionado automaticamente ao Onboarding.`,
      'success'
    );

    setWonModalLead(null);
  };

  // CRUD Operations
  const createLead = (leadData: Omit<Lead, 'id' | 'data_criacao' | 'ultima_interacao'>): Lead => {
    const nowIso = new Date().toISOString();
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      data_criacao: nowIso,
      ultima_interacao: nowIso,
      probabilidade: leadData.probabilidade ?? 25
    };

    setLeads(prev => [newLead, ...prev]);
    
    // Adiciona primeira interação
    addInteracao({
      lead_id: newLead.id,
      tipo: 'E-mail/Mensagem',
      conteudo: `Lead cadastrado na plataforma via canal: ${newLead.origem}. Oportunidade estimada em ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newLead.valor_estimado)}.`,
      autor: 'Sistema Vortex'
    });

    showToast('Lead Cadastrado', `${newLead.nome_empresa} foi adicionada ao pipeline com sucesso.`, 'success');
    return newLead;
  };

  const updateLead = (leadId: string, data: Partial<Lead>) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        return {
          ...l,
          ...data,
          ultima_interacao: new Date().toISOString()
        };
      }
      return l;
    }));
    showToast('Lead Atualizado', 'As informações foram salvas.', 'info');
  };

  const deleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    if (selectedLead?.id === leadId) setSelectedLead(null);
    showToast('Lead Removido', 'O registro foi excluído do pipeline.', 'warning');
  };

  const addInteracao = (item: Omit<Interacao, 'id' | 'data_hora'>) => {
    const nova: Interacao = {
      ...item,
      id: `int-${Date.now()}`,
      data_hora: new Date().toISOString()
    };
    setInteracoes(prev => [nova, ...prev]);

    // Atualiza a ultima_interacao do lead correspondente
    setLeads(prev => prev.map(l => {
      if (l.id === item.lead_id) {
        return { ...l, ultima_interacao: nova.data_hora };
      }
      return l;
    }));
  };

  const toggleChecklistItem = (projetoId: string, itemId: string) => {
    setProjetos(prev => prev.map(proj => {
      if (proj.id === projetoId) {
        return {
          ...proj,
          checklist_inicial: proj.checklist_inicial.map(item => {
            if (item.id === itemId) {
              return { ...item, concluido: !item.concluido };
            }
            return item;
          })
        };
      }
      return proj;
    }));
  };

  const addChecklistItem = (projetoId: string, texto: string, responsavel?: string) => {
    if (!texto.trim()) return;
    const novoItem: ChecklistItem = {
      id: `chk-${Date.now()}`,
      texto: texto.trim(),
      concluido: false,
      responsavel: responsavel || 'A Definir'
    };
    setProjetos(prev => prev.map(proj => {
      if (proj.id === projetoId) {
        return {
          ...proj,
          checklist_inicial: [...proj.checklist_inicial, novoItem]
        };
      }
      return proj;
    }));
    showToast('Item Adicionado', 'Novo marco inserido no checklist do projeto.', 'info');
  };

  const updateProjeto = (projetoId: string, data: Partial<Projeto>) => {
    setProjetos(prev => prev.map(p => (p.id === projetoId ? { ...p, ...data } : p)));
    showToast('Projeto Atualizado', 'Os dados do projeto foram atualizados.', 'info');
  };

  return (
    <CrmContext.Provider
      value={{
        leads,
        projetos,
        interacoes,
        selectedLead,
        setSelectedLead,
        activeTab,
        setActiveTab,
        pipelineView,
        setPipelineView,
        searchTerm,
        setSearchTerm,
        filterServico,
        setFilterServico,
        filterSegmento,
        setFilterSegmento,
        filterOrigem,
        setFilterOrigem,
        alertasSLA,
        diagnosticModalLead,
        setDiagnosticModalLead,
        lossModalLead,
        setLossModalLead,
        wonModalLead,
        setWonModalLead,
        isNewLeadModalOpen,
        setIsNewLeadModalOpen,
        requestMoveLead,
        confirmDiagnosticAndMove,
        confirmLossAndMove,
        confirmWonAndCreateProject,
        createLead,
        updateLead,
        deleteLead,
        addInteracao,
        toggleChecklistItem,
        addChecklistItem,
        updateProjeto,
        toast,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </CrmContext.Provider>
  );
};

export const useCrm = () => {
  const context = useContext(CrmContext);
  if (!context) {
    throw new Error('useCrm deve ser utilizado dentro de um CrmProvider');
  }
  return context;
};
