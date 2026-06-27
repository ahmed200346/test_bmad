import { Navbar } from '@/components/layout/Navbar';
import { FeatureCard } from '@/components/features/FeatureCard';

export default function HomePage() {
  const features = [
    {
      icon: "👤",
      title: "Resource Management",
      description: "Maintain detailed specialist profiles with skill sets and availability windows.",
      link: "/dashboard"
    },
    {
      icon: "🕸️",
      title: "Dependency Mapping",
      description: "Visualize and enforce execution order using Directed Acyclic Graphs (DAG).",
      link: "/dashboard"
    },
    {
      icon: "⚖️",
      title: "Smart Allocation",
      description: "Constraint-aware assignment that prevents over-allocation and ensures recovery floors.",
      link: "/allocate"
    },
    {
      icon: "🔋",
      title: "Sustainability Tracking",
      description: "Proactive fatigue monitoring and burn rate alerts for sustainable productivity.",
      link: "/specialist"
    },
    {
      icon: "📜",
      title: "Immutable Auditability",
      description: "A tamper-evident cryptographic log of every resource decision made.",
      link: "/dashboard"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <section className="text-center mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-6xl font-semibold text-slate-900 tracking-tight mb-6">
            Sustainable <span className="text-primary">Orchestration</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            OptiTask balances peak performance with human sustainability.
            Manage complex dependencies and specialist capacity without the burn-out.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-primary text-white px-8 py-3 rounded-interactive font-medium hover:bg-primary-dark transition-all">
              Open Dashboard
            </button>
            <button className="bg-white border border-slate-200 text-slate-700 px-8 py-3 rounded-interactive font-medium hover:bg-slate-50 transition-all">
              View Documentation
            </button>
          </div >
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gap animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </section>
      </main>

      <footer className="py-12 border-t border-slate-200 text-center text-slate-400 text-sm">
        © 2026 OptiTask Resource Orchestrator. Built for Calm Productivity.
      </footer>
    </div >
  );
}
