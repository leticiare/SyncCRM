import React, { useState, useRef, useEffect } from 'react';
import { useCrm } from '../../context/CrmContext';
import { 
  Search, 
  Bell, 
  Plus, 
  AlertTriangle, 
  Clock, 
  Rocket, 
  ChevronDown, 
  CheckCircle2, 
  Command, 
  SlidersHorizontal 
} from 'lucide-react';
import { formatCurrencyBRL } from '../../utils/formatters';

const READ_NOTIFICATIONS_STORAGE_KEY = 'synccrm_read_notifications_v1';

export const Header: React.FC = () => {
  const { 
    searchTerm, 
    setSearchTerm, 
    alertasSLA, 
    setIsNewLeadModalOpen, 
    setSelectedLead,
    setActiveTab,
    leads
  } = useCrm();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(READ_NOTIFICATIONS_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return new Set(Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []);
    } catch (error) {
      console.error('Falha ao carregar notificações lidas:', error);
      return new Set();
    }
  });
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadAlerts = alertasSLA.filter(alerta => !readNotificationIds.has(alerta.id));

  useEffect(() => {
    const activeIds = new Set(alertasSLA.map(alerta => alerta.id));
    setReadNotificationIds(prev => {
      const next = new Set([...prev].filter(id => activeIds.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [alertasSLA]);

  useEffect(() => {
    try {
      localStorage.setItem(
        READ_NOTIFICATIONS_STORAGE_KEY,
        JSON.stringify([...readNotificationIds])
      );
    } catch (error) {
      console.error('Falha ao salvar notificações lidas:', error);
    }
  }, [readNotificationIds]);

  // Fecha dropdown de notificação ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAlertClick = (alerta: typeof alertasSLA[0]) => {
    setReadNotificationIds(prev => {
      const next = new Set(prev);
      next.add(alerta.id);
      return next;
    });

    if (alerta.lead_id) {
      const targetLead = leads.find(l => l.id === alerta.lead_id);
      if (targetLead) {
        setSelectedLead(targetLead);
        setActiveTab('pipeline');
      }
    } else if (alerta.projeto_id) {
      setActiveTab('projetos');
    }
    setNotificationsOpen(false);
  };

  const searchQuery = searchTerm.trim().toLowerCase();
  const searchResults = searchQuery
    ? leads.filter(lead => {
        const services = Array.isArray(lead.categoria_servico)
          ? lead.categoria_servico
          : [lead.categoria_servico];
        return [
          lead.nome_empresa,
          lead.nome_contato,
          lead.cnpj,
          lead.email,
          lead.telefone_whatsapp,
          lead.segmento_atuacao,
          lead.origem,
          ...services
        ].some(value => value.toLowerCase().includes(searchQuery));
      }).slice(0, 8)
    : [];

  const handleSearchResultClick = (lead: typeof leads[number]) => {
    setSelectedLead(lead);
    setActiveTab('pipeline');
    setSearchTerm('');
  };

  return (
    <header className="h-14 border-b border-[#18314b] bg-[#071321] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Global Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <button
            type="button"
            aria-label="Pesquisar leads"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#87A7FF] transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar empresa, contato, CNPJ ou serviço..."
            className="w-full bg-[#0b1b2d] border border-[#18314b] hover:border-[#294867] focus:border-[#87A7FF] rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#0b1b2d] border border-[#294867] rounded-lg shadow-xl overflow-hidden z-50">
              {searchResults.length > 0 ? (
                <div className="p-1">
                  {searchResults.map(lead => (
                    <button
                      key={lead.id}
                      type="button"
                      onClick={() => handleSearchResultClick(lead)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-[#18314b] transition-colors"
                    >
                      <span className="block text-xs font-semibold text-slate-100 truncate">
                        {lead.nome_empresa}
                      </span>
                      <span className="block text-[11px] text-slate-400 truncate">
                        {lead.nome_contato} · {lead.status_etapa}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="px-3 py-3 text-xs text-slate-400">
                  Nenhum lead encontrado.
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Central de Alertas e Notificações (SLA) */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`p-2 rounded-lg border transition-all relative ${
              unreadAlerts.length > 0 
                ? 'bg-slate-900 border-amber-500/30 text-amber-300 hover:bg-slate-850' 
                : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {/* Dropdown Menu de Notificações SLA */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-150">
              <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-100">Central de Alertas & SLAs</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {unreadAlerts.length} não lidas
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 p-1">
                {alertasSLA.map((alerta) => {
                  const getIcon = () => {
                    switch (alerta.tipo) {
                      case 'lead_parado':
                        return <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />;
                      case 'proposta_sem_resposta':
                        return <Clock className="w-4 h-4 text-amber-400 shrink-0" />;
                      case 'inicio_projeto':
                        return <Rocket className="w-4 h-4 text-indigo-400 shrink-0" />;
                    }
                  };

                  return (
                    <div
                      key={alerta.id}
                      onClick={() => handleAlertClick(alerta)}
                      className="p-3 rounded-lg hover:bg-slate-850 cursor-pointer transition-colors flex items-start gap-2.5 text-xs group"
                    >
                      <div className="mt-0.5">{getIcon()}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                          {alerta.titulo}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          {alerta.descricao}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {alertasSLA.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-400 space-y-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
                    <p className="font-semibold text-slate-300">Tudo em dia!</p>
                    <p className="text-[11px] text-slate-400">Nenhum gargalo de SLA ou lead parado no momento.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Primary Action Button "+ Novo Lead" */}
        <button
          onClick={() => setIsNewLeadModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#4221FF] to-[#87A7FF] hover:brightness-110 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Lead</span>
        </button>

      </div>
    </header>
  );
};
