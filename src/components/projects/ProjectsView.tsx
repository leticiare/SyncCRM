import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Projeto, ChecklistItem } from '../../types/crm';
import { 
  formatCurrencyBRL, 
  formatDateBR 
} from '../../utils/formatters';
import { 
  Rocket, 
  CheckSquare, 
  Square, 
  Plus, 
  Calendar, 
  User, 
  Building2, 
  Clock, 
  AlertCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

const TECH_LEADS = [
  'Thiago Rocha (Tech Lead de Engenharia de Dados)',
  'Beatriz Mendes (AI & Automation Specialist)',
  'Lucas Alencar (Senior Data Architect & Lakehouse)',
  'Renata Vasconcelos (Senior Analytics & BI Lead)',
  'Guilherme Silveira (Cloud & Infrastructure Lead)'
];

const PROJECT_STEPS: Projeto['status'][] = [
  'Kick-off',
  'Em Andamento',
  'Em Homologação',
  'Concluído'
];

export const ProjectsView: React.FC = () => {
  const { 
    projetos, 
    toggleChecklistItem, 
    addChecklistItem, 
    updateProjeto,
    setSelectedLead,
    leads 
  } = useCrm();

  const [novoItemTexto, setNovoItemTexto] = useState<Record<string, string>>({});
  const [editingTechLead, setEditingTechLead] = useState<string | null>(null);

  const handleToggle = (projetoId: string, itemId: string) => {
    toggleChecklistItem(projetoId, itemId);
  };

  const handleAdd = (projetoId: string) => {
    const text = novoItemTexto[projetoId];
    if (text && text.trim()) {
      addChecklistItem(projetoId, text.trim());
      setNovoItemTexto(prev => ({ ...prev, [projetoId]: '' }));
    }
  };

  return (
    <div className="space-y-6 flex-1 overflow-y-auto pr-1">
      {/* Header do Módulo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#0b1b2d] border border-[#18314b]">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#87A7FF]" />
            Handover & Onboarding de Projetos
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#002755] text-[#A3BCFF] border border-[#294867]">
              {projetos.length} projetos ativos
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestão técnica pós-venda, checklists de inicialização e alocação de Tech Leads especializados.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span>Total em Implantação:</span>
          <span className="text-sm font-bold text-[#A3BCFF]">
            {formatCurrencyBRL(projetos.reduce((acc, p) => acc + p.valor, 0))}
          </span>
        </div>
      </div>

      {/* Grid de Projetos */}
      {projetos.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-64 rounded-lg border border-dashed border-[#294867] bg-[#0b1b2d] text-center px-6">
          <Rocket className="w-7 h-7 text-[#87A7FF] mb-3" />
          <h3 className="text-sm font-semibold text-slate-200">Nenhum projeto em onboarding</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Os projetos aparecem aqui quando uma oportunidade é marcada como Fechado (Ganho).
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projetos.map((proj) => {
          const totalItems = proj.checklist_inicial.length;
          const completedItems = proj.checklist_inicial.filter(i => i.concluido).length;
          const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
          const currentStep = PROJECT_STEPS.indexOf(proj.status);
          const stagePct = Math.round(((currentStep + 1) / PROJECT_STEPS.length) * 100);

          // Verificar proximidade da data de início
          const startDate = new Date(proj.data_inicio).getTime();
          const now = new Date().getTime();
          const diffDays = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
          const isStartingSoon = diffDays >= 0 && diffDays <= 3;

          return (
            <div
              key={proj.id}
              className="bg-[#0b1b2d] border border-[#18314b] rounded-lg p-4 hover:border-[#294867] transition-colors space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#002755] text-[#A3BCFF] border border-[#294867]">
                      {proj.status}
                    </span>
                    {isStartingSoon && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#A3BCFF] bg-[#10243a] px-2 py-0.5 rounded border border-[#294867]">
                        <Clock className="w-3 h-3" /> Inicia em {diffDays === 0 ? 'Hoje' : `${diffDays}d`}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 mt-2 truncate">
                    {proj.nome_projeto}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    {proj.cliente}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">Contrato</span>
                  <span className="text-sm font-mono font-bold text-[#A3BCFF] block">
                    {formatCurrencyBRL(proj.valor)}
                  </span>
                </div>
              </div>

              {/* Scope Description */}
              {proj.descricao_escopo && (
                <p className="text-xs text-slate-400 bg-[#071321] p-3 rounded-lg border border-[#18314b] leading-relaxed">
                  {proj.descricao_escopo}
                </p>
              )}

              {/* Responsável Técnico & Data de Inicio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-lg bg-[#071321] border border-[#18314b] text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Responsável Técnico
                  </span>
                  {editingTechLead === proj.id ? (
                    <select
                      value={proj.responsavel_tecnico}
                      onChange={(e) => {
                        updateProjeto(proj.id, { responsavel_tecnico: e.target.value });
                        setEditingTechLead(null);
                      }}
                      onBlur={() => setEditingTechLead(null)}
                      autoFocus
                      className="w-full bg-[#0b1b2d] border border-[#294867] rounded p-1 text-xs text-slate-200"
                    >
                      {TECH_LEADS.map(tl => (
                        <option key={tl} value={tl}>{tl}</option>
                      ))}
                    </select>
                  ) : (
                    <div
                      onClick={() => setEditingTechLead(proj.id)}
                      className="text-slate-200 hover:text-[#87A7FF] font-medium cursor-pointer flex items-center justify-between"
                      title="Clique para alterar"
                    >
                      <span className="truncate">{proj.responsavel_tecnico}</span>
                      <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Previsão de Início
                  </span>
                  <div className="text-slate-200 font-mono flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    {formatDateBR(proj.data_inicio)}
                  </div>
                </div>
              </div>

              {/* Etapas do onboarding */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  <span>Etapas do onboarding</span>
                  <span className="text-[#A3BCFF]">{currentStep + 1}/{PROJECT_STEPS.length}</span>
                </div>
                <div className="h-1 bg-[#18314b] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#4221FF] to-[#87A7FF] transition-all" style={{ width: `${stagePct}%` }} />
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {PROJECT_STEPS.map((step, index) => (
                    <div key={step} className={`text-[10px] leading-tight ${index <= currentStep ? 'text-[#A3BCFF]' : 'text-slate-500'}`}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${index <= currentStep ? 'bg-[#87A7FF]' : 'bg-[#294867]'}`} />
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Checklist de Kick-off & Progresso */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-[#87A7FF]" />
                    Checklist de Kick-off
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    {completedItems}/{totalItems} ({progressPct}%)
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      progressPct === 100 ? 'bg-[#87A7FF]' : 'bg-[#4221FF]'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {/* Checklist Items list */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 pt-1">
                  {proj.checklist_inicial.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggle(proj.id, item.id)}
                      className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                        item.concluido
                          ? 'bg-[#10243a] border-[#294867] text-slate-400 line-through'
                          : 'bg-[#071321] border-[#18314b] text-slate-200 hover:border-[#294867]'
                      }`}
                    >
                      {item.concluido ? (
                        <CheckSquare className="w-4 h-4 text-[#87A7FF] shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="leading-snug block">{item.texto}</span>
                        {item.responsavel && (
                          <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                            Resp: {item.responsavel}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new checklist task */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Adicionar tarefa ao kick-off..."
                    value={novoItemTexto[proj.id] || ''}
                    onChange={(e) => setNovoItemTexto(prev => ({ ...prev, [proj.id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAdd(proj.id);
                      }
                    }}
                    className="flex-1 px-3 py-1.5 bg-[#071321] border border-[#18314b] rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#87A7FF]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAdd(proj.id)}
                    className="px-3 py-1.5 bg-[#10243a] hover:bg-[#18314b] text-slate-200 text-xs rounded-lg transition-colors flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
