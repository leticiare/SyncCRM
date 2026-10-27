import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { 
  Kanban, 
  Rocket, 
  BarChart3, 
  Terminal, 
  Database, 
  ShieldCheck, 
  Layers, 
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { formatCurrencyBRL } from '../../utils/formatters';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    leads, 
    projetos, 
    alertasSLA 
  } = useCrm();

  const activeLeadsCount = leads.filter(l => l.status_etapa !== 'Fechado (Ganho)' && l.status_etapa !== 'Perdido').length;
  const pipelineTotal = leads
    .filter(l => l.status_etapa !== 'Fechado (Ganho)' && l.status_etapa !== 'Perdido')
    .reduce((acc, l) => acc + l.valor_estimado, 0);

  interface NavItem {
    id: 'pipeline' | 'projetos' | 'analytics';
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }

  const navItems: NavItem[] = [
    {
      id: 'pipeline',
      label: 'Pipeline Comercial',
      icon: <Kanban className="w-4 h-4" />,
      badge: activeLeadsCount,
      badgeColor: 'bg-indigo-500/20 text-indigo-300'
    },
    {
      id: 'projetos',
      label: 'Projetos / Onboarding',
      icon: <Rocket className="w-4 h-4" />,
      badge: projetos.length,
      badgeColor: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      id: 'analytics',
      label: 'Métricas & Inteligência',
      icon: <BarChart3 className="w-4 h-4" />
    }
  ];

  return (
    <aside className="w-60 bg-slate-950 border-r border-slate-850 flex flex-col h-screen shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center gap-2.5 border-b border-slate-850">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-600/25">
          <Cpu className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="text-xs font-bold tracking-tight text-slate-100 block">NEXUS CRM</span>
          <span className="text-[10px] text-slate-400 font-mono block -mt-0.5">Tech & Data Advisory</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Operação
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-slate-900 text-indigo-300 border border-slate-800 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-indigo-400' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Informative Sub-section */}
        <div className="pt-6 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Especialidades Técnicas
        </div>
        <div className="space-y-0.5 text-[11px] text-slate-400 px-3">
          <div className="flex items-center gap-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>ETL & n8n / Supabase</span>
          </div>
          <div className="flex items-center gap-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>Agentes de IA & LLMs</span>
          </div>
          <div className="flex items-center gap-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>BI & Lakehouses</span>
          </div>
          <div className="flex items-center gap-2 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Cloud & DevOps TI</span>
          </div>
        </div>
      </nav>

      {/* Bottom KPI Widget */}
      <div className="p-3 border-t border-slate-850 bg-slate-950/70">
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Pipeline Aberto</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-sm font-mono font-bold text-slate-100">
            {formatCurrencyBRL(pipelineTotal)}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span>SLA Health</span>
            <span className={`font-semibold ${alertasSLA.length === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {alertasSLA.length === 0 ? '100% OK' : `${alertasSLA.length} alertas`}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
