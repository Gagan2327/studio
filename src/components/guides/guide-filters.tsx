'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { indianStatesAndCities } from '@/lib/india-data';
import { Calendar } from '../ui/calendar';
import { CalendarIcon, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const interests = [
  'History', 'Art & Culture', 'Food', 'Adventure', 'Nature', 'Shopping', 'Nightlife', 'Spiritual'
];
const languages = ['English', 'Hindi', 'Spanish', 'French', 'German'];

interface GuideFiltersProps {
    onSearch: (city: string, date?: Date) => void;
    loading: boolean;
}

export function GuideFilters({ onSearch, loading }: GuideFiltersProps) {
  const [selectedState, setSelectedState] = useState('');
  const [city, setCity] = useState('');
  const [cityPopoverOpen, setCityPopoverOpen] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(500);
  const [date, setDate] = useState<Date>();

  const cities = useMemo(() => {
    if (!selectedState) return [];
    const stateData = indianStatesAndCities.find(s => s.state === selectedState);
    return stateData ? stateData.cities : [];
  }, [selectedState]);

  const filteredCities = useMemo(() => {
    if (!city) return cities;
    return cities.filter(c => c.toLowerCase().includes(city.toLowerCase()));
  }, [city, cities]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleCitySelect = (currentValue: string) => {
    setCity(currentValue === city ? "" : currentValue);
    setCityPopoverOpen(false);
  }

  const handleSearchClick = () => {
    if (city) {
      onSearch(city, date);
    }
  }

  return (
    <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* State and City */}
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select onValueChange={setSelectedState} defaultValue="">
            <SelectTrigger id="state" className="w-full">
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              {indianStatesAndCities.map(s => (
                <SelectItem key={s.state} value={s.state}>
                  {s.state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
           <Popover open={cityPopoverOpen} onOpenChange={setCityPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={cityPopoverOpen}
                className="w-full justify-between font-normal"
                disabled={!selectedState}
              >
                {city || "Select a city"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Search city..." />
                <CommandList>
                  <CommandEmpty>No city found.</CommandEmpty>
                  <CommandGroup>
                    {filteredCities.map((c) => (
                      <CommandItem
                        key={c}
                        value={c}
                        onSelect={handleCitySelect}
                      >
                        {c}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
         <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
             <Popover>
                <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
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
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select>
            <SelectTrigger id="language" className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map(lang => (
                <SelectItem key={lang} value={lang.toLowerCase()}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Interests */}
        <div className="md:col-span-2 lg:col-span-3 space-y-3">
          <Label>Interests</Label>
          <div className="flex flex-wrap gap-2">
            {interests.map(interest => (
              <Badge
                key={interest}
                variant={selectedInterests.includes(interest) ? 'default' : 'secondary'}
                onClick={() => toggleInterest(interest)}
                className="cursor-pointer transition-colors"
              >
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        {/* Max Price */}
        <div className="lg:col-span-3 space-y-2">
          <Label htmlFor="max-price">Max Price per Hour: ₹{maxPrice}</Label>
          <Slider
            id="max-price"
            min={50}
            max={2000}
            step={50}
            value={[maxPrice]}
            onValueChange={([value]) => setMaxPrice(value)}
            className="w-full"
          />
        </div>
         <div className="lg:col-span-3">
            <Button onClick={handleSearchClick} disabled={!city || loading} className="w-full" size="lg">
                {loading ? 'Searching...' : 'Search Guides'}
                <Search className="ml-2 h-5 w-5" />
            </Button>
        </div>
      </div>
    </div>
  );
}
