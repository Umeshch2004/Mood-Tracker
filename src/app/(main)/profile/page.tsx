'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email(),
});

export default function ProfilePage() {
  const { user, entries, updateUser } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateUser(values.name);
    toast({ title: 'Profile updated!', description: 'Your name has been changed.' });
  };

  return (
    <div className="flex justify-center">
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Your Profile</CardTitle>
                <CardDescription>Manage your account settings.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 rounded-lg border bg-secondary p-4">
                    <p className="text-sm font-medium text-secondary-foreground">Total Entries Logged</p>
                    <p className="text-3xl font-bold text-secondary-foreground">{entries.length}</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                            <Input placeholder="Your Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <Input readOnly disabled {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className='flex justify-end'>
                        <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>Save Changes</Button>
                    </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
