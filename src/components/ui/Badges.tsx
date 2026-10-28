import React from 'react';
import { CategoriaServico, StatusEtapa, SegmentoAtuacao } from '../../types/crm';
import { 
  Database, 
  Bot, 
  BarChart3, 
  Terminal, 
  AlertCircle, 
  Clock, 
  Rocket 
} from 'lucide-react';

export const ServiceBadge: React.FC<{ categoria: CategoriaServico; compact?: boolean }> = ({ categoria, compact }) => {
  switch (categoria) {
    case 'Engenharia/Integração de Dados (ETL, Supabase, n8n)':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#002755]/60 text-[#A3BCFF] border border-[#294867]">
          <Database className="w-3 h-3 text-[#87A7FF]" />
          {compact ? 'ETL / Dados' : 'Engenharia & ETL'}
        </span>
      );
    case 'Automação de Processos/IA':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#002755]/60 text-[#A3BCFF] border border-[#294867]">
          <Bot className="w-3 h-3 text-[#87A7FF]" />
          {compact ? 'IA / Agentes' : 'Automação & IA'}
        </span>
      );
    case 'Business Intelligence/Dashboards':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#002755]/60 text-[#A3BCFF] border border-[#294867]">
          <BarChart3 className="w-3 h-3 text-[#87A7FF]" />
          {compact ? 'BI / Analytics' : 'BI & Dashboards'}
        </span>
      );
    case 'Consultoria/Suporte em TI':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#002755]/60 text-[#A3BCFF] border border-[#294867]">
          <Terminal className="w-3 h-3 text-[#87A7FF]" />
          {compact ? 'Cloud / TI' : 'Consultoria TI'}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
          {categoria}
        </span>
      );
  }
};

export const StageBadge: React.FC<{ status: StatusEtapa }> = ({ status }) => {
  const configs: Record<StatusEtapa, { bg: string; text: string; dot: string }> = {
    'Lead Qualificado': {
      bg: 'bg-slate-800/80 border-slate-700',
      text: 'text-slate-300',
      dot: 'bg-slate-400'
    },
    'Reunião de Diagnóstico': {
      bg: 'bg-blue-950/60 border-blue-800/60',
      text: 'text-blue-300',
      dot: 'bg-blue-400'
    },
    'Proposta Enviada': {
      bg: 'bg-amber-950/60 border-amber-800/60',
      text: 'text-amber-300',
      dot: 'bg-amber-400'
    },
    'Negociação / Contrato': {
      bg: 'bg-indigo-950/60 border-indigo-800/60',
      text: 'text-indigo-300',
      dot: 'bg-indigo-400'
    },
    'Fechado (Ganho)': {
      bg: 'bg-emerald-950/60 border-emerald-800/60',
      text: 'text-emerald-300',
      dot: 'bg-emerald-400'
    },
    'Perdido': {
      bg: 'bg-rose-950/60 border-rose-800/60',
      text: 'text-rose-300',
      dot: 'bg-rose-400'
    }
  };

  const c = configs[status] || configs['Lead Qualificado'];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  );
};

export const SegmentBadge: React.FC<{ segmento: SegmentoAtuacao }> = ({ segmento }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-400 border border-slate-800">
      {segmento}
    </span>
  );
};

export const SlaWarningBadge: React.FC<{ type: 'idle' | 'proposal_idle'; text: string }> = ({ type, text }) => {
  if (type === 'idle') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />
        {text}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
      <Clock className="w-3 h-3 text-amber-400 shrink-0" />
      {text}
    </span>
  );
};
