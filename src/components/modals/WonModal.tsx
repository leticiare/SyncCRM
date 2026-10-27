import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Trophy, Rocket, X, Plus, Trash2, CheckSquare } from 'lucide-react';
import { formatCurrencyBRL } from '../../utils/formatters';

const DEFAULT_CHECKLIST = [
  'Reunião de alinhamento e kick-off com sponsor e time de dev',
  'Acesso aos ambientes concedido (Cloud, bancos de dados, APIs, repositórios)',
  'Validação de escopo técnico, volumetria e baseline de entrega',
  'Setup de ambiente de desenvolvimento/staging (n8n/Supabase/Cloud)',
  'Homologação de blueprint de arquitetura de dados e governança'
];

const TECH_LEADS = [
  'Thiago Rocha (Tech Lead de Engenharia de Dados)',
  'Beatriz Mendes (AI & Automation Specialist)',
  'Lucas Alencar (Senior Data Architect & Lakehouse)',
  'Renata Vasconcelos (Senior Analytics & BI Lead)',
  'Guilherme Silveira (Cloud & Infrastructure Lead)'
];

export const WonModal: React.FC = () => {
  const { wonModalLead, setWonModalLead, confirmWonAndCreateProject } = useCrm();

  const [nomeProjeto, setNomeProjeto] = useState('');
  const [responsavelTecnico, setResponsavelTecnico] = useState(TECH_LEADS[0]);
  const [dataInicio, setDataInicio] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [checklist, setChecklist] = useState<string[]>(DEFAULT_CHECKLIST);
  const [novoItem, setNovoItem] = useState('');

  if (!wonModalLead) return null;
  const { lead } = wonModalLead;

  const defaultNome = `Implantação ${lead.categoria_servico.split('/')[0]} - ${lead.nome_empresa}`;
  const currentNome = nomeProjeto || defaultNome;

  const handleAddChecklistItem = () => {
    if (!novoItem.trim()) return;
    setChecklist(prev => [...prev, novoItem.trim()]);
    setNovoItem('');
  };

  const handleRemoveChecklistItem = (index: number) => {
    setChecklist(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confirmWonAndCreateProject(
      lead.id,
      currentNome,
      responsavelTecnico,
      dataInicio,
      checklist
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header with celebration theme */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Trophy className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Handover Pós-Venda: Criar Projeto
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Fechado (Ganho)
                </span>
              </h3>
              <p className="text-xs text-slate-400">Transfira o escopo comercial para o time de entrega técnica</p>
            </div>
          </div>
          <button
            onClick={() => setWonModalLead(null)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Deal Summary Box */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Cliente</span>
              <span className="font-semibold text-slate-200 text-sm">{lead.nome_empresa}</span>
              <span className="text-slate-400 block mt-0.5">{lead.nome_contato} ({lead.cargo})</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block">Valor Fechado</span>
              <span className="font-mono font-bold text-emerald-400 text-base">{formatCurrencyBRL(lead.valor_estimado)}</span>
              <span className="text-slate-400 block mt-0.5 text-[11px]">{lead.categoria_servico}</span>
            </div>
          </div>

          {/* Nome do Projeto */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              Nome do Projeto de Onboarding
            </label>
            <input
              type="text"
              value={nomeProjeto}
              placeholder={defaultNome}
              onChange={(e) => setNomeProjeto(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Tech Lead & Data de Inicio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Responsável Técnico (Tech Lead) <span className="text-emerald-400">*</span>
              </label>
              <select
                value={responsavelTecnico}
                onChange={(e) => setResponsavelTecnico(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {TECH_LEADS.map(tl => (
                  <option key={tl} value={tl}>{tl}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">
                Data Prevista de Início <span className="text-emerald-400">*</span>
              </label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Checklist de Kick-off Inicial */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                Checklist de Kick-off Técnico ({checklist.length} itens)
              </label>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {checklist.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300 group"
                >
                  <span className="flex-1 truncate">{index + 1}. {item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveChecklistItem(index)}
                    className="text-slate-500 hover:text-rose-400 p-1 opacity-60 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Inserir item no checklist */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Adicionar tarefa ao kick-off..."
                value={novoItem}
                onChange={(e) => setNovoItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklistItem();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddChecklistItem}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Adicionar
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setWonModalLead(null)}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all shadow-lg shadow-emerald-600/25"
            >
              <Rocket className="w-4 h-4" />
              Celebrar e Criar Onboarding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
