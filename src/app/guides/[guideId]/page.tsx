'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Phone, UserPlus, MessageSquare, Calendar as CalendarIcon, CreditCard, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Guide } from '@/lib/types';
import { StarRating } from '@/components/guides/star-rating';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatInterface } from '@/components/chat/chat-interface';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';


function GuideProfileContent() {
  const searchParams = useSearchParams();
  const guideData = searchParams.get('data');
  const [date, setDate] = useState<Date>();
  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const { toast } = useToast();

  if (!guideData) {
    return <GuideProfileSkeleton />;
  }

  const guide: Guide = JSON.parse(decodeURIComponent(guideData));

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  }

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirmed');
    toast({
        title: "Booking Confirmed!",
        description: `You have successfully booked ${guide.name}.`,
    });
  }
  
  const resetBooking = () => {
    setStep('details');
    setDate(undefined);
  }

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
            <Dialog onOpenChange={(open) => !open && resetBooking()}>
              <DialogTrigger asChild>
                <Button size="lg" className="transition-transform hover:scale-105">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Hire Now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Book {guide.name}</DialogTitle>
                  <DialogDescription>
                    {step === 'details' && 'Complete the details below to schedule your tour.'}
                    {step === 'payment' && 'Review your details and confirm payment.'}
                    {step === 'confirmed' && 'Your booking is complete!'}
                  </DialogDescription>
                </DialogHeader>
                {step === 'details' && (
                  <form onSubmit={handleProceedToPayment} className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/50">
                          <span className="font-semibold">Rate</span>
                          <span className="text-primary font-bold text-lg">₹{guide.ratePerHour}/hour</span>
                      </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <Label htmlFor="days">Number of Days</Label>
                          <Input id="days" type="number" defaultValue="1" min="1"/>
                      </div>
                      <div className="space-y-2">
                          <Label htmlFor="members">Number of Members</Label>
                          <Input id="members" type="number" defaultValue="1" min="1" />
                      </div>
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
                      <Label htmlFor="duration">Time Duration (in hours)</Label>
                      <Input id="duration" type="number" placeholder="e.g., 3" min="1"/>
                    </div>
                    <DialogFooter className="pt-4">
                      <Button type="submit" className="w-full">Next</Button>
                    </DialogFooter>
                  </form>
                )}
                {step === 'payment' && (
                    <form onSubmit={handleConfirmPayment} className="space-y-6">
                        <div className="text-center rounded-lg border p-4 bg-muted/50">
                            <p className="text-muted-foreground">Total Amount</p>
                            <p className="text-4xl font-bold text-primary">₹{guide.ratePerHour * 3}</p>
                            <p className="text-xs text-muted-foreground">(for 3 hours)</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="card">Card Details</Label>
                            <div className="flex items-center border rounded-md px-3">
                                <CreditCard className="text-muted-foreground mr-3" />
                                <Input id="card" placeholder="XXXX XXXX XXXX XXXX" className="border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                            </div>
                        </div>
                         <DialogFooter className="pt-4">
                            <Button onClick={() => setStep('details')} variant="outline">Back</Button>
                            <Button type="submit" className="w-full">Confirm Payment</Button>
                        </DialogFooter>
                    </form>
                )}
                {step === 'confirmed' && (
                    <div className="py-8 text-center flex flex-col items-center justify-center">
                        <PartyPopper className="h-16 w-16 text-primary mb-4" />
                        <h3 className="text-2xl font-bold text-primary">Booking Confirmed!</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm">Your tour with {guide.name} is scheduled. Check your email for the details.</p>
                         <DialogFooter className="pt-6">
                           <Button onClick={() => document.querySelector('[data-radix-dialog-close]').click()} className="w-full">Done</Button>
                        </DialogFooter>
                    </div>
                )}
              </DialogContent>
            </Dialog>
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

    