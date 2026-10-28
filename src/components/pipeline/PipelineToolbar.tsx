import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { 
  Kanban, 
  Table, 
  Filter, 
  X, 
  Layers, 
  DollarSign 
} from 'lucide-react';
import { CategoriaServico, OrigemLead, SegmentoAtuacao } from '../../types/crm';
import { formatCurrencyBRL } from '../../utils/formatters';

const SERVICOS: CategoriaServico[] = [
  'Engenharia/Integração de Dados (ETL, Supabase, n8n)',
  'Automação de Processos/IA',
  'Business Intelligence/Dashboards',
  'Consultoria/Suporte em TI'
];

const ORIGENS: OrigemLead[] = [
  'Busca Ativa',
  'Indicação B2B',
  'LinkedIn',
  'Abordagem Direta',
  'Site'
];

const SEGMENTOS: SegmentoAtuacao[] = [
  'Varejo',
  'FinTech',
  'Indústria',
  'Saúde',
  'Logística',
  'Agronegócio',
  'Serviços Financeiros'
];

export const PipelineToolbar: React.FC = () => {
  const { 
    pipelineView, 
    setPipelineView, 
    filterServico, 
    setFilterServico, 
    filterSegmento, 
    setFilterSegmento, 
    filterOrigem, 
    setFilterOrigem,
    leads 
  } = useCrm();

  const activeFiltersCount = (filterServico ? 1 : 0) + (filterSegmento ? 1 : 0) + (filterOrigem ? 1 : 0);

  const clearFilters = () => {
    setFilterServico('');
    setFilterSegmento('');
    setFilterOrigem('');
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      {/* Left: View Switcher & Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Kanban vs Tabela Switcher */}
        <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setPipelineView('kanban')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              pipelineView === 'kanban'
                ? 'bg-gradient-to-r from-[#4221FF] to-[#87A7FF] text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            Kanban
          </button>
          <button
            onClick={() => setPipelineView('tabela')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              pipelineView === 'tabela'
                ? 'bg-gradient-to-r from-[#4221FF] to-[#87A7FF] text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Tabela
          </button>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Categoria de Servico */}
          <select
            value={filterServico}
            onChange={(e) => setFilterServico(e.target.value)}
            className="px-2.5 py-1.5 bg-[#0b1b2d] border border-[#18314b] hover:border-[#294867] rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#87A7FF]"
          >
            <option value="">Todas as Especialidades</option>
            {SERVICOS.map(s => (
              <option key={s} value={s}>{s.split('(')[0].trim()}</option>
            ))}
          </select>

          {/* Segmento */}
          <select
            value={filterSegmento}
            onChange={(e) => setFilterSegmento(e.target.value)}
            className="px-2.5 py-1.5 bg-[#0b1b2d] border border-[#18314b] hover:border-[#294867] rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#87A7FF]"
          >
            <option value="">Todos os Segmentos</option>
            {SEGMENTOS.map(seg => (
              <option key={seg} value={seg}>{seg}</option>
            ))}
          </select>

          {/* Origem */}
          <select
            value={filterOrigem}
            onChange={(e) => setFilterOrigem(e.target.value)}
            className="hidden sm:block px-2.5 py-1.5 bg-[#0b1b2d] border border-[#18314b] hover:border-[#294867] rounded-lg text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#87A7FF]"
          >
            <option value="">Todas as Origens</option>
            {ORIGENS.map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>

          {/* Limpar filtros */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-rose-400 rounded-md hover:bg-slate-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Limpar ({activeFiltersCount})
            </button>
          )}
        </div>
      </div>

      {/* Right: Summary pill */}
      <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400 font-mono">
        <span>Oportunidades: <strong className="text-slate-200">{leads.length}</strong></span>
        <span>•</span>
        <span>Total: <strong className="text-[#A3BCFF]">{formatCurrencyBRL(leads.reduce((acc, l) => acc + l.valor_estimado, 0))}</strong></span>
      </div>
    </div>
  );
};
