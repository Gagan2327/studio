import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Guide } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating } from './star-rating';

interface GuideCardProps {
  guide: Guide;
}

export function GuideCard({ guide }: GuideCardProps) {
  const guideData = encodeURIComponent(JSON.stringify(guide));
  const guideSlug = encodeURIComponent(guide.name.replace(/\s+/g, '-').toLowerCase());

  return (
    <Link href={`/guides/${guideSlug}?data=${guideData}`} className="group block">
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={guide.photoUrl}
              alt={`Photo of ${guide.name}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint="guide photo"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex-grow">
          <CardTitle className="text-xl font-headline mb-2">{guide.name}</CardTitle>
          <div className="flex items-center gap-2 mb-3">
            <StarRating rating={guide.rating} />
            <span className="text-sm text-muted-foreground">({guide.rating})</span>
          </div>
          <CardDescription className="line-clamp-2">{guide.description}</CardDescription>
        </CardContent>
        <CardFooter className="flex-col items-start gap-3">
          <div className="flex flex-wrap gap-2">
            {guide.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          <div className="w-full flex justify-end">
            <div className="flex items-center text-primary font-medium transition-transform duration-300 group-hover:translate-x-1">
                View Profile <ArrowRight className="ml-1 h-4 w-4" />
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
