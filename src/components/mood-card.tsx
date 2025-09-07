import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Mood } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface MoodCardProps {
  mood: Mood;
}

const moodEmojis: { [key: string]: string } = {
  happy: '😄',
  sad: '😢',
  angry: '😠',
  stressed: '😫',
  excited: '🎉',
};

export default function MoodCard({ mood }: MoodCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl capitalize">
            <span>{moodEmojis[mood.mood]}</span>
            {mood.mood}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(mood.timestamp), { addSuffix: true })}
            </p>
        </div>
      </CardHeader>
      {mood.note && (
        <CardContent>
          <p className="text-sm text-foreground/80">{mood.note}</p>
        </CardContent>
      )}
    </Card>
  );
}
