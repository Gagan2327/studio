'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Phone, UserPlus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Guide } from '@/lib/types';
import { StarRating } from '@/components/guides/star-rating';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatInterface } from '@/components/chat/chat-interface';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

function GuideProfileContent() {
  const searchParams = useSearchParams();
  const guideData = searchParams.get('data');

  if (!guideData) {
    return <GuideProfileSkeleton />;
  }

  const guide: Guide = JSON.parse(decodeURIComponent(guideData));
  const guideSlug = encodeURIComponent(guide.name.replace(/\s+/g, '-').toLowerCase());

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden mb-8 shadow-lg">
        <Image
          src={guide.photoUrl}
          alt={`Photo of ${guide.name}`}
          fill
          className="object-cover"
          data-ai-hint="guide photo"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-extrabold font-headline">{guide.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={guide.rating} />
            <span className="text-lg font-medium">({guide.rating})</span>
          </div>
        </div>
      </div>
      
      <Card className="shadow-lg mb-8">
        <CardContent className="p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold font-headline mb-3">About Me</h2>
            <p className="text-muted-foreground text-base leading-relaxed">{guide.description}</p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold font-headline mb-4">Specialties</h2>
            <div className="flex flex-wrap gap-3">
              {guide.tags.map((tag) => (
                <Badge key={tag} className="text-base px-4 py-2" variant="default">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
                These tags represent my areas of expertise and the unique experiences I offer. Whether it's historical tours, culinary adventures, or off-the-beaten-path explorations, I'm here to make your trip unforgettable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <Button size="lg" className="transition-transform hover:scale-105">
              <Phone className="mr-2 h-5 w-5" />
              Call
            </Button>
             <Sheet>
              <SheetTrigger asChild>
                <Button size="lg" className="transition-transform hover:scale-105">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Message
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md p-0">
                <ChatInterface guideName={guide.name} />
              </SheetContent>
            </Sheet>
            <Button size="lg" className="transition-transform hover:scale-105" asChild>
              <Link href={`/guides/${guideSlug}/book?data=${guideData}`}>
                <UserPlus className="mr-2 h-5 w-5" />
                Hire Now
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function GuideProfileSkeleton() {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <Skeleton className="h-80 w-full rounded-lg mb-8" />
            <Card>
                <CardContent className="p-8 space-y-6">
                    <Skeleton className="h-8 w-1/4 mb-3" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                    <div className="pt-4">
                        <Skeleton className="h-8 w-1/3 mb-4" />
                        <div className="flex flex-wrap gap-3">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-28" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function GuideProfilePage() {
  return (
    <main className="min-h-screen bg-secondary p-4 sm:p-8">
       <Button asChild variant="outline" className="absolute top-4 left-4 z-10 bg-background/50 hover:bg-background">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Link>
      </Button>
      <Suspense fallback={<GuideProfileSkeleton />}>
        <GuideProfileContent />
      </Suspense>
    </main>
  );
}
