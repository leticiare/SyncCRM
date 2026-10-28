import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { 
  OrigemLead, 
  SegmentoAtuacao, 
  CategoriaServico, 
  StatusEtapa 
} from '../../types/crm';
import { UserPlus, X, Sparkles, Building2, User, Phone, Mail, DollarSign } from 'lucide-react';

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

const CATEGORIAS_SERVICO: CategoriaServico[] = [
  'Engenharia/Integração de Dados (ETL, Supabase, n8n)',
  'Automação de Processos/IA',
  'Business Intelligence/Dashboards',
  'Consultoria/Suporte em TI'
];

export const NewLeadModal: React.FC = () => {
  const { isNewLeadModalOpen, setIsNewLeadModalOpen, createLead, setSelectedLead } = useCrm();

  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [nomeContato, setNomeContato] = useState('');
  const [cargo, setCargo] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [origem, setOrigem] = useState<OrigemLead>('LinkedIn');
  const [outraOrigem, setOutraOrigem] = useState('');
  const [segmento, setSegmento] = useState<SegmentoAtuacao>('FinTech');
  const [outroSegmento, setOutroSegmento] = useState('');
  const [categorias, setCategorias] = useState<CategoriaServico[]>(['Engenharia/Integração de Dados (ETL, Supabase, n8n)']);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [valor, setValor] = useState('85000');
  const [prioridade, setPrioridade] = useState<'Alta' | 'Média' | 'Baixa' | 'Crítica'>('Alta');
  const [statusEtapa, setStatusEtapa] = useState<StatusEtapa>('Lead Qualificado');
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isNewLeadModalOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nomeEmpresa.trim()) errs.nomeEmpresa = 'Nome da empresa é obrigatório';
    if (!nomeContato.trim()) errs.nomeContato = 'Nome do contato é obrigatório';
    if (!email.trim() || !email.includes('@')) errs.email = 'E-mail corporativo válido é obrigatório';
    if (!telefone.trim()) errs.telefone = 'WhatsApp é obrigatório';
    if (categorias.length === 0) errs.categorias = 'Selecione ao menos um serviço';
    if (segmento === '__custom__' && !outroSegmento.trim()) errs.segmento = 'Informe o segmento';
    if (origem === '__custom__' && !outraOrigem.trim()) errs.origem = 'Informe a origem';
    const numValor = parseFloat(valor.replace(/\D/g, ''));
    if (isNaN(numValor) || numValor <= 0) errs.valor = 'Informe um valor estimado válido';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const numValor = parseFloat(valor.replace(/\D/g, '')) || 50000;
    const cleanCnpj = cnpj.replace(/\D/g, '') || '00000000000100';

    const newLead = createLead({
      nome_empresa: nomeEmpresa.trim(),
      nome_contato: nomeContato.trim(),
      cargo: cargo.trim() || 'Tomador de Decisão',
      cnpj: cleanCnpj,
      email: email.trim(),
      telefone_whatsapp: telefone.trim(),
      origem: origem === '__custom__' ? outraOrigem.trim() : origem,
      segmento_atuacao: segmento === '__custom__' ? outroSegmento.trim() : segmento,
      categoria_servico: categorias,
      status_etapa: statusEtapa,
      valor_estimado: numValor,
      diagnostico_realizado: false,
      prioridade,
      probabilidade: 25
    });

    setIsNewLeadModalOpen(false);
    setSelectedLead(newLead);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                Cadastrar Nova Oportunidade
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  B2B Tech
                </span>
              </h3>
              <p className="text-xs text-slate-400">Insira os dados da empresa prospectada e categoria do projeto</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewLeadModalOpen(false)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Seção 1: Empresa & Segmento */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Nome da Empresa <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Stone Pagamentos S.A."
                value={nomeEmpresa}
                onChange={(e) => setNomeEmpresa(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {errors.nomeEmpresa && <p className="text-[11px] text-rose-400">{errors.nomeEmpresa}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">CNPJ (opcional)</label>
              <input
                type="text"
                placeholder="00.000.000/0001-00"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Seção 2: Contato & Cargo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Contato Principal <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Gabriela Vasconcelos"
                value={nomeContato}
                onChange={(e) => setNomeContato(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {errors.nomeContato && <p className="text-[11px] text-rose-400">{errors.nomeContato}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Cargo / Função</label>
              <input
                type="text"
                placeholder="Ex: Head de Engenharia de Dados"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Seção 3: E-mail e WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                E-mail Corporativo <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                placeholder="contato@empresa.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {errors.email && <p className="text-[11px] text-rose-400">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Telefone / WhatsApp <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="(11) 98765-4321"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
              {errors.telefone && <p className="text-[11px] text-rose-400">{errors.telefone}</p>}
            </div>
          </div>

          {/* Seção 4: Categoria do Serviço */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">
              Categoria de Serviço em Consultoria <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORIAS_SERVICO.map(cat => (
                <label key={cat} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:border-[#294867]">
                  <input
                    type="checkbox"
                    checked={categorias.includes(cat)}
                    onChange={() => setCategorias(prev => prev.includes(cat) ? prev.filter(item => item !== cat) : [...prev, cat])}
                    className="mt-0.5 accent-[#4221FF]"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={novaCategoria}
                onChange={(e) => setNovaCategoria(e.target.value)}
                placeholder="Adicionar outro serviço"
                className="flex-1 px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#87A7FF]"
              />
              <button
                type="button"
                onClick={() => {
                  const value = novaCategoria.trim();
                  if (value && !categorias.includes(value)) setCategorias(prev => [...prev, value]);
                  setNovaCategoria('');
                }}
                className="px-3 py-2 rounded-lg bg-[#10243a] border border-[#294867] text-[#A3BCFF] text-xs"
              >
                Adicionar
              </button>
            </div>
            {errors.categorias && <p className="text-[11px] text-rose-400">{errors.categorias}</p>}
          </div>

          {/* Seção 5: Segmento, Origem e Prioridade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Segmento</label>
              <select
                value={segmento}
                onChange={(e) => setSegmento(e.target.value as SegmentoAtuacao)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {SEGMENTOS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
                <option value="__custom__">Outro segmento...</option>
              </select>
              {segmento === '__custom__' && <input value={outroSegmento} onChange={(e) => setOutroSegmento(e.target.value)} placeholder="Informe o segmento" className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100" />}
              {errors.segmento && <p className="text-[11px] text-rose-400">{errors.segmento}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Origem do Lead</label>
              <select
                value={origem}
                onChange={(e) => setOrigem(e.target.value as OrigemLead)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {ORIGENS.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
                <option value="__custom__">Outra origem...</option>
              </select>
              {origem === '__custom__' && <input value={outraOrigem} onChange={(e) => setOutraOrigem(e.target.value)} placeholder="Informe a origem" className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100" />}
              {errors.origem && <p className="text-[11px] text-rose-400">{errors.origem}</p>}
            </div>

            <div className="space-y-1 flex flex-col">
              <label className="text-xs font-medium text-slate-300">Prioridade</label>
              <select
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value as any)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Crítica">Crítica</option>
              </select>
            </div>
          </div>

          {/* Seção 6: Valor Estimado & Etapa Inicial */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Valor Estimado (BRL R$) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="5000"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {errors.valor && <p className="text-[11px] text-rose-400">{errors.valor}</p>}
            </div>

            <div className="space-y-1 flex flex-col">
              <label className="text-xs font-medium text-slate-300">Etapa de Entrada</label>
              <select
                value={statusEtapa}
                onChange={(e) => setStatusEtapa(e.target.value as StatusEtapa)}
                className="w-full h-[34px] px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Lead Qualificado">1. Lead Qualificado</option>
                <option value="Reunião de Diagnóstico">2. Reunião de Diagnóstico</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsNewLeadModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all shadow-md shadow-indigo-600/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Criar Oportunidade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
