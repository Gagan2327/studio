'use client';

import { useState, useMemo } from 'react';
import { Search, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { suggestGuidesByLocation } from '@/ai/flows/suggest-guides-by-location';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Guide } from '@/lib/types';
import { GuideList } from './guide-list';
import { GuideSkeleton } from './guide-skeleton';
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { GuideFilters } from './guide-filters';

const locations = ['Roorkee', 'Dehradun', 'Haridwar'];

export function SearchGuides() {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [date, setDate] = useState<Date>();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setInputValue(searchQuery);
    setLoading(true);
    setHasSearched(true);
    setGuides([]);
    setPopoverOpen(false);

    try {
      if (date) {
        console.log('Searching for guides on:', format(date, 'PPP'));
      }
      const result = await suggestGuidesByLocation({ location: searchQuery });
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
  
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // This function can be triggered by a search button if you add one to the filters.
    // For now, we can decide how to trigger search. Maybe a button in the filters?
    // For demonstration, let's assume a search can be triggered.
    // We would get the selected city from the filter state.
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight mb-4">
          Find Your Local Expert
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Enter a city, landmark, or region to discover amazing guides ready to show you around.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto mb-12">
        <GuideFilters />
      </div>
      
      {loading && <GuideSkeleton />}
      {!loading && hasSearched && <GuideList guides={guides} />}
    </div>
  );
}
