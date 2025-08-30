'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar as CalendarIcon, CreditCard, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Guide } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { StarRating } from '@/components/guides/star-rating';

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const guideData = searchParams.get('data');
  const [date, setDate] = useState<Date>();
  const [step, setStep] = useState<'details' | 'payment' | 'confirmed'>('details');
  const [guide, setGuide] = useState<Guide | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (guideData) {
      const parsedGuide: Guide = JSON.parse(decodeURIComponent(guideData));
      setGuide(parsedGuide);
    } else {
       // Handle case where guide data is missing, maybe redirect or show error
       router.push('/dashboard');
    }
  }, [guideData, router]);


  if (!guide) {
    return <BookingSkeleton />;
  }

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
  
  const handleDone = () => {
    router.push('/dashboard');
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="w-full shadow-none border-none bg-transparent">
            <CardHeader>
                <CardTitle className="font-bold text-2xl">
                    {step === 'details' && 'Book Your Tour'}
                    {step === 'payment' && 'Confirm Payment'}
                    {step === 'confirmed' && 'Booking Complete!'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {step === 'details' && (
                    <form onSubmit={handleProceedToPayment} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="days">No. of Days</Label>
                            <Input id="days" type="number" defaultValue="1" min="1" className="h-12 bg-secondary border-none"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="members">No. of Members</Label>
                            <Input id="members" type="number" defaultValue="1" min="1" className="h-12 bg-secondary border-none" />
                        </div>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"secondary"}
                                className={cn(
                                "w-full justify-start text-left font-normal h-12",
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
                        <Label htmlFor="duration">Time Duration (hours)</Label>
                        <Input id="duration" type="number" placeholder="e.g., 3" min="1" className="h-12 bg-secondary border-none"/>
                        </div>
                         <Button type="submit" className="w-full h-14 rounded-full text-lg mt-8">Next</Button>
                    </form>
                )}
                {step === 'payment' && (
                    <form onSubmit={handleConfirmPayment} className="space-y-8">
                        <div className="text-center rounded-lg border p-4 bg-secondary">
                            <p className="text-muted-foreground">Total Amount</p>
                            <p className="text-4xl font-bold text-primary">₹{guide.ratePerHour * 3}</p>
                            <p className="text-xs text-muted-foreground">(for 3 hours)</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="card">Card Details</Label>
                            <div className="flex items-center border rounded-lg px-3 bg-secondary border-none h-12">
                                <CreditCard className="text-muted-foreground mr-3" />
                                <Input id="card" placeholder="XXXX XXXX XXXX XXXX" className="border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent" />
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-4">
                            <Button onClick={() => setStep('details')} variant="ghost">Back</Button>
                            <Button type="submit" className="w-auto flex-grow ml-4 h-14 rounded-full text-lg">Confirm Payment</Button>
                        </div>
                    </form>
                )}
                {step === 'confirmed' && (
                    <div className="py-8 text-center flex flex-col items-center justify-center">
                        <PartyPopper className="h-16 w-16 text-primary mb-4" />
                        <h3 className="text-2xl font-bold text-primary">Booking Confirmed!</h3>
                        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Your tour with {guide.name} is scheduled. Check your email for the details.</p>
                        <div className="pt-6 w-full">
                            <Button onClick={handleDone} className="w-full h-14 rounded-full text-lg">Done</Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}

function BookingSkeleton() {
    return (
        <div className="w-full max-w-md mx-auto p-4">
            <Skeleton className="h-10 w-3/4 mb-8" />
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-14 w-full rounded-full mt-8" />
            </div>
        </div>
    )
}

export default function BookGuidePage() {
  const searchParams = useSearchParams();
  const suspenseKey = searchParams.toString(); 

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
       <div className="flex items-center mb-4">
         <Button asChild variant="outline" size="icon" className="rounded-full h-10 w-10">
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
       </div>
      <Suspense key={suspenseKey} fallback={<BookingSkeleton />}>
        <BookingForm />
      </Suspense>
    </main>
  );
}
