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

  const filteredLocations = useMemo(() => {
    if (!inputValue) return [];
    return locations.filter((location) =>
      location.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue]);

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
    handleSearch(inputValue);
  }

  const handleSuggestionClick = (location: string) => {
    handleSearch(location);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 0) {
      setPopoverOpen(true);
    } else {
      setPopoverOpen(false);
    }
  };

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
      
      <div className="max-w-3xl mx-auto mb-8">
        <GuideFilters />
      </div>

      <form onSubmit={handleFormSubmit} className="flex w-full max-w-2xl mx-auto items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 mb-12 flex-col md:flex-row">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverAnchor asChild>
            <div className="w-full">
              <Input
                type="search"
                placeholder="e.g., Haridwar"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => { if (inputValue) setPopoverOpen(true)}}
                className="h-12 text-lg"
                aria-label="Search for a location"
                autoComplete="off"
              />
            </div>
          </PopoverAnchor>
          <PopoverContent onOpenAutoFocus={(e) => e.preventDefault()} className="p-0 w-[--radix-popover-trigger-width]">
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

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full md:w-auto h-12 text-lg justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              {date ? format(date, "PPP") : <span className="text-base">Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button type="submit" size="lg" disabled={loading} className="h-12 w-full md:w-auto">
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
      </form>
      
      {loading && <GuideSkeleton />}
      {!loading && hasSearched && <GuideList guides={guides} />}
    </div>
  );
}
