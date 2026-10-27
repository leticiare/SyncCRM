import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { Stethoscope, AlertTriangle, X, CheckCircle } from 'lucide-react';
import { formatCurrencyBRL } from '../../utils/formatters';

export const DiagnosticModal: React.FC = () => {
  const { diagnosticModalLead, setDiagnosticModalLead, confirmDiagnosticAndMove } = useCrm();
  const [resumo, setResumo] = useState('');
  const [error, setError] = useState('');

  if (!diagnosticModalLead) return null;
  const { lead } = diagnosticModalLead;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumo.trim()) {
      setError('Por favor, informe um resumo técnico do diagnóstico antes de enviar a proposta.');
      return;
    }
    confirmDiagnosticAndMove(lead.id, resumo.trim());
    setResumo('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">Validação de Diagnóstico Obrigatório</h3>
              <p className="text-xs text-slate-400">Transição para "Proposta Enviada"</p>
            </div>
          </div>
          <button
            onClick={() => setDiagnosticModalLead(null)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex gap-3 text-amber-300 text-xs leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Política Comercial de Consultoria:</strong> Nenhuma proposta técnica pode ser formalizada sem o registro prévio do diagnóstico das dores de arquitetura, stack tecnológica e volumetria do cliente.
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Empresa / Oportunidade</label>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm font-medium text-slate-200 flex justify-between items-center">
              <span>{lead.nome_empresa}</span>
              <span className="text-xs font-mono text-indigo-400">{formatCurrencyBRL(lead.valor_estimado)}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              Resumo Técnico do Diagnóstico <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={4}
              value={resumo}
              onChange={(e) => {
                setResumo(e.target.value);
                if (error) setError('');
              }}
              placeholder="Descreva a dor técnica, infraestrutura atual (ex: bancos de dados, ERPs, APIs), volumetria e objetivos levantados na reunião com o cliente..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none"
            />
            {error && <p className="text-xs text-rose-400">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setDiagnosticModalLead(null)}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700/80 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-md shadow-indigo-600/20"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Validar e Enviar Proposta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
