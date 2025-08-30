'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ChevronUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Guide } from '@/lib/types';
import { StarRating } from '@/components/guides/star-rating';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


function GuideProfileContent() {
  const searchParams = useSearchParams();
  const guideData = searchParams.get('data');

  if (!guideData) {
    return <GuideProfileSkeleton />;
  }

  const guide: Guide = JSON.parse(decodeURIComponent(guideData));
  const guideSlug = encodeURIComponent(guide.name.replace(/\s+/g, '-').toLowerCase());
  
  const itinerary = [
      {
          day: 1,
          title: "Arrival to Rio de Janeiro",
          details: {
              morning: "Arrive in Rio de Janeiro and transfer to your hotel",
              afternoon: "Free time to relax or explore the nearby area",
              evening: "Welcome dinner at a traditional Brazilian restaurant"
          }
      },
      {
          day: 2,
          title: "Rio de Janeiro Highlights",
          details: {
              morning: "Visit the Christ the Redeemer statue",
              afternoon: "Explore the Sugarloaf Mountain",
              evening: "Enjoy a samba show"
          }
      }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
            <Button asChild variant="outline" size="icon" className="rounded-full h-10 w-10">
                <Link href="/dashboard">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
            </Button>
             <h1 className="font-bold">Iconic Brazil</h1>
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
                <Heart className="h-5 w-5" />
            </Button>
        </div>
        <p className="text-center text-muted-foreground text-sm">Wed, Oct 21 - Sun, Nov 1</p>
      </div>

       <Tabs defaultValue="schedule" className="w-full mt-4">
        <TabsList className="grid w-full grid-cols-3 bg-secondary rounded-full">
            <TabsTrigger value="schedule" className="rounded-full">Tour schedule</TabsTrigger>
            <TabsTrigger value="accommodation" className="rounded-full">Accomodation</TabsTrigger>
            <TabsTrigger value="details" className="rounded-full">Booking details</TabsTrigger>
        </TabsList>
        <TabsContent value="schedule">
            <Card className="shadow-none border-none bg-transparent">
                <CardContent className="p-2 space-y-6">
                 <h2 className="text-xl font-bold mt-6 mb-2">8-Days Brazil Adventure</h2>
                 <Accordion type="single" collapsible defaultValue="item-1">
                    {itinerary.map(item => (
                         <AccordionItem value={`item-${item.day}`} key={item.day} className="border-none mb-2">
                             <AccordionTrigger className="bg-card p-4 rounded-lg hover:no-underline">
                                <div className="flex items-center gap-4">
                                     <Image src={`https://picsum.photos/100?random=${item.day}`} alt={item.title} width={60} height={60} className="rounded-lg" />
                                     <div>
                                         <p className="text-muted-foreground text-sm">Day {item.day}</p>
                                         <p className="font-bold text-base text-left">{item.title}</p>
                                     </div>
                                 </div>
                             </AccordionTrigger>
                             <AccordionContent className="p-4 text-muted-foreground">
                                 <div className="space-y-3">
                                     <div>
                                         <h3 className="font-semibold text-foreground">Morning</h3>
                                         <p>{item.details.morning}</p>
                                     </div>
                                      <div>
                                         <h3 className="font-semibold text-foreground">Afternoon</h3>
                                         <p>{item.details.afternoon}</p>
                                     </div>
                                      <div>
                                         <h3 className="font-semibold text-foreground">Evening</h3>
                                         <p>{item.details.evening}</p>
                                     </div>
                                 </div>
                             </AccordionContent>
                         </AccordionItem>
                    ))}
                 </Accordion>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
             <Button size="lg" className="w-full h-14 rounded-full text-lg" asChild>
              <Link href={`/guides/${guideSlug}/book?data=${guideData}`}>
                Book a tour
              </Link>
            </Button>
        </div>
    </div>
  );
}

function GuideProfileSkeleton() {
    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <Skeleton className="h-10 w-full rounded-full mb-4" />
            <Skeleton className="h-6 w-1/2 mx-auto mb-6" />
            <Skeleton className="h-12 w-full rounded-full mb-8" />
             <div className="space-y-4 mt-8">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
            </div>
            <Skeleton className="fixed bottom-0 left-0 right-0 h-20 w-full" />
        </div>
    );
}

export default function GuideProfilePage() {
  return (
    <main className="min-h-screen bg-background pb-24">
      <Suspense fallback={<GuideProfileSkeleton />}>
        <GuideProfileContent />
      </Suspense>
    </main>
  );
}
