'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { MoodValue } from '@/lib/types';

const moodOptions: MoodValue[] = ['happy', 'sad', 'angry', 'stressed', 'excited'];

const formSchema = z.object({
  mood: z.enum(moodOptions, { required_error: 'Please select a mood.' }),
  note: z.string().max(500, 'Note must be 500 characters or less.').optional(),
});

export default function LogMoodPage() {
  const router = useRouter();
  const { addMood } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      note: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addMood(values.mood, values.note);
    toast({ title: 'Mood logged!', description: 'Your mood has been saved.' });
    router.push('/dashboard');
  };

  return (
    <div className="flex justify-center">
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">How are you feeling?</CardTitle>
                <CardDescription>Log your current mood to keep track of your emotional well-being.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="mood"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Today's Mood</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a mood" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {moodOptions.map(mood => (
                                <SelectItem key={mood} value={mood} className="capitalize">{mood}</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="note"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Note (Optional)</FormLabel>
                            <FormControl>
                            <Textarea placeholder="Any thoughts to add?" className="resize-none" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className='flex justify-end gap-2'>
                        <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>Save Mood</Button>
                    </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
