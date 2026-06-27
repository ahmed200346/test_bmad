import { Navbar } from '@/components/layout/Navbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { ResourceHeatmap } from '@/components/features/ResourceHeatmap';
import { RiskPanel } from '@/components/features/RiskPanel';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 w-full">
        <PageHeader
          title="Resource Dashboard"
          subtitle="Real-time utilization and risk overview"
        >
          <div className="flex gap-3">
            <Button variant="outline">Export Report</Button>
            <Button>Add Resource</Button>
          </div>
        </PageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gap">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest">Capacity Heatmap</h3>
              <span className="text-xs text-slate-400">Window: Current Week</span>
            </div>
            <ResourceHeatmap />
          </div>
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest">Active Risks</h3>
            </div>
            <RiskPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
