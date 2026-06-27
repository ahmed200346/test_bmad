import { Navbar } from '@/components/layout/Navbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { TaskManagement } from '@/components/features/TaskManagement';

export default function TasksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-6 py-12 w-full">
        <PageHeader
          title="Task Directory"
          subtitle="Define project effort and duration windows."
        />
        <TaskManagement />
      </main>
    </div>
  );
}
