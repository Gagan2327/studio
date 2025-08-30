'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
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

  if (!guide) {
    return <BookingSkeleton />;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          {step === 'details' && 'Book Your Tour'}
          {step === 'payment' && 'Confirm Payment'}
          {step === 'confirmed' && 'Booking Complete!'}
        </CardTitle>
        {step !== 'confirmed' && <CardDescription>Complete the form to book your tour with {guide.name}.</CardDescription>}
      </CardHeader>
      <CardContent>
        {step === 'details' && (
            <form onSubmit={handleProceedToPayment} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="days">No. of Days</Label>
                    <Input id="days" type="number" defaultValue="1" min="1" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="members">No. of Members</Label>
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
                <Label htmlFor="duration">Time Duration (hours)</Label>
                <Input id="duration" type="number" placeholder="e.g., 3" min="1" />
                </div>
                <Button type="submit" size="lg" className="w-full">Next</Button>
            </form>
        )}
        {step === 'payment' && (
            <form onSubmit={handleConfirmPayment} className="space-y-8">
                 <div className="text-center">
                    <p className="text-lg text-muted-foreground">Total Amount</p>
                    <p className="text-4xl font-bold">₹{guide.ratePerHour * 3}</p>
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="card">Card Details</Label>
                    <div className="flex items-center border rounded-md px-3">
                        <CreditCard className="text-muted-foreground mr-3" />
                        <Input id="card" placeholder="XXXX XXXX XXXX XXXX" className="border-0 px-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                    </div>
                </div>
                <div className="flex justify-between items-center pt-4">
                    <Button onClick={() => setStep('details')} variant="ghost">Back</Button>
                    <Button type="submit" size="lg">Confirm Payment</Button>
                </div>
            </form>
        )}
        {step === 'confirmed' && (
            <div className="py-8 text-center">
                <PartyPopper className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold font-headline">Booking Confirmed!</h3>
                <p className="text-muted-foreground mt-2">Your tour with {guide.name} is scheduled.</p>
                <div className="pt-6">
                    <Button onClick={handleDone} size="lg" className="w-full">Done</Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}

function BookingSkeleton() {
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-11 w-full" />
            </CardContent>
        </Card>
    )
}

export default function BookGuidePage() {
  const searchParams = useSearchParams();
  const suspenseKey = searchParams.toString(); 

  return (
    <main className="container mx-auto max-w-7xl min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <Button asChild variant="outline" size="icon">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
        </Button>
      </div>
      <Suspense key={suspenseKey} fallback={<BookingSkeleton />}>
        <BookingForm />
      </Suspense>
    </main>
  );
}
