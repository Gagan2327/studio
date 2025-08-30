import Link from 'next/link';
import { ArrowRight, User, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/logo';

export default function ChoicePage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-secondary p-4">
      <div className="flex flex-col items-center justify-center text-center mb-12">
        <Logo />
        <p className="mt-2 text-lg text-muted-foreground">Your Adventure, Their Expertise.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Card className="transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-out">
          <CardHeader>
            <div className="p-4 bg-primary/10 rounded-full w-fit mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">I'm a Tourist</CardTitle>
            <CardDescription>Ready to explore with a local expert? Find the perfect guide for your next trip.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" className="w-full">
              <Link href="/login?role=tourist">
                Find a Guide
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="transform hover:scale-105 hover:shadow-xl transition-all duration-300 ease-out">
          <CardHeader>
            <div className="p-4 bg-primary/10 rounded-full w-fit mb-4">
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">I'm a Guide</CardTitle>
            <CardDescription>Love your city? Share your knowledge and earn money by guiding travelers.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" className="w-full">
              <Link href="/login?role=guide">
                Become a Guide
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
       <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} GuidiGo. All Rights Reserved.
      </footer>
    </main>
  );
}
