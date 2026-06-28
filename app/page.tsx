'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { FeatureCard } from '@/components/features/FeatureCard';

// Custom SVG Icons to avoid dependency issues and ensure "line-art" style
const Icons = {
  Users: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-4H11a4 4 0 0 0-4 4v2" />
      <circle cx="16" cy="7" r="4" />
    </svg>
  ),
  Network: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
      <circle cx="12" cy="12" r="3" />
      <circle cx="3" cy="3" r="2" />
      <circle cx="21" cy="3" r="2" />
      <circle cx="3" cy="21" r="2" />
      <circle cx="21" cy="21" r="2" />
      <path d="M12 9V3" />
      <path d="M12 15v6" />
      <path d="M9 12H3" />
      <path d="M15 12h6" />
    </svg>
  ),
  Scale: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
      <path d="M3 6h18" />
      <path d="M12 6v16" />
      <path d="M8 10a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4z" />
      <path d="M16 10a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-4z" />
    </svg>
  ),
  Battery: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
      <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
      <path d="M23 11v2" />
      <path d="M6 11h4" />
    </svg>
  ),
  FileCheck: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M9 14l2 2 4-4" />
    </svg>
  ),
};

export default function HomePage() {
  const features = [
    {
      icon: <Icons.Users />,
      title: "Resource Management",
      description: "Maintain detailed specialist profiles with skill sets and availability windows.",
      link: "/dashboard"
    },
    {
      icon: <Icons.Network />,
      title: "Dependency Mapping",
      description: "Visualize and enforce execution order using Directed Acyclic Graphs (DAG).",
      link: "/dashboard"
    },
    {
      icon: <Icons.Scale />,
      title: "Smart Allocation",
      description: "Constraint-aware assignment that prevents over-allocation and ensures recovery floors.",
      link: "/allocate"
    },
    {
      icon: <Icons.Battery />,
      title: "Sustainability Tracking",
      description: "Proactive fatigue monitoring and burn rate alerts for sustainable productivity.",
      link: "/specialist"
    },
    {
      icon: <Icons.FileCheck />,
      title: "Immutable Auditability",
      description: "A tamper-evident cryptographic log of every resource decision made.",
      link: "/dashboard"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Navbar />

      <main className="flex-grow max-w-6xl mx-auto px-6 py-24 w-full">
        {/* Hero Section - Focused on "Calm Productivity" */}
        <section className="text-center mb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
            v1.0 Resource Orchestration
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold text-slate-900 tracking-tight mb-8 leading-[1.1]">
            Sustainable <span className="text-primary">Orchestration</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed">
            OptiTask balances peak performance with human sustainability.
            Manage complex dependencies and specialist capacity without the burn-out,
            grounded in a high-trust, professional environment.
          </p>
          <div className="flex justify-center gap-6">
            <button className="bg-primary text-white px-8 py-4 rounded-interactive font-medium hover:bg-primary-dark transition-all shadow-sm hover:shadow-md">
              Open Dashboard
            </button>
            <button className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-interactive font-medium hover:bg-slate-50 transition-all shadow-sm">
              View Documentation
            </button>
          </div >
        </section>

        {/* Feature Grid - Spacing increased for breathability */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gap animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
          ))}
        </section>
      </main>

      <footer className="py-16 border-t border-slate-200 text-center text-slate-400 text-sm">
        © 2026 OptiTask Resource Orchestrator. Built for <span className="text-slate-500 italic">Calm Productivity</span>.
      </footer>
    </div >
  );
}
