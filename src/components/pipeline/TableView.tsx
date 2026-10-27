import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { StatusEtapa, Lead } from '../../types/crm';
import { 
  formatCurrencyBRL, 
  formatCNPJ, 
  formatPhone, 
  cleanPhoneForWhatsApp, 
  formatRelativeTime 
} from '../../utils/formatters';
import { ServiceBadge, StageBadge, SegmentBadge } from '../ui/Badges';
import { 
  ArrowUpDown, 
  MessageSquare, 
  ExternalLink, 
  User, 
  Building2, 
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';

const ETAPAS: StatusEtapa[] = [
  'Lead Qualificado',
  'Reunião de Diagnóstico',
  'Proposta Enviada',
  'Negociação / Contrato',
  'Fechado (Ganho)',
  'Perdido'
];

type SortField = 'empresa' | 'valor' | 'data' | 'etapa';

export const TableView: React.FC = () => {
  const { 
    leads, 
    setSelectedLead, 
    requestMoveLead,
    searchTerm, 
    filterServico, 
    filterSegmento, 
    filterOrigem 
  } = useCrm();

  const [sortField, setSortField] = useState<SortField>('data');
  const [sortAsc, setSortAsc] = useState(false);

  // Filtragem
  const filteredLeads = leads.filter(lead => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = (
        lead.nome_empresa.toLowerCase().includes(q) ||
        lead.nome_contato.toLowerCase().includes(q) ||
        lead.cnpj.includes(q) ||
        lead.categoria_servico.toLowerCase().includes(q)
      );
      if (!match) return false;
    }
    if (filterServico && lead.categoria_servico !== filterServico) return false;
    if (filterSegmento && lead.segmento_atuacao !== filterSegmento) return false;
    if (filterOrigem && lead.origem !== filterOrigem) return false;
    return true;
  });

  // Ordenação
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'empresa') {
      comparison = a.nome_empresa.localeCompare(b.nome_empresa);
    } else if (sortField === 'valor') {
      comparison = a.valor_estimado - b.valor_estimado;
    } else if (sortField === 'etapa') {
      comparison = a.status_etapa.localeCompare(b.status_etapa);
    } else {
      comparison = new Date(a.ultima_interacao).getTime() - new Date(b.ultima_interacao).getTime();
    }
    return sortAsc ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col flex-1">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-200 transition-colors"
                onClick={() => handleSort('empresa')}
              >
                <div className="flex items-center gap-1.5">
                  Empresa / Contato
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">CNPJ</th>
              <th className="py-3 px-4">Categoria de Serviço</th>
              <th className="py-3 px-4">Segmento</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-200 transition-colors"
                onClick={() => handleSort('etapa')}
              >
                <div className="flex items-center gap-1.5">
                  Fase do Pipeline
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-200 transition-colors"
                onClick={() => handleSort('valor')}
              >
                <div className="flex items-center gap-1.5">
                  Valor Estimado
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:text-slate-200 transition-colors"
                onClick={() => handleSort('data')}
              >
                <div className="flex items-center gap-1.5">
                  Último Contato
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sortedLeads.map((lead) => {
              const whatsappPhone = cleanPhoneForWhatsApp(lead.telefone_whatsapp);
              const whatsappUrl = `https://wa.me/${whatsappPhone}`;

              return (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  {/* Empresa & Contato */}
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {lead.nome_empresa}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <User className="w-3 h-3 text-slate-500" />
                      {lead.nome_contato} • <span className="text-slate-400">{lead.cargo}</span>
                    </div>
                  </td>

                  {/* CNPJ */}
                  <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                    {formatCNPJ(lead.cnpj)}
                  </td>

                  {/* Categoria */}
                  <td className="py-3.5 px-4">
                    <ServiceBadge categoria={lead.categoria_servico} compact />
                  </td>

                  {/* Segmento */}
                  <td className="py-3.5 px-4">
                    <SegmentBadge segmento={lead.segmento_atuacao} />
                  </td>

                  {/* Fase com alterador inline rápido */}
                  <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={lead.status_etapa}
                      onChange={(e) => requestMoveLead(lead.id, e.target.value as StatusEtapa)}
                      className="text-xs bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      {ETAPAS.map(etapa => (
                        <option key={etapa} value={etapa}>{etapa}</option>
                      ))}
                    </select>
                  </td>

                  {/* Valor Estimado */}
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-200">
                    {formatCurrencyBRL(lead.valor_estimado)}
                  </td>

                  {/* Último Contato */}
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {formatRelativeTime(lead.ultima_interacao)}
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Conversar no WhatsApp"
                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        title="Ver Detalhes"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-700 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {sortedLeads.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                  Nenhum registro encontrado com os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer com contagem e total */}
      <div className="px-4 py-3 bg-slate-950/70 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>Mostrando <strong>{sortedLeads.length}</strong> de {leads.length} oportunidades</span>
        <span className="font-mono">
          Total Filtrado: <strong className="text-emerald-400">{formatCurrencyBRL(sortedLeads.reduce((acc, l) => acc + l.valor_estimado, 0))}</strong>
        </span>
      </div>
    </div>
  );
};
