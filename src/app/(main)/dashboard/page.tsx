'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, BarChart2, CalendarDays } from 'lucide-react';
import StatCard from '@/components/stat-card';
import MoodCard from '@/components/mood-card';
import MoodTrendAnalysis from '@/components/mood-trend-analysis';

export default function DashboardPage() {
  const { user, moods } = useAuth();

  const lastLoggedMood = moods.length > 0 ? moods[0].mood : 'Not logged yet';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Welcome back, {user?.name || user?.email?.split('@')[0]}!</h1>
        <p className="text-muted-foreground">Here's a look at your mood journal.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Moods Logged" value={moods.length.toString()} icon={<BarChart2 className="h-5 w-5 text-muted-foreground" />} />
        <StatCard title="Last Logged Mood" value={lastLoggedMood} icon={<CalendarDays className="h-5 w-5 text-muted-foreground" />} />
        <Link href="/log-mood" className="lg:col-start-3">
          <Card className="flex h-full flex-col items-center justify-center bg-primary/20 hover:bg-primary/30 transition-colors border-2 border-dashed border-primary">
            <div className="flex items-center gap-2 text-primary-foreground font-semibold">
              <PlusCircle className="h-6 w-6" />
              <span>Log Today's Mood</span>
            </div>
          </Card>
        </Link>
      </div>

      <MoodTrendAnalysis moods={moods} />

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Recent Moods</h2>
        {moods.length > 0 ? (
          <div className="space-y-4">
            {moods.slice(0, 5).map(mood => (
              <MoodCard key={mood.id} mood={mood} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">You haven't logged any moods yet.</p>
            <Button asChild variant="link">
              <Link href="/log-mood">Log your first mood</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
