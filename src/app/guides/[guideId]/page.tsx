'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ChevronUp, Heart, MessageSquare, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Guide } from '@/lib/types';
import { StarRating } from '@/components/guides/star-rating';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ChatInterface } from '@/components/chat/chat-interface';
import { Skeleton } from '@/components/ui/skeleton';

function GuideProfileContent() {
  const searchParams = useSearchParams();
  const guideData = searchParams.get('data');

  if (!guideData) {
    return <GuideProfileSkeleton />;
  }

  const guide: Guide = JSON.parse(decodeURIComponent(guideData));
  const guideSlug = encodeURIComponent(guide.name.replace(/\s+/g, '-').toLowerCase());

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <div className="relative h-64 w-full">
              <Image
                src={guide.photoUrl}
                alt={`Photo of ${guide.name}`}
                fill
                className="object-cover"
                data-ai-hint="guide photo"
              />
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline">{guide.name}</CardTitle>
              <div className="flex justify-center items-center gap-2">
                <StarRating rating={guide.rating} />
                <span className="text-sm text-muted-foreground">({guide.rating})</span>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-wrap justify-center gap-2">
                {guide.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{guide.description}</p>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Get in touch with your guide.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Sheet>
                 <SheetTrigger asChild>
                    <Button variant="outline" size="lg">
                      <MessageSquare className="mr-2 h-4 w-4" /> Message
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                     <ChatInterface guideName={guide.name} />
                  </SheetContent>
                </Sheet>
              <Button variant="outline" size="lg">
                <Phone className="mr-2 h-4 w-4" /> Call
              </Button>
            </CardContent>
            <CardFooter>
               <Button size="lg" className="w-full" asChild>
                  <Link href={`/guides/${guideSlug}/book?data=${guideData}`}>
                    Hire Now
                  </Link>
                </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>What others are saying.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Placeholder for reviews */}
              <div className="text-center text-muted-foreground py-8">
                No reviews yet.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function GuideProfileSkeleton() {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="mb-8">
                <Skeleton className="h-10 w-10 rounded-md" />
            </div>
            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <Skeleton className="h-64 w-full" />
                        <CardHeader className="text-center">
                            <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
                            <Skeleton className="h-5 w-1/2 mx-auto" />
                        </CardHeader>
                        <CardContent className="flex justify-center flex-wrap gap-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-14" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/3" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                           <Skeleton className="h-6 w-1/2" />
                           <Skeleton className="h-4 w-3/4" />
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Skeleton className="h-11 w-full" />
                            <Skeleton className="h-11 w-full" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-11 w-full" />
                        </CardFooter>
                    </Card>
                     <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/3" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-20 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function GuideProfilePage() {
  return (
    <main className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <Suspense fallback={<GuideProfileSkeleton />}>
        <GuideProfileContent />
      </Suspense>
    </main>
  );
}
