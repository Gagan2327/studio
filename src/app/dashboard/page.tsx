import { User } from 'lucide-react';
import Logo from '@/components/logo';
import { SearchGuides } from '@/components/guides/search-guides';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50 animate-in fade-in duration-500">
      <header className="sticky top-0 z-10 flex items-center justify-between w-full px-4 sm:px-8 py-3 bg-background/80 backdrop-blur-sm border-b">
        <Logo />
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src="https://picsum.photos/100" alt="User avatar" data-ai-hint="user avatar" />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </Button>
      </header>
      <main className="flex-1 p-4 sm:p-8">
        <SearchGuides />
      </main>
    </div>
  );
}
