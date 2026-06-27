import { Navbar } from '@/components/layout/Navbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { SpecialistStats } from '@/components/features/SpecialistStats';
import { FatigueMonitor } from '@/components/features/FatigueMonitor';
import { Card } from '@/components/ui/Card';

export default function SpecialistPage() {
  // Mock data for the current specialist
  const data = {
    name: "Marcus (Senior Dev)",
    load: 85,
    tasksCount: 4,
    recoveryWindow: "Friday, 2:00 PM"
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full">
        <PageHeader
          title={`Welcome back, ${data.name}`}
          subtitle="Your personal utilization and health monitor."
        />

        <div className="flex flex-col gap-gap">
          <SpecialistStats
            specialistName={data.name}
            load={data.load}
            tasksCount={data.tasksCount}
            recoveryWindow={data.recoveryWindow}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gap">
            <div className="md:col-span-2">
              <FatigueMonitor load={data.load} />
            </div>
            <Card>
              <h3 className="text-sm font-bold uppercase text-slate-400 mb-3">Quick Actions</h3>
              <div className="flex flex-col gap-2">
                <button className="text-left text-sm text-slate-600 hover:text-primary transition-colors">Request Time Off</button>
                <button className="text-left text-sm text-slate-600 hover:text-primary transition-colors">Report Blockage</button>
                <button className="text-left text-sm text-slate-600 hover:text-primary transition-colors">Update Availability</button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
