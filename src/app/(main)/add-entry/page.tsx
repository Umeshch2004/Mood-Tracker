'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Slider } from '@/components/ui/slider';

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

export default function AddEntryPage() {
  const router = useRouter();
  const { addEntry } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      sleep: 8,
      stress: 5,
      symptoms: 5,
      mood: 5,
      engagement: 5,
      drugNames: '',
      notes: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addEntry({
        ...values,
        date: values.date.toISOString(),
    });
    toast({ title: 'Entry added!', description: 'Your new health entry has been saved.' });
    router.push('/dashboard');
  };

  return (
    <div className="flex justify-center">
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Add New Health Entry</CardTitle>
                <CardDescription>Log your daily metrics to track your well-being.</CardDescription>
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
                                            defaultValue={[field.value]}
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
                                            defaultValue={[field.value]}
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
                                            defaultValue={[field.value]}
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
                                            defaultValue={[field.value]}
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
                                            defaultValue={[field.value]}
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
                            <Button type="submit" disabled={form.formState.isSubmitting}>Add Entry</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
