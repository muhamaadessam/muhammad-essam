'use client';

import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans">
      <nav className="border-b border-white/10 glass px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-bold text-primary tracking-widest uppercase">Admin Dashboard</h1>
      </nav>
      <main className="p-6">
        {children}
      </main>
    </div>
  );
}
