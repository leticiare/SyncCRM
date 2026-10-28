import React from "react";
import { useCrm } from "../../context/CrmContext";
import { Kanban, Rocket, BarChart3, TrendingUp, Cpu } from "lucide-react";
import { formatCurrencyBRL } from "../../utils/formatters";

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, leads, projetos, alertasSLA } = useCrm();

  const activeLeadsCount = leads.filter(
    (l) => l.status_etapa !== "Fechado (Ganho)" && l.status_etapa !== "Perdido",
  ).length;
  const pipelineTotal = leads
    .filter(
      (l) =>
        l.status_etapa !== "Fechado (Ganho)" && l.status_etapa !== "Perdido",
    )
    .reduce((acc, l) => acc + l.valor_estimado, 0);

  interface NavItem {
    id: "pipeline" | "projetos" | "analytics";
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }

  const navItems: NavItem[] = [
    {
      id: "pipeline",
      label: "Pipeline Comercial",
      icon: <Kanban className="w-4 h-4" />,
      badge: activeLeadsCount,
      badgeColor: "bg-[#4221FF]/20 text-[#A3BCFF]",
    },
    {
      id: "projetos",
      label: "Projetos / Onboarding",
      icon: <Rocket className="w-4 h-4" />,
      badge: projetos.length,
      badgeColor: "bg-[#87A7FF]/15 text-[#C1D0FF]",
    },
    {
      id: "analytics",
      label: "Métricas & Inteligência",
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-60 bg-[#071321] border-r border-[#18314b] flex flex-col h-screen shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center gap-2.5 border-b border-slate-850">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4221FF] to-[#87A7FF] flex items-center justify-center text-white">
          <Cpu className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <span className="text-xs font-bold tracking-tight text-slate-100 block">
            Sync CRM
          </span>
          <span className="text-[10px] text-slate-400 font-mono block -mt-0.5">
            CRM
          </span>
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
                  ? "bg-[#0b1b2d] text-[#A3BCFF] border border-[#294867]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={isActive ? "text-[#87A7FF]" : "text-slate-500"}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom KPI Widget */}
      <div className="p-3 border-t border-[#18314b] bg-[#071321]">
        <div className="p-3 rounded-lg bg-[#0b1b2d] border border-[#18314b] space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Pipeline Aberto</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-sm font-mono font-bold text-slate-100">
            {formatCurrencyBRL(pipelineTotal)}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span>SLA Health</span>
            <span
              className={`font-semibold ${alertasSLA.length === 0 ? "text-emerald-400" : "text-amber-400"}`}
            >
              {alertasSLA.length === 0
                ? "100% OK"
                : `${alertasSLA.length} alertas`}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
