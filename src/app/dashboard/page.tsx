'use client';

import { SearchGuides } from '@/components/guides/search-guides';
import Logo from '@/components/logo';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <header className="mb-12 text-center">
        <div className="inline-block">
          <Logo />
        </div>
      </header>
      <SearchGuides />
    </main>
  );
}
