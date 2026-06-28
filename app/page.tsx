'use client';

import KanbanBoard from '@/components/KanbanBoard';

export default function Home() {
  return (
    <main className="min-h-screen bg-canvas text-ink">
      <header className="border-b border-hairline bg-surface-1 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-headline font-semibold">Job Application Tracker</h1>
            <p className="text-body-sm text-ink-subtle mt-1">
              Organize your job search pipeline and generate tailored application materials
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1">
        <KanbanBoard />
      </div>
    </main>
  );
}
