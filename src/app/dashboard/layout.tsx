import type { Metadata } from 'next';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Dashboard | EduAI Africa',
};

/**
 * Layout du dashboard : Sidebar fixe (260px) + Header sticky + contenu scrollable.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0F]">
      {/* Sidebar desktop */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex flex-1 flex-col lg:pl-[260px]">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
