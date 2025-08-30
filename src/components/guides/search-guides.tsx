'use client';

import { useState } from 'react';
import { suggestGuidesByLocation } from '@/ai/flows/suggest-guides-by-location';
import { useToast } from '@/hooks/use-toast';
import type { Guide } from '@/lib/types';
import { GuideList } from './guide-list';
import { GuideSkeleton } from './guide-skeleton';
import { GuideFilters } from './guide-filters';
import { format } from 'date-fns';

export function SearchGuides() {
  const [loading, setLoading] = useState(false);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (city: string, date?: Date) => {
    if (!city.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setGuides([]);

    try {
      if (date) {
        console.log('Searching for guides in', city, 'on:', format(date, 'PPP'));
      }
      const result = await suggestGuidesByLocation({ location: city });
      if (result && result.guides) {
        setGuides(result.guides);
      } else {
        throw new Error('No guides found in the result.');
      }
    } catch (error) {
      console.error('Failed to fetch guides:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to find guides for the specified location. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight mb-4">
          Find Your Local Expert
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Use the filters below to discover amazing guides ready to show you around.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto mb-12">
        <GuideFilters onSearch={handleSearch} loading={loading} />
      </div>
      
      {loading && <GuideSkeleton />}
      {!loading && hasSearched && <GuideList guides={guides} />}
    </div>
  );
}
