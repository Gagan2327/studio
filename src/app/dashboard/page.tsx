'use client';

import { useState } from 'react';
import { User, Bell, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TripCard } from '@/components/trips/trip-card';

const tabs = ['Asia', 'Europe', 'South America', 'North America'];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('South America');

  const trip = {
    id: '1',
    name: 'Rio de Janeiro',
    country: 'Brazil',
    image: 'https://picsum.photos/600/800?random=10',
    rating: 5.0,
    reviews: 143,
  };

  return (
    <div className="flex flex-col min-h-screen bg-background animate-in fade-in duration-500">
      <header className="flex items-center justify-between w-full px-4 sm:px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hello, Vanessa</h1>
          <p className="text-muted-foreground">Welcome to TripGlide</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage
                src="https://picsum.photos/100"
                alt="User avatar"
                data-ai-hint="user avatar"
              />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6">
        <div className="relative mb-6">
            <Input 
                placeholder="Search"
                className="h-12 text-lg pl-10 bg-secondary border-none"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <Button variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2">
                <Settings className="h-6 w-6" />
            </Button>
        </div>

        <div>
            <h2 className="text-xl font-bold mb-4">Select your next trip</h2>
            <div className="flex space-x-2">
                {tabs.map(tab => (
                    <Button 
                        key={tab} 
                        variant={activeTab === tab ? 'primary' : 'secondary'}
                        className="rounded-full px-5 py-2"
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </Button>
                ))}
            </div>
        </div>

        <div className="mt-8">
            <TripCard trip={trip} />
        </div>
      </main>

      <nav className="sticky bottom-0 bg-background border-t p-2">
          <div className="flex justify-around items-center max-w-sm mx-auto">
              <Button variant="primary" size="icon" className="w-14 h-14 rounded-full flex flex-col items-center justify-center">
                  <User className="h-6 w-6"/>
              </Button>
              <Button variant="ghost" size="icon" className="w-14 h-14 rounded-full">
                  <Bell className="h-6 w-6"/>
              </Button>
              <Button variant="ghost" size="icon" className="w-14 h-14 rounded-full">
                  <User className="h-6 w-6"/>
              </Button>
               <Button variant="ghost" size="icon" className="w-14 h-14 rounded-full">
                  <Settings className="h-6 w-6"/>
              </Button>
          </div>
      </nav>
    </div>
  );
}
