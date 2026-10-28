import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { MotivoPerda } from '../../types/crm';
import { AlertOctagon, X, ThumbsDown } from 'lucide-react';
import { formatCurrencyBRL } from '../../utils/formatters';

const MOTIVOS_PERDA: MotivoPerda[] = [
  'Preço/Orçamento',
  'Prazo de Entrega',
  'Concorrente',
  'Escopo Fora de Perfil',
  'Prioridade Mudou no Cliente'
];

export const LossModal: React.FC = () => {
  const { lossModalLead, setLossModalLead, confirmLossAndMove } = useCrm();
  const [motivo, setMotivo] = useState<MotivoPerda>('Preço/Orçamento');
  const [observacao, setObservacao] = useState('');
  const [error, setError] = useState('');

  if (!lossModalLead) return null;
  const { lead } = lossModalLead;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observacao.trim()) {
      setError('A observação detalhada sobre o motivo da perda é obrigatória para análise de pós-venda.');
      return;
    }
    confirmLossAndMove(lead.id, motivo, observacao.trim());
    setObservacao('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Declaração de Oportunidade Perdida</h3>
              <p className="text-xs text-slate-400">Classificação de perda para retroalimentação do funil</p>
            </div>
          </div>
          <button
            onClick={() => setLossModalLead(null)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center text-sm">
            <div>
              <div className="font-semibold text-slate-200">{lead.nome_empresa}</div>
              <div className="text-xs text-slate-400">{lead.nome_contato} • {lead.categoria_servico.join(', ')}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Valor em risco</div>
              <div className="text-sm font-mono font-semibold text-rose-400">{formatCurrencyBRL(lead.valor_estimado)}</div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              Motivo Principal da Perda <span className="text-rose-400">*</span>
            </label>
            <select
              value={motivo}
              onChange={(e) => setMotivo(e.target.value as MotivoPerda)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all"
            >
              {MOTIVOS_PERDA.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              Observação Textual Detalhada <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              value={observacao}
              onChange={(e) => {
                setObservacao(e.target.value);
                if (error) setError('');
              }}
              placeholder="Descreva o feedback do cliente, pontos de atrito (ex: qual concorrente ganhou, qual faixa de valor foi oferecida, cortes orçamentários)..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 transition-all resize-none"
            />
            {error && <p className="text-xs text-rose-400">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setLossModalLead(null)}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-all shadow-md shadow-rose-600/20"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              Confirmar como Perdido
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
