import { Navbar } from '@/components/layout/Navbar';
import { PageHeader } from '@/components/layout/PageHeader';
import { SpecialistManagement } from '@/components/features/SpecialistManagement';

export default function SpecialistsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-6 py-12 w-full">
        <PageHeader
          title="Specialist Directory"
          subtitle="Manage your team's capabilities and sustainable capacity."
        />
        <SpecialistManagement />
      </main>
    </div>
  );
}
