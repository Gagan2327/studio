import type { Guide } from '@/lib/types';
import { GuideCard } from './guide-card';

interface GuideListProps {
  guides: Guide[];
}

export function GuideList({ guides }: GuideListProps) {
  if (guides.length === 0) {
    return (
      <div className="text-center py-16 animate-in fade-in duration-500">
        <h2 className="text-2xl font-semibold mb-2">No Guides Found</h2>
        <p className="text-muted-foreground">We couldn&apos;t find any guides for this location. Please try a different search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {guides.map((guide) => (
        <GuideCard key={guide.guideId} guide={guide} />
      ))}
    </div>
  );
}
