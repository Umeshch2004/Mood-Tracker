'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/stat-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function DashboardPage() {
  const { user, entries, deleteEntry } = useAuth();

  const averageMood = entries.length > 0 ? (entries.reduce((acc, entry) => acc + entry.mood, 0) / entries.length).toFixed(1) : 'N/A';
  const averageSleep = entries.length > 0 ? (entries.reduce((acc, entry) => acc + entry.sleep, 0) / entries.length).toFixed(1) : 'N/A';

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-headline">Welcome back, {user?.name || user?.email?.split('@')[0]}!</h1>
          <p className="text-muted-foreground">Here's a look at your health journal.</p>
        </div>
        <Button asChild>
          <Link href="/add-entry">
            <PlusCircle />
            <span>Add New Entry</span>
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard title="Average Mood (1-10)" value={averageMood} />
        <StatCard title="Average Sleep (hours)" value={averageSleep} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Entries</CardTitle>
          <CardDescription>A log of your daily health metrics.</CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Mood</TableHead>
                    <TableHead>Sleep</TableHead>
                    <TableHead>Stress</TableHead>
                    <TableHead>Symptoms</TableHead>
                    <TableHead>Drugs</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map(entry => (
                    <TableRow key={entry.id}>
                      <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                      <TableCell>{entry.mood}/10</TableCell>
                      <TableCell>{entry.sleep}h</TableCell>
                      <TableCell>{entry.stress}/10</TableCell>
                      <TableCell>{entry.symptoms}/10</TableCell>
                      <TableCell className="max-w-xs truncate">{entry.drugNames || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="ghost" size="icon">
                            <Link href={`/edit-entry/${entry.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                           <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your entry.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteEntry(entry.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">You haven't logged any entries yet.</p>
              <Button asChild variant="link">
                <Link href="/add-entry">Log your first entry</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
