import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Trip {
    id: string;
    name: string;
    country: string;
    image: string;
    rating: number;
    reviews: number;
}

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  const guideData = encodeURIComponent(JSON.stringify({ name: trip.name, photoUrl: trip.image, rating: trip.rating, description: `An exciting trip to ${trip.name}`, tags: [trip.country], ratePerHour: 50 }));
  const guideSlug = encodeURIComponent(trip.name.replace(/\s+/g, '-').toLowerCase());


  return (
    <Link href={`/guides/${guideSlug}?data=${guideData}`} className="group block">
        <div className="relative h-[450px] w-full rounded-3xl overflow-hidden">
            <Image
                src={trip.image}
                alt={`Photo of ${trip.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                data-ai-hint="trip destination"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="font-semibold">{trip.country}</p>
                <h3 className="text-3xl font-bold mt-1">{trip.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{trip.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-300">({trip.reviews} reviews)</span>
                </div>
                <div className="mt-4">
                    <Button variant="secondary" className="rounded-full h-12 w-full justify-between px-6 text-lg">
                        See more
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    </Link>
  );
}
