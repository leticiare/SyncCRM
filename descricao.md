Crie um protótipo funcional completo de um CRM B2B voltado para consultoria de tecnologia e dados, com visual corporativo moderno (estilo Linear/Raycast ou modern enterprise SaaS), fugindo do padrão genérico de dashboards comuns.

### 1. Identidade Visual e UI/UX
- **Estilo:** Minimalismo corporativo de alta densidade de informação. Bordas sutis (`border-slate-200` / `dark:border-slate-800`), tipografia limpa (Inter ou Geist), cantos suavemente arredondados (`rounded-lg`).
- **Paleta de Cores:** Fundo neutro sofisticado (Slate/Zinc com toques de azul corporativo sóbrio ou índigo profundo para ações primárias). Status com tags semafóricas discretas (verde esmeralda, âmbar, vermelho carmim, azul ardósia).
- **Layout:** Barra lateral fixa (Sidebar com ícones e labels compactos), barra de busca global superior e área principal de trabalho com alternância rápida entre abas.

---

### 2. Modelo de Dados e Entidades Principais
Crie mock data estruturado e tipado com TypeScript para:
1. **Lead / Contato & Empresa:**
   - `id`, `nome_contato`, `cargo`, `nome_empresa`, `cnpj`, `email`, `telefone_whatsapp`
   - `origem`: Busca Ativa, Indicação B2B, LinkedIn, Abordagem Direta, Site
   - `segmento_atuacao`: Varejo, FinTech, Indústria, Saúde, Logística, etc.
   - `categoria_servico`:
     * Engenharia/Integração de Dados (ETL, Supabase, n8n)
     * Automação de Processos/IA
     * Business Intelligence/Dashboards
     * Consultoria/Suporte em TI
   - `status_etapa`: 
     1. Lead Qualificado
     2. Reunião de Diagnóstico
     3. Proposta Enviada
     4. Negociação / Contrato
     5. Fechado (Ganho) / Perdido
   - `valor_estimado`, `data_criacao`, `ultima_interacao`

2. **Projetos / Onboarding (Handover pós-venda):**
   - `id`, `lead_id`, `nome_projeto`, `cliente`, `responsavel_tecnico`, `valor`, `data_inicio`, `checklist_inicial` (array de itens concluídos/pendentes).

3. **Histórico / Timeline de Interações:**
   - `id`, `lead_id`, `tipo` (Ata de Reunião, E-mail/Mensagem, Link do Drive/SharePoint, Arquivo/Proposta, Feedback), `conteudo`, `autor`, `data_hora`.

---

### 3. Telas e Funcionalidades Obrigatórias

#### A. Pipeline Comercial (Visão Kanban e Lista)
- Alternância entre visão Kanban (colunas com drag-and-drop visual) e visão Tabela com ordenação/filtros por serviço, origem e valor.
- Cada card no Kanban deve mostrar: Nome da Empresa, Contato principal, Tag do Serviço com cor específica, Valor e badge de alerta de inatividade se aplicável.
- **Validação de Transição:**
  - O card só pode ser arrastado/movido para **"Proposta Enviada"** se o campo `diagnostico_realizado` estiver marcado como `true` (ou abrir modal pedindo confirmação/resumo do diagnóstico).
  - Ao arrastar ou selecionar **"Perdido"**, abrir modal obrigatório exigindo:
    * Motivo da perda (Dropdown: Preço/Orçamento, Prazo de Entrega, Concorrente, Escopo Fora de Perfil, Prioridade Mudou no Cliente).
    * Campo de observação textual detalhada.
  - Ao arrastar para **"Fechado (Ganho)"**, disparar toast de comemoração e abrir modal automático gerando o registro em **"Projetos / Onboarding"** (herdando escopo, valor e cliente, solicitando o Responsável Técnico e gerando checklist de kick-off).

#### B. Detalhes do Lead (Drawer lateral ou Página Dedicada)
- Resumo com badges informativas (CNPJ, Segmento, Categoria de Serviço).
- Timeline de atividades interativa permitindo:
  - Adicionar resumo de ata de reunião.
  - Inserir links externos (Google Drive, SharePoint).
  - Simular upload/anexo de arquivos PDF de proposta.
- Ações rápidas: Iniciar conversa no WhatsApp (link `wa.me`), enviar e-mail e alterar fase do funil.

#### C. Módulo de Projetos / Onboarding (Pós-Venda)
- Lista/cards dos projetos ganhos.
- Checklist de kick-off interativo (ex: [ ] Reunião de alinhamento com dev, [ ] Acesso aos ambientes concedido, [ ] Validação de escopo técnico).
- Atribuição de responsável técnico.

#### D. Central de Alertas e Notificações (SLA / Follow-up)
Implementar badges visuais de advertência e um menu de notificações no topo:
1. ⚠️ **Lead Parado:** Leads em "Lead Qualificado" sem interação há mais de 48 horas.
2. ⏳ **Proposta Sem Resposta:** Negociações em "Proposta Enviada" sem atualização há mais de 5 dias úteis.
3. 🚀 **Início de Projeto:** Projetos ganhos que iniciam nos próximos 3 dias.

#### E. Cadastro Rápido de Oportunidades
- Botão destacado "+ Novo Lead" abrindo formulário em modal ou drawer, com validações nos campos indispensáveis levantados na entrevista.

---

### 4. Requisitos de Código e Bibliotecas
- Use **Lucide React** para iconografia limpa.
- Use componentes acessíveis baseados em Radix UI / shadcn/ui (Dialog, DropdownMenu, Tabs, Toast, Badge, Card, Avatar).
- Popule a aplicação com dados falsos realistas (empresas de médio/grande porte, escopos de ETL/n8n, valores reais em BRL `R$`).