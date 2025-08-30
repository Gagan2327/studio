'use client';

import { useState } from 'react';
import { SearchGuides } from '@/components/guides/search-guides';
import Logo from '@/components/logo';
import {
  Bell,
  CircleUser,
  CreditCard,
  HelpCircle,
  History,
  Home,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

function ProfileTab() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            This is how others will see you on the site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="https://picsum.photos/100?grayscale" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <Button variant="outline">Change Photo</Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Vanessa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="vanessa@example.com" />
            </div>
             <Button type="submit">Update Profile</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your account settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="flex flex-col space-y-1">
                <span>Email Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                    Receive emails about your account activity.
                </span>
            </Label>
            <Button variant="outline">Toggle</Button>
          </div>
           <div className="flex items-center justify-between">
             <Label htmlFor="language" className="flex flex-col space-y-1">
                <span>Language</span>
                <span className="font-normal leading-snug text-muted-foreground">
                    Set your preferred language.
                </span>
            </Label>
            <Button variant="outline">Set</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('suggestions');

  return (
    <main className="min-h-screen bg-background pb-20">
       <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Logo />
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
                <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                </Button>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>About</span>
                    </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => setActiveTab('profile')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard className="mr-2 h-4 w-4" />
                      <span>Billings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <History className="mr-2 h-4 w-4" />
                        <span>History</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {activeTab === 'suggestions' && <SearchGuides />}
        {activeTab === 'profile' && <ProfileTab />}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background shadow-t-lg md:hidden">
        <div className="grid h-16 grid-cols-2">
            <button
                onClick={() => setActiveTab('suggestions')}
                className={cn(
                    'flex flex-col items-center justify-center gap-1 text-sm font-medium transition-colors',
                    activeTab === 'suggestions' ? 'text-primary' : 'text-muted-foreground hover:bg-muted'
                )}
            >
                <Home className="h-5 w-5" />
                <span>Suggestions</span>
            </button>
            <button
                onClick={() => setActiveTab('profile')}
                className={cn(
                    'flex flex-col items-center justify-center gap-1 text-sm font-medium transition-colors',
                    activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground hover:bg-muted'
                )}
            >
                <User className="h-5 w-5" />
                <span>Profile</span>
            </button>
        </div>
      </nav>
    </main>
  );
}
