'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Smile } from 'lucide-react';

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const { login, signup } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isLogin) {
      const success = login(values.email, values.password);
      if (success) {
        toast({ title: 'Login successful!', description: "Welcome back." });
        router.push('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Login failed.',
          description: 'Please check your email and password.',
        });
      }
    } else {
      const success = signup(values.email, values.password, values.name || values.email.split('@')[0]);
      if (success) {
        toast({ title: 'Signup successful!', description: "Welcome to MoodJournal." });
        router.push('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Signup failed.',
          description: 'An account with this email may already exist.',
        });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary rounded-full p-2 w-fit mb-2">
            <Smile className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-headline">{isLogin ? 'Welcome Back!' : 'Create an Account'}</CardTitle>
          <CardDescription>{isLogin ? 'Log in to track your mood.' : 'Join to start tracking your mood.'}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {!isLogin && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full transition-all" disabled={form.formState.isSubmitting}>
                {isLogin ? 'Log In' : 'Sign Up'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="p-0 h-auto">
              {isLogin ? 'Sign Up' : 'Log In'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
