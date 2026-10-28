import React from 'react';
import { Lead } from '../../types/crm';
import { useCrm } from '../../context/CrmContext';
import { formatCurrencyBRL } from '../../utils/formatters';
import { ServiceBadge, SlaWarningBadge } from '../ui/Badges';
import { 
  Building2, 
  User, 
  Stethoscope, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MoreVertical,
  ExternalLink 
} from 'lucide-react';

interface KanbanCardProps {
  lead: Lead;
}

export const KanbanCard: React.FC<KanbanCardProps> = ({ lead }) => {
  const { setSelectedLead, requestMoveLead } = useCrm();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', lead.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  // Verificação de alertas de SLA no Card
  const now = new Date().getTime();
  const diffHours = (now - new Date(lead.ultima_interacao).getTime()) / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  const isIdleLead = lead.status_etapa === 'Lead Qualificado' && diffHours >= 48;
  const isIdleProposal = lead.status_etapa === 'Proposta Enviada' && diffDays >= 5;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => setSelectedLead(lead)}
      className="group relative bg-[#0b1b2d] hover:bg-[#10243a] border border-[#18314b] hover:border-[#294867] rounded-lg p-3.5 shadow-sm transition-all duration-150 cursor-grab active:cursor-grabbing select-none"
    >
      {/* Top row: Company Name & Priority / Warning */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-semibold text-white group-hover:text-[#87A7FF] transition-colors truncate">
            {lead.nome_empresa}
          </h4>
          <p className="text-[11px] text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
            <User className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="truncate">{lead.nome_contato}</span>
          </p>
        </div>

        {/* Priority indicator or SLA Badge */}
        {lead.prioridade === 'Crítica' && (
          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-pulse" title="Prioridade Crítica" />
        )}
      </div>

      {/* Service Badge */}
      <div className="mb-3">
        <ServiceBadge categoria={lead.categoria_servico} compact />
      </div>

      {/* SLA Alert Badges if triggered */}
      {isIdleLead && (
        <div className="mb-2.5">
          <SlaWarningBadge type="idle" text={`Parado há ${Math.floor(diffHours)}h`} />
        </div>
      )}

      {isIdleProposal && (
        <div className="mb-2.5">
          <SlaWarningBadge type="proposal_idle" text={`Sem retorno há ${Math.floor(diffDays)}d`} />
        </div>
      )}

      {/* Diagnostic pill if stage is relevant */}
      {lead.diagnostico_realizado && (
        <div className="mb-2 flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
          <CheckCircle2 className="w-3 h-3" />
          <span>Diagnóstico Realizado</span>
        </div>
      )}

      {/* Bottom Row: Value & Origin */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="font-mono font-bold text-slate-200 group-hover:text-[#87A7FF] transition-colors">
          {formatCurrencyBRL(lead.valor_estimado)}
        </span>
        
        <span className="text-[10px] text-slate-500 font-medium">
          {lead.origem}
        </span>
      </div>
    </div>
  );
};
