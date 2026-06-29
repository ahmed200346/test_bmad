import React from 'react';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <nav className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-40">
      <Link href="/" className="flex items-center gap-2 font-semibold text-primary hover:opacity-80 transition-opacity">
        <span className="text-2xl">⚙️</span>
        <span>OptiTask Orchestrator</span>
      </Link>
      <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
        <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
        <Link href="/specialists" className="hover:text-primary transition-colors">Specialists</Link>
        <Link href="/tasks" className="hover:text-primary transition-colors">Tasks</Link>
        <Link href="/allocate" className="hover:text-primary transition-colors">Allocate</Link>
        <Link href="/specialist" className="hover:text-primary transition-colors">Specialist View</Link>
      </div>
    </nav>
  );
};