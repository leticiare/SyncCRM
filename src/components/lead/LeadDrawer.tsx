import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { 
  X, 
  MessageSquare, 
  Mail, 
  Calendar, 
  Paperclip, 
  FileText, 
  Link as LinkIcon, 
  CheckCircle2, 
  Clock, 
  Send, 
  Building2, 
  User, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Stethoscope
} from 'lucide-react';
import { 
  formatCurrencyBRL, 
  formatCNPJ, 
  cleanPhoneForWhatsApp, 
  formatPhone, 
  formatRelativeTime, 
  formatDateTimeBR 
} from '../../utils/formatters';
import { ServiceBadge, StageBadge, SegmentBadge } from '../ui/Badges';
import { StatusEtapa, TipoInteracao } from '../../types/crm';

const ETAPAS: StatusEtapa[] = [
  'Lead Qualificado',
  'Reunião de Diagnóstico',
  'Proposta Enviada',
  'Negociação / Contrato',
  'Fechado (Ganho)',
  'Perdido'
];

export const LeadDrawer: React.FC = () => {
  const { 
    selectedLead, 
    setSelectedLead, 
    interacoes, 
    addInteracao, 
    requestMoveLead,
    showToast 
  } = useCrm();

  const [activeFormTab, setActiveFormTab] = useState<TipoInteracao>('Ata de Reunião');
  const [timelineContent, setTimelineContent] = useState('');
  const [anexoNome, setAnexoNome] = useState('');
  const [anexoUrl, setAnexoUrl] = useState('');
  const [autor, setAutor] = useState('Consultor Técnico');

  if (!selectedLead) return null;

  // Filtrar interações do lead selecionado
  const leadInteracoes = interacoes.filter(i => i.lead_id === selectedLead.id);

  // SLA: verificar inatividade
  const now = new Date().getTime();
  const diffHours = (now - new Date(selectedLead.ultima_interacao).getTime()) / (1000 * 60 * 60);
  const isIdle48h = selectedLead.status_etapa === 'Lead Qualificado' && diffHours >= 48;
  const isProposalIdle5d = selectedLead.status_etapa === 'Proposta Enviada' && diffHours >= (5 * 24);

  // Link do WhatsApp com mensagem pronta personalizada de consultoria
  const whatsappPhone = cleanPhoneForWhatsApp(selectedLead.telefone_whatsapp);
  const whatsappText = encodeURIComponent(
    `Olá ${selectedLead.nome_contato}, tudo bem? Sou da consultoria de tecnologia e dados. Gostaria de dar seguimento ao nosso diagnóstico técnico para a ${selectedLead.nome_empresa} sobre ${selectedLead.categoria_servico.split('(')[0].trim()}.`
  );
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappText}`;

  // Link de e-mail
  const emailSubject = encodeURIComponent(`Consultoria de Tecnologia & Dados - ${selectedLead.nome_empresa}`);
  const emailMailto = `mailto:${selectedLead.email}?subject=${emailSubject}`;

  const handleAddTimelineEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timelineContent.trim()) {
      showToast('Conteúdo Vazio', 'Escreva uma anotação ou ata antes de registrar.', 'warning');
      return;
    }

    addInteracao({
      lead_id: selectedLead.id,
      tipo: activeFormTab,
      conteudo: timelineContent.trim(),
      autor: autor.trim() || 'Consultor Técnico',
      anexo_nome: anexoNome.trim() || undefined,
      anexo_url: anexoUrl.trim() || undefined
    });

    setTimelineContent('');
    setAnexoNome('');
    setAnexoUrl('');
    showToast('Atividade Registrada', 'O registro foi adicionado à timeline com sucesso.', 'success');
  };

  const handleSimulateFileUpload = () => {
    // Simula upload rápido de proposta PDF
    setAnexoNome(`Proposta_Tecnica_${selectedLead.nome_empresa.replace(/\s+/g, '_')}_v1.pdf`);
    setAnexoUrl(`https://storage.consulting-cloud.com/propostas/${selectedLead.id}/proposta.pdf`);
    if (!timelineContent) {
      setTimelineContent('Anexo da minuta de proposta técnica e comercial formalizada com escopo de arquitetura.');
    }
    showToast('Arquivo Vinculado', 'Minuta de PDF anexada à proposta.', 'info');
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#071321] border-l border-[#18314b] w-full max-w-2xl h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Top Header Bar */}
        <div className="p-5 border-b border-[#18314b] bg-[#0b1b2d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4221FF] to-[#87A7FF] flex items-center justify-center text-white font-bold text-base">
              {selectedLead.nome_empresa.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100">{selectedLead.nome_empresa}</h2>
                <SegmentBadge segmento={selectedLead.segmento_atuacao} />
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                {selectedLead.nome_contato} • <span className="text-slate-300">{selectedLead.cargo}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedLead(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#18314b] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar (WhatsApp, Email, Stage Switcher) */}
        <div className="px-5 py-3 bg-[#071321] border-b border-[#18314b] flex flex-wrap items-center justify-between gap-3">
          {/* Quick Contact Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#002755] text-[#A3BCFF] border border-[#294867] hover:bg-[#18314b] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              WhatsApp ({formatPhone(selectedLead.telefone_whatsapp)})
            </a>

            <a
              href={emailMailto}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0b1b2d] hover:bg-[#18314b] text-slate-200 border border-[#294867] transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              E-mail
            </a>
          </div>

          {/* Stage Dropdown Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Fase:</span>
            <select
              value={selectedLead.status_etapa}
              onChange={(e) => requestMoveLead(selectedLead.id, e.target.value as StatusEtapa)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#0b1b2d] border border-[#294867] text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#87A7FF]"
            >
              {ETAPAS.map(etapa => (
                <option key={etapa} value={etapa}>{etapa}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Warning Banners if SLA is breached */}
        {(isIdle48h || isProposalIdle5d) && (
          <div className="mx-5 mt-3 p-3 rounded-lg bg-[#10243a] border border-[#294867] flex items-center gap-2.5 text-xs text-[#C1D0FF]">
            <AlertCircle className="w-4 h-4 text-[#87A7FF] shrink-0" />
            <div>
              {isIdle48h && (
                <span>⚠️ <strong>Atenção de SLA:</strong> Oportunidade qualificada sem contato há mais de 48h. Acione o WhatsApp do decisor.</span>
              )}
              {isProposalIdle5d && (
                <span>⏳ <strong>Atenção de SLA:</strong> Proposta comercial enviada há mais de 5 dias sem retorno. Agende um follow-up executivo.</span>
              )}
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-lg bg-[#0b1b2d] border border-[#18314b]">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block">Valor Estimado</span>
              <span className="text-sm font-mono font-bold text-[#A3BCFF] mt-1 block">
                {formatCurrencyBRL(selectedLead.valor_estimado)}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#0b1b2d] border border-[#18314b]">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block">CNPJ</span>
              <span className="text-xs font-mono text-slate-200 mt-1 block truncate">
                {formatCNPJ(selectedLead.cnpj)}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#0b1b2d] border border-[#18314b]">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block">Origem</span>
              <span className="text-xs font-medium text-slate-200 mt-1 block">
                {selectedLead.origem}
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#0b1b2d] border border-[#18314b]">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 block">Última Ação</span>
              <span className="text-xs text-[#87A7FF] mt-1 block">
                {formatRelativeTime(selectedLead.ultima_interacao)}
              </span>
            </div>
          </div>

          {/* Service Category & Technical Status */}
          <div className="p-4 rounded-lg bg-[#0b1b2d] border border-[#18314b] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Escopo de Atuação</span>
              <ServiceBadge categoria={selectedLead.categoria_servico} />
            </div>

            {/* Diagnóstico Banner */}
            <div className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
              selectedLead.diagnostico_realizado 
                ? 'bg-[#002755] border-[#294867] text-[#C1D0FF]' 
                : 'bg-[#10243a] border-[#294867] text-[#C1D0FF]'
            }`}>
              <Stethoscope className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold flex items-center justify-between">
                  <span>Diagnóstico Técnico</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-mono uppercase">
                    {selectedLead.diagnostico_realizado ? 'Concluído' : 'Pendente'}
                  </span>
                </div>
                <p className="mt-1 text-slate-300 leading-relaxed text-[11px]">
                  {selectedLead.resumo_diagnostico || 'Diagnóstico preliminar ainda não documentado. Obrigatório antes do envio formal da proposta técnica.'}
                </p>
              </div>
            </div>

            {/* Motivo de perda se aplicável */}
            {selectedLead.status_etapa === 'Perdido' && selectedLead.motivo_perda && (
              <div className="p-3 rounded-lg bg-[#10243a] border border-[#294867] text-xs text-slate-200">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-[#87A7FF]" />
                  Perda: {selectedLead.motivo_perda}
                </div>
                <p className="mt-1 text-slate-300 text-[11px]">
                  {selectedLead.observacao_perda}
                </p>
              </div>
            )}
          </div>

          {/* Timeline Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#87A7FF]" />
                Histórico & Timeline de Interações ({leadInteracoes.length})
              </h3>
            </div>

            {/* Interactive Form to add activities */}
            <div className="rounded-lg bg-[#0b1b2d] border border-[#18314b] p-4 space-y-3">
              {/* Type Switcher Tabs */}
              <div className="flex flex-wrap gap-1 p-1 bg-[#071321] rounded-lg border border-[#18314b]">
                {(['Ata de Reunião', 'E-mail/Mensagem', 'Link do Drive/SharePoint', 'Arquivo/Proposta', 'Feedback'] as TipoInteracao[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveFormTab(tab)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                      activeFormTab === tab
                        ? 'bg-gradient-to-r from-[#4221FF] to-[#87A7FF] text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Form Input */}
              <form onSubmit={handleAddTimelineEntry} className="space-y-3">
                <textarea
                  rows={3}
                  value={timelineContent}
                  onChange={(e) => setTimelineContent(e.target.value)}
                  placeholder={
                    activeFormTab === 'Ata de Reunião' 
                      ? 'Descreva a pauta, participantes e pontos técnicos acordados...' 
                      : activeFormTab === 'Link do Drive/SharePoint'
                      ? 'Descreva o repositório ou pasta de documentação...'
                      : 'Registre a comunicação ou atualização com o cliente...'
                  }
                  className="w-full px-3 py-2 bg-[#071321] border border-[#18314b] rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#87A7FF] resize-none"
                />

                {/* Extra fields based on tab */}
                {activeFormTab === 'Link do Drive/SharePoint' && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Título do Link (ex: Blueprint SharePoint)"
                      value={anexoNome}
                      onChange={(e) => setAnexoNome(e.target.value)}
                      className="px-2.5 py-1.5 bg-[#071321] border border-[#18314b] rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#87A7FF]"
                    />
                    <input
                      type="url"
                      placeholder="https://sharepoint.com/..."
                      value={anexoUrl}
                      onChange={(e) => setAnexoUrl(e.target.value)}
                      className="px-2.5 py-1.5 bg-[#071321] border border-[#18314b] rounded-lg text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#87A7FF] font-mono"
                    />
                  </div>
                )}

                {activeFormTab === 'Arquivo/Proposta' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSimulateFileUpload}
                      className="px-3 py-1.5 rounded-lg text-xs bg-[#10243a] hover:bg-[#18314b] text-[#A3BCFF] border border-[#294867] flex items-center gap-1.5 transition-colors"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      {anexoNome ? 'PDF Anexado com Sucesso' : 'Simular Anexo de Proposta (PDF)'}
                    </button>
                    {anexoNome && (
                      <span className="text-[11px] font-mono text-slate-300 truncate max-w-[200px]">
                        {anexoNome}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <input
                    type="text"
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                    placeholder="Autor do registro"
                    className="px-2.5 py-1 bg-[#071321] border border-[#18314b] rounded-md text-[11px] text-slate-300 focus:outline-none max-w-[180px]"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-[#4221FF] to-[#87A7FF] text-white text-xs font-semibold rounded-lg transition-all"
                  >
                    <Send className="w-3 h-3" />
                    Registrar
                  </button>
                </div>
              </form>
            </div>

            {/* Timeline Stream */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#18314b]">
              {leadInteracoes.map((item) => {
                const getIcon = () => {
                  switch (item.tipo) {
                    case 'Ata de Reunião': return <Calendar className="w-3.5 h-3.5 text-blue-400" />;
                    case 'Arquivo/Proposta': return <FileText className="w-3.5 h-3.5 text-[#A3BCFF]" />;
                    case 'Link do Drive/SharePoint': return <LinkIcon className="w-3.5 h-3.5 text-[#87A7FF]" />;
                    case 'Feedback': return <CheckCircle2 className="w-3.5 h-3.5 text-[#A3BCFF]" />;
                    default: return <MessageSquare className="w-3.5 h-3.5 text-slate-400" />;
                  }
                };

                return (
                  <div key={item.id} className="relative group">
                    <div className="absolute -left-[27px] top-1 w-5 h-5 rounded-full bg-[#0b1b2d] border border-[#294867] flex items-center justify-center">
                      {getIcon()}
                    </div>
                    <div className="p-3.5 rounded-lg bg-[#0b1b2d] border border-[#18314b] space-y-1.5 hover:border-[#294867] transition-colors">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                          {item.tipo}
                          <span className="font-normal text-slate-400">• {item.autor}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {formatRelativeTime(item.data_hora)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                        {item.conteudo}
                      </p>

                      {/* Attachments & Links if present */}
                      {(item.anexo_nome || item.anexo_url) && (
                        <div className="pt-2">
                          <a
                            href={item.anexo_url || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#071321] border border-[#18314b] hover:border-[#87A7FF] text-[11px] font-mono text-[#A3BCFF] hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-3 h-3 text-[#87A7FF]" />
                            {item.anexo_nome || item.anexo_url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
