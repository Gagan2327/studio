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
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-full md:w-1/3">
            <Card className="sticky top-24">
                <CardHeader>
                    <div className="relative h-40 w-full rounded-md overflow-hidden">
                        <Image src={guide.photoUrl} alt={guide.name} fill className="object-cover" />
                    </div>
                    <CardTitle className="pt-4">{guide.name}</CardTitle>
                    <div className="flex items-center gap-2">
                        <StarRating rating={guide.rating} />
                        <span className="text-sm text-muted-foreground">({guide.rating})</span>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/50">
                        <span className="font-semibold">Rate</span>
                        <span className="text-primary font-bold text-lg">₹{guide.ratePerHour}/hour</span>
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="w-full md:w-2/3">
             <Card>
                <CardHeader>
                    <CardTitle>Book Your Tour</CardTitle>
                     <CardDescription>
                        {step === 'details' && 'Complete the details below to schedule your tour.'}
                        {step === 'payment' && 'Review your details and confirm payment.'}
                        {step === 'confirmed' && 'Your booking is complete!'}
                     </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 'details' && (
                        <form onSubmit={handleProceedToPayment} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            <div className="flex justify-end pt-4">
                                <Button type="submit" className="w-full md:w-auto">Next</Button>
                            </div>
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
                            <div className="flex justify-between pt-4">
                                <Button onClick={() => setStep('details')} variant="outline">Back</Button>
                                <Button type="submit" className="w-full md:w-auto flex-grow md:flex-grow-0 ml-2">Confirm Payment</Button>
                            </div>
                        </form>
                    )}
                    {step === 'confirmed' && (
                        <div className="py-8 text-center flex flex-col items-center justify-center">
                            <PartyPopper className="h-16 w-16 text-primary mb-4" />
                            <h3 className="text-2xl font-bold text-primary">Booking Confirmed!</h3>
                            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">Your tour with {guide.name} is scheduled. Check your email for the details.</p>
                            <div className="pt-6">
                                <Button onClick={handleDone} className="w-full">Done</Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

function BookingSkeleton() {
    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-40 w-full rounded-md" />
                        <Skeleton className="h-8 w-3/4 mt-4" />
                        <Skeleton className="h-5 w-1/2 mt-2" />
                    </CardHeader>
                    <CardContent>
                         <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            </div>
            <div className="w-full md:w-2/3">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                         <div className="flex justify-end pt-4">
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function BookGuidePage() {
  const searchParams = useSearchParams();
  // Using a key on Suspense to re-trigger it when the query param changes
  const suspenseKey = searchParams.toString(); 

  return (
    <main className="min-h-screen bg-secondary p-4 sm:p-8">
      <Button asChild variant="outline" className="absolute top-4 left-4 z-10 bg-background/50 hover:bg-background">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Link>
      </Button>
      <Suspense key={suspenseKey} fallback={<BookingSkeleton />}>
        <BookingForm />
      </Suspense>
    </main>
  );
}
