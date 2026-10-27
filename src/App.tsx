import React from 'react';
import { CrmProvider, useCrm } from './context/CrmContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { PipelineToolbar } from './components/pipeline/PipelineToolbar';
import { KanbanView } from './components/pipeline/KanbanView';
import { TableView } from './components/pipeline/TableView';
import { ProjectsView } from './components/projects/ProjectsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { LeadDrawer } from './components/lead/LeadDrawer';
import { DiagnosticModal } from './components/modals/DiagnosticModal';
import { LossModal } from './components/modals/LossModal';
import { WonModal } from './components/modals/WonModal';
import { NewLeadModal } from './components/modals/NewLeadModal';
import { Toast } from './components/ui/Toast';

const MainContent: React.FC = () => {
  const { activeTab, pipelineView } = useCrm();

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header />

        {/* Work Area with custom padding */}
        <main className="flex-1 p-4 sm:p-6 overflow-hidden flex flex-col min-w-0">
          {activeTab === 'pipeline' && (
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <PipelineToolbar />
              {pipelineView === 'kanban' ? <KanbanView /> : <TableView />}
            </div>
          )}

          {activeTab === 'projetos' && <ProjectsView />}

          {activeTab === 'analytics' && <AnalyticsView />}
        </main>
      </div>

      {/* Modals & Overlays */}
      <LeadDrawer />
      <DiagnosticModal />
      <LossModal />
      <WonModal />
      <NewLeadModal />
      <Toast />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CrmProvider>
      <MainContent />
    </CrmProvider>
  );
};

export default App;
