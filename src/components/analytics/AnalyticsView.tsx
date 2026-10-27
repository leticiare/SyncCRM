import React from 'react';
import { useCrm } from '../../context/CrmContext';
import { formatCurrencyBRL } from '../../utils/formatters';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Database,
  Bot,
  Terminal,
  PieChart
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { leads, projetos, alertasSLA } = useCrm();

  const totalLeads = leads.length;
  const wonLeads = leads.filter(l => l.status_etapa === 'Fechado (Ganho)');
  const lostLeads = leads.filter(l => l.status_etapa === 'Perdido');
  const activePipelineLeads = leads.filter(l => l.status_etapa !== 'Fechado (Ganho)' && l.status_etapa !== 'Perdido');

  const totalPipelineValue = activePipelineLeads.reduce((acc, l) => acc + l.valor_estimado, 0);
  const totalWonValue = wonLeads.reduce((acc, l) => acc + l.valor_estimado, 0);
  const totalLostValue = lostLeads.reduce((acc, l) => acc + l.valor_estimado, 0);

  const conversionRate = (wonLeads.length + lostLeads.length) > 0 
    ? Math.round((wonLeads.length / (wonLeads.length + lostLeads.length)) * 100) 
    : 0;

  // Breakdown por categoria de serviço
  const serviceCategories = [
    'Engenharia/Integração de Dados (ETL, Supabase, n8n)',
    'Automação de Processos/IA',
    'Business Intelligence/Dashboards',
    'Consultoria/Suporte em TI'
  ] as const;

  const serviceBreakdown = serviceCategories.map(cat => {
    const catLeads = leads.filter(l => l.categoria_servico === cat);
    const catValue = catLeads.reduce((acc, l) => acc + l.valor_estimado, 0);
    return {
      categoria: cat,
      count: catLeads.length,
      value: catValue,
      wonCount: catLeads.filter(l => l.status_etapa === 'Fechado (Ganho)').length
    };
  });

  // Motivos de perda
  const lossReasonsMap: Record<string, number> = {};
  lostLeads.forEach(l => {
    const reason = l.motivo_perda || 'Não informado';
    lossReasonsMap[reason] = (lossReasonsMap[reason] || 0) + 1;
  });

  return (
    <div className="space-y-6 flex-1 overflow-y-auto pr-1">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pipeline Ativo</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            {formatCurrencyBRL(totalPipelineValue)}
          </div>
          <div className="text-[11px] text-slate-500">
            {activePipelineLeads.length} oportunidades em andamento
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Receita Ganha (Fechado)</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {formatCurrencyBRL(totalWonValue)}
          </div>
          <div className="text-[11px] text-slate-500">
            {wonLeads.length} contratos assinados
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Taxa de Conversão Win/Loss</span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-purple-400">
            {conversionRate}%
          </div>
          <div className="text-[11px] text-slate-500">
            {wonLeads.length} ganhos vs {lostLeads.length} perdidos
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Incidentes de SLA</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {alertasSLA.length}
          </div>
          <div className="text-[11px] text-slate-500">
            Gargalos operacionais identificados
          </div>
        </div>
      </div>

      {/* Services breakdown and Loss reasons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Categoria de Consultoria */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-400" />
            Demanda por Categoria de Tecnologia
          </h3>

          <div className="space-y-3">
            {serviceBreakdown.map((item, idx) => {
              const maxVal = Math.max(...serviceBreakdown.map(s => s.value), 1);
              const barPct = Math.round((item.value / maxVal) * 100);

              return (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="truncate max-w-[280px] font-medium">{item.categoria}</span>
                    <span className="font-mono text-emerald-400">{formatCurrencyBRL(item.value)}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>{item.count} leads cadastrados</span>
                    <span>{item.wonCount} projetos ganhos</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivos de Perda no Funil */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <XCircle className="w-4 h-4 text-rose-400" />
            Análise de Perda Comercial (Win/Loss RCA)
          </h3>

          {Object.keys(lossReasonsMap).length > 0 ? (
            <div className="space-y-2.5">
              {Object.entries(lossReasonsMap).map(([reason, count], index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                >
                  <span className="font-medium text-slate-300">{reason}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-rose-400 font-bold">{count} {count === 1 ? 'perda' : 'perdas'}</span>
                    <span className="text-[10px] text-slate-500">
                      ({Math.round((count / lostLeads.length) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Nenhuma oportunidade perdida registrada até o momento.
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            💡 <strong>Insight Estratégico:</strong> O principal gargalo observado é a sensibilidade ao valor de setup inicial em consultorias de IA. Recomenda-se modular o escopo em PoC rápida de 3 semanas com ticket de entrada reduzido.
          </div>
        </div>
      </div>
    </div>
  );
};
