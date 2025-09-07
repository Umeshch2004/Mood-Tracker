'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Slider } from '@/components/ui/slider';
import { useEffect } from 'react';

const formSchema = z.object({
  date: z.date({ required_error: 'A date is required.' }),
  sleep: z.number().min(0).max(24),
  stress: z.number().min(1).max(10),
  symptoms: z.number().min(1).max(10),
  mood: z.number().min(1).max(10),
  engagement: z.number().min(1).max(10),
  drugNames: z.string().optional(),
  notes: z.string().max(1000, 'Note must be 1000 characters or less.').optional(),
});

export default function EditEntryPage() {
  const router = useRouter();
  const params = useParams();
  const { getEntry, updateEntry, loading } = useAuth();
  const { toast } = useToast();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const entry = getEntry(id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (entry) {
      form.reset({
        ...entry,
        date: new Date(entry.date),
      });
    }
  }, [entry, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!id) return;
    updateEntry({
        ...values,
        id,
        date: values.date.toISOString(),
    });
    toast({ title: 'Entry updated!', description: 'Your health entry has been saved.' });
    router.push('/dashboard');
  };

  if (loading) {
    return <div className="flex justify-center mt-10"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  if (!entry) {
    return <div className="text-center mt-10"><p>Entry not found.</p><Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button></div>
  }

  return (
    <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Edit Health Entry</CardTitle>
                <CardDescription>Update your daily metrics.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                <FormLabel>Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[240px] pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                        date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="sleep" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sleep: {field.value} hours</FormLabel>
                                    <FormControl>
                                        <Slider
                                            min={0} max={24} step={0.5}
                                            value={[field.value]}
                                            onValueChange={(value) => field.onChange(value[0])}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="stress" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stress Level: {field.value}/10</FormLabel>
                                    <FormControl>
                                        <Slider
                                            min={1} max={10} step={1}
                                            value={[field.value]}
                                            onValueChange={(value) => field.onChange(value[0])}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="symptoms" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Symptoms: {field.value}/10</FormLabel>
                                    <FormControl>
                                        <Slider
                                            min={1} max={10} step={1}
                                            value={[field.value]}
                                            onValueChange={(value) => field.onChange(value[0])}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="mood" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mood: {field.value}/10</FormLabel>
                                    <FormControl>
                                        <Slider
                                            min={1} max={10} step={1}
                                            value={[field.value]}
                                            onValueChange={(value) => field.onChange(value[0])}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="engagement" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Engagement: {field.value}/10</FormLabel>
                                    <FormControl>
                                        <Slider
                                            min={1} max={10} step={1}
                                            value={[field.value]}
                                            onValueChange={(value) => field.onChange(value[0])}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}/>
                        </div>

                        <FormField control={form.control} name="drugNames" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Drug Names</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Aspirin, Ibuprofen" {...field} />
                                </FormControl>
                            </FormItem>
                        )}/>
                        
                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Notes (Optional)</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Any additional thoughts or details..." className="resize-y" {...field} />
                                </FormControl>
                            </FormItem>
                        )}/>

                        <div className='flex justify-end gap-2'>
                            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>Save Changes</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
