'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

import { suggestGuidesByLocation } from '@/ai/flows/suggest-guides-by-location';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { Guide } from '@/lib/types';
import { GuideList } from './guide-list';
import { GuideSkeleton } from './guide-skeleton';
import { Popover, PopoverContent, PopoverTrigger, PopoverAnchor } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';


const locations = ['Roorkee', 'Dehradun', 'Haridwar'];

export function SearchGuides() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const filteredLocations = useMemo(() => {
    if (!query) return locations;
    return locations.filter((location) =>
      location.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setGuides([]);
    setPopoverOpen(false);

    try {
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
    handleSearch(query);
  }

  const handleSuggestionClick = (location: string) => {
    setQuery(location);
    handleSearch(location);
  };
  
  useEffect(() => {
    if (query.length > 0 && filteredLocations.length > 0) {
      setPopoverOpen(true);
    } else {
      setPopoverOpen(false);
    }
  }, [query, filteredLocations]);


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
      
      <form onSubmit={handleFormSubmit} className="flex w-full max-w-2xl mx-auto items-center space-x-2 mb-12">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverAnchor className="w-full">
            <Input
              type="search"
              placeholder="e.g., Haridwar"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-12 text-lg"
              aria-label="Search for a location"
              autoComplete="off"
            />
          </PopoverAnchor>
          <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
            <Command>
              <CommandList>
                {filteredLocations.length > 0 ? (
                  <CommandGroup>
                    {filteredLocations.map((location) => (
                      <CommandItem
                        key={location}
                        value={location}
                        onSelect={() => handleSuggestionClick(location)}
                        className="cursor-pointer"
                      >
                        {location}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  !loading && <CommandEmpty>No location found.</CommandEmpty>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button type="submit" size="lg" disabled={loading}>
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
      </form>
      
      {loading && <GuideSkeleton />}
      {!loading && hasSearched && <GuideList guides={guides} />}
    </div>
  );
}
