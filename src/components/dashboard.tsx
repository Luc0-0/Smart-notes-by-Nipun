'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Book, Briefcase, BrainCircuit, ShoppingCart, ArrowRight } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/lib/firebase/auth-provider';
import { getRecentNotes } from '@/lib/firebase/firestore';
import { useMemo, memo, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Note, Notebook } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const notebooks: Notebook[] = [
  {
    id: 'general',
    title: 'General',
    description: 'Quick thoughts and daily reminders.',
    icon: <Book className="w-6 h-6 text-primary" />,
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Ideas and plans for work.',
    icon: <Briefcase className="w-6 h-6 text-primary" />,
  },
  {
    id: 'meetings',
    title: 'Meetings',
    description: 'Summaries and action items.',
    icon: <BrainCircuit className="w-6 h-6 text-primary" />,
  },
  {
    id: 'personal',
    title: 'Personal',
    description: 'Goals, journals, and tasks.',
    icon: <ShoppingCart className="w-6 h-6 text-primary" />,
  },
];

const getGreeting = () => {
  const hours = new Date().getHours();
  if (hours < 12) return 'Good morning';
  if (hours < 18) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard = memo(function Dashboard() {
  const { user } = useAuth();
  
  const { data: notes = [], isLoading: loading } = useQuery({
    queryKey: ['dashboard-notes', user?.uid],
    queryFn: () => user ? getRecentNotes(user.uid, 10) : [],
    enabled: !!user,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const { stats, recentNotes, userName } = useMemo(() => {
    if (!user || notes.length === 0) {
      return {
        userName: user?.displayName || 'User',
        stats: { totalNotes: 0, notesThisWeek: 0, mostActiveNotebookId: null, notebookCounts: {} },
        recentNotes: []
      };
    }
    
    const aWeekAgo = new Date();
    aWeekAgo.setDate(aWeekAgo.getDate() - 7);

    const notesThisWeek = notes.filter(n => (n.createdAt as Date) > aWeekAgo).length;
    const totalNotes = notes.length;

    const notebookCounts: Record<string, number> = {};
    notes.forEach(note => {
      notebookCounts[note.notebookId] = (notebookCounts[note.notebookId] || 0) + 1;
    });

    const mostActiveNotebookId = Object.keys(notebookCounts).length > 0
      ? Object.entries(notebookCounts).sort((a, b) => b[1] - a[1])[0][0]
      : null;

    const sortedRecentNotes = [...notes]
      .sort((a, b) => (b.updatedAt as Date).getTime() - (a.updatedAt as Date).getTime())
      .slice(0, 5);
      
    return {
      userName: user.displayName || 'User',
      stats: {
        totalNotes,
        notesThisWeek,
        mostActiveNotebookId,
        notebookCounts,
      },
      recentNotes: sortedRecentNotes
    };
  }, [user, notes]);
  
  const mostActiveNotebookName = stats.mostActiveNotebookId
    ? notebooks.find(n => n.id === stats.mostActiveNotebookId)?.title
    : 'N/A';
  
  const chartData = notebooks.map(nb => ({
    name: nb.title,
    total: stats.notebookCounts[nb.id] || 0,
  }));

  const greeting = getGreeting();
  
  if (loading) {
    return (
       <div className="space-y-8">
        <Skeleton className="h-9 w-1/2" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-1/3" /></CardContent>
            </Card>
          ))}
        </div>
        <div>
          <Skeleton className="h-8 w-1/4 mb-4" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
               <Card key={i} className="h-40">
                 <CardHeader><Skeleton className="h-6 w-full" /><Skeleton className="h-4 w-1/2 mt-2" /></CardHeader>
                 <CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3 mt-2" /></CardContent>
               </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">
            {greeting}, {userName}!
          </h1>
          <p className="text-muted-foreground">Let's make today productive.</p>
        </div>
        <Button asChild>
          <Link href="/app/notes/new">
            <PlusCircle className="mr-2" />
            New Note
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
             <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNotes}</div>
            <p className="text-xs text-muted-foreground">notes created across all notebooks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notes this Week</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.notesThisWeek}</div>
            <p className="text-xs text-muted-foreground">new notes in the last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Active Notebook</CardTitle>
             <BrainCircuit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostActiveNotebookName}</div>
            <p className="text-xs text-muted-foreground">Your most frequently used notebook</p>
          </CardContent>
        </Card>
      </div>
      
      {recentNotes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold font-headline">Recent Notes</h2>
           <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {recentNotes.map((note) => (
                <CarouselItem key={note.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                     <Link href={`/app/notes/${note.id}`} className="block h-full">
                      <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:border-primary/50 cursor-pointer h-full flex flex-col">
                        <CardHeader>
                          <CardTitle className="truncate">{note.title || 'Untitled Note'}</CardTitle>
                           <CardDescription>
                              Updated {formatDistanceToNow(new Date(note.updatedAt as Date), { addSuffix: true })}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                           <p className="text-foreground/70 line-clamp-2">
                              {note.content || note.projectIdeas || "No additional content."}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        </div>
      )}


      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold font-headline">Notebooks</h2>
            <div className="grid gap-4">
                {notebooks.map((notebook) => (
                     <Card key={notebook.id} className="transform transition-transform duration-300 hover:scale-102 hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                {notebook.icon}
                                <div>
                                    <CardTitle className="text-lg">{notebook.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{stats.notebookCounts[notebook.id] || 0} notes</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" asChild>
                                <Link href={`/app/notes?notebook=${notebook.id}`}>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
         <div className="space-y-4">
            <h2 className="text-2xl font-semibold font-headline">Notes Overview</h2>
             <Card>
                <CardHeader>
                    <CardTitle>Notes by Notebook</CardTitle>
                    <CardDescription>A summary of your note distribution.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                             <XAxis type="number" hide />
                             <YAxis 
                                dataKey="name" 
                                type="category" 
                                tickLine={false} 
                                axisLine={false} 
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                interval={0}
                                width={80}
                            />
                            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
});

export { Dashboard };
