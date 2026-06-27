import { Navbar } from '@/components/layout/Navbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { AllocationInterface } from '@/components/features/AllocationInterface';

export default function AllocatePage() {
  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full">
        <PageHeader
          title="Task Allocation"
          subtitle="Map tasks to specialists while maintaining sustainable capacity."
        />
        <div className="mt-8">
          <AllocationInterface />
        </div>
      </main>
    </div>
  );
}
