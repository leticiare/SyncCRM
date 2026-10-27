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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-indigo-400" />
            Handover & Onboarding de Projetos
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {projetos.length} projetos ativos
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestão técnica pós-venda, checklists de inicialização e alocação de Tech Leads especializados.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span>Total em Implantação:</span>
          <span className="text-sm font-bold text-emerald-400">
            {formatCurrencyBRL(projetos.reduce((acc, p) => acc + p.valor, 0))}
          </span>
        </div>
      </div>

      {/* Grid de Projetos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {projetos.map((proj) => {
          const totalItems = proj.checklist_inicial.length;
          const completedItems = proj.checklist_inicial.filter(i => i.concluido).length;
          const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

          // Verificar proximidade da data de início
          const startDate = new Date(proj.data_inicio).getTime();
          const now = new Date().getTime();
          const diffDays = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
          const isStartingSoon = diffDays >= 0 && diffDays <= 3;

          return (
            <div
              key={proj.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all space-y-4"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-950/50 text-indigo-300 border border-indigo-800/60">
                      {proj.status}
                    </span>
                    {isStartingSoon && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
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
                  <span className="text-sm font-mono font-bold text-emerald-400 block">
                    {formatCurrencyBRL(proj.valor)}
                  </span>
                </div>
              </div>

              {/* Scope Description */}
              {proj.descricao_escopo && (
                <p className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                  {proj.descricao_escopo}
                </p>
              )}

              {/* Responsável Técnico & Data de Inicio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs">
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
                      className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-xs text-slate-200"
                    >
                      {TECH_LEADS.map(tl => (
                        <option key={tl} value={tl}>{tl}</option>
                      ))}
                    </select>
                  ) : (
                    <div
                      onClick={() => setEditingTechLead(proj.id)}
                      className="text-slate-200 hover:text-indigo-300 font-medium cursor-pointer flex items-center justify-between"
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

              {/* Checklist de Kick-off & Progresso */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
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
                      progressPct === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
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
                          ? 'bg-emerald-950/20 border-emerald-900/40 text-slate-400 line-through'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {item.concluido ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
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
                    className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAdd(proj.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors flex items-center gap-1 font-medium"
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
