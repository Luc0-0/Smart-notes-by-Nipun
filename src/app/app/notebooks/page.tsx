
'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Briefcase, BrainCircuit, ShoppingCart, ArrowRight } from 'lucide-react';
import type { Notebook } from '@/lib/types';

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

export default function NotebooksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Notebooks</h1>
        <p className="text-muted-foreground">Organize your notes by category.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {notebooks.map((notebook) => (
          <Card key={notebook.id} className="transform transition-transform duration-300 hover:scale-102 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <div className="flex items-center gap-4">
                {notebook.icon}
                <div>
                  <CardTitle className="text-lg">{notebook.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{notebook.description}</p>
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
  );
}
