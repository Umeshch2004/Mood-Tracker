'use client';

import { useState } from 'react';
import { analyzeMoodTrends } from '@/ai/flows/mood-trend-analysis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import type { Mood } from '@/lib/types';

interface MoodTrendAnalysisProps {
  moods: Mood[];
}

export default function MoodTrendAnalysis({ moods }: MoodTrendAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    const formattedMoods = moods.map(m => ({
        mood: m.mood,
        note: m.note || '',
        timestamp: m.timestamp,
    }));

    try {
      const result = await analyzeMoodTrends({ moodLogs: formattedMoods });
      setAnalysis(result.trendSummary);
    } catch (e) {
      setError('Sorry, something went wrong while analyzing your moods.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Sparkles className="h-6 w-6 text-accent" />
          AI Mood Trend Analysis
        </CardTitle>
        <CardDescription>Get an AI-powered summary of your recent mood patterns.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {moods.length < 3 ? (
            <p className="text-sm text-muted-foreground">
                Log at least 3 moods to unlock AI analysis.
            </p>
        ) : (
            <Button onClick={handleAnalyze} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {loading ? 'Analyzing...' : 'Analyze My Moods'}
            </Button>
        )}
        
        {analysis && (
            <div className="p-4 bg-secondary rounded-md border">
                <p className="text-secondary-foreground">{analysis}</p>
            </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
