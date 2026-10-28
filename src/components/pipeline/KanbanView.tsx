import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { StatusEtapa, Lead } from '../../types/crm';
import { KanbanCard } from './KanbanCard';
import { formatCurrencyBRL } from '../../utils/formatters';
import { 
  Plus, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Stethoscope, 
  Layers 
} from 'lucide-react';

const COLUNAS_KANBAN: { id: StatusEtapa; title: string; color: string; border: string; icon: React.ReactNode }[] = [
  {
    id: 'Lead Qualificado',
    title: 'Lead Qualificado',
    color: 'text-slate-300',
    border: 'border-slate-800',
    icon: <Layers className="w-3.5 h-3.5 text-slate-400" />
  },
  {
    id: 'Reunião de Diagnóstico',
    title: 'Reunião Diagnóstico',
    color: 'text-[#87A7FF]',
    border: 'border-[#18314b]',
    icon: <Stethoscope className="w-3.5 h-3.5 text-[#87A7FF]" />
  },
  {
    id: 'Proposta Enviada',
    title: 'Proposta Enviada',
    color: 'text-[#A3BCFF]',
    border: 'border-[#18314b]',
    icon: <FileText className="w-3.5 h-3.5 text-[#A3BCFF]" />
  },
  {
    id: 'Negociação / Contrato',
    title: 'Negociação / Contrato',
    color: 'text-[#87A7FF]',
    border: 'border-[#18314b]',
    icon: <HelpCircle className="w-3.5 h-3.5 text-[#87A7FF]" />
  },
  {
    id: 'Fechado (Ganho)',
    title: 'Fechado (Ganho)',
    color: 'text-[#A3BCFF]',
    border: 'border-[#18314b]',
    icon: <CheckCircle className="w-3.5 h-3.5 text-[#A3BCFF]" />
  },
  {
    id: 'Perdido',
    title: 'Perdido',
    color: 'text-slate-400',
    border: 'border-[#18314b]',
    icon: <XCircle className="w-3.5 h-3.5 text-slate-400" />
  }
];

export const KanbanView: React.FC = () => {
  const { 
    leads, 
    requestMoveLead, 
    searchTerm, 
    filterServico, 
    filterSegmento, 
    filterOrigem,
    setIsNewLeadModalOpen 
  } = useCrm();

  const [dragOverColumn, setDragOverColumn] = useState<StatusEtapa | null>(null);

  // Filtragem dos leads
  const filteredLeads = leads.filter(lead => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const services = Array.isArray(lead.categoria_servico) ? lead.categoria_servico : [lead.categoria_servico];
      const matchText = [
        lead.nome_empresa,
        lead.nome_contato,
        lead.cnpj,
        lead.email,
        lead.telefone_whatsapp,
        lead.segmento_atuacao,
        lead.origem,
        ...services
      ].some(value => value.toLowerCase().includes(q));
      if (!matchText) return false;
    }
    const services = Array.isArray(lead.categoria_servico) ? lead.categoria_servico : [lead.categoria_servico];
    if (filterServico && !services.includes(filterServico)) return false;
    if (filterSegmento && lead.segmento_atuacao !== filterSegmento) return false;
    if (filterOrigem && lead.origem !== filterOrigem) return false;
    return true;
  });

  const handleDragOver = (e: React.DragEvent, colId: StatusEtapa) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== colId) {
      setDragOverColumn(colId);
    }
  };

  const handleDragLeave = (colId: StatusEtapa) => {
    if (dragOverColumn === colId) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStatus: StatusEtapa) => {
    e.preventDefault();
    setDragOverColumn(null);
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      requestMoveLead(leadId, targetStatus);
    }
  };

  return (
    <div className="flex-1 overflow-x-auto pb-4">
      <div className="flex gap-3 min-w-[1240px] h-[calc(100vh-190px)]">
        {COLUNAS_KANBAN.map((coluna) => {
          const colLeads = filteredLeads.filter(l => l.status_etapa === coluna.id);
          const colTotalValue = colLeads.reduce((acc, l) => acc + l.valor_estimado, 0);
          const isOver = dragOverColumn === coluna.id;

          return (
            <div
              key={coluna.id}
              onDragOver={(e) => handleDragOver(e, coluna.id)}
              onDragLeave={() => handleDragLeave(coluna.id)}
              onDrop={(e) => handleDrop(e, coluna.id)}
              className={`flex-1 min-w-[220px] max-w-[280px] bg-slate-950/60 rounded-xl border flex flex-col transition-all duration-150 ${
                isOver 
                  ? 'border-[#87A7FF] bg-[#002755]/40' 
                  : 'border-[#18314b]'
              }`}
            >
              {/* Header da Coluna */}
              <div className="p-3 border-b border-[#18314b] bg-[#0b1b2d] rounded-t-xl">
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {coluna.icon}
                    <h3 className={`text-xs font-bold truncate ${coluna.color}`}>
                      {coluna.title}
                    </h3>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold shrink-0">
                    {colLeads.length}
                  </span>
                </div>

                {/* Subheader: Total de Valor da Coluna */}
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Total</span>
                  <span className="font-semibold text-slate-300">
                    {formatCurrencyBRL(colTotalValue)}
                  </span>
                </div>
              </div>

              {/* Cards Container */}
              <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                {colLeads.map(lead => (
                  <KanbanCard key={lead.id} lead={lead} />
                ))}

                {colLeads.length === 0 && (
                  <div className="h-28 border border-dashed border-slate-800 rounded-lg flex items-center justify-center text-[11px] text-slate-400 text-center p-2">
                    Nenhum lead nesta etapa
                  </div>
                )}
              </div>

              {/* Add button inside first column */}
              {coluna.id === 'Lead Qualificado' && (
                <div className="p-2 border-t border-slate-850">
                  <button
                    onClick={() => setIsNewLeadModalOpen(true)}
                    className="w-full py-1.5 px-2 rounded-lg border border-dashed border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Novo Lead
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
