
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Sparkles,
  ChevronDown,
  Loader2,
  Save,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/firebase/auth-provider';
import { addNote, updateNote } from '@/lib/firebase/firestore';
import type { Note } from '@/lib/types';
import { summarizeText } from '@/ai/flows/summarize-flow';
import { generateOutline } from '@/ai/flows/outline-flow';

type EditorProps = {
  note?: Note | null;
};

export function Editor({ note }: EditorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSummarize = async () => {
    if (!content) {
      toast({
        variant: 'destructive',
        title: 'Cannot summarize',
        description: 'Please enter some content to summarize.',
      });
      return;
    }
    setIsAiLoading(true);
    try {
      const result = await summarizeText({ text: content });
      setContent(result.summary);
      toast({
        title: 'Summarized!',
        description: 'The note content has been summarized.',
      });
    } catch (error) {
      console.error('Summarization error:', error);
      toast({
        variant: 'destructive',
        title: 'Summarization failed',
        description:
          'An error occurred while summarizing the text. Please try again.',
      });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const handleGenerateOutline = async () => {
    if (!title) {
      toast({
        variant: 'destructive',
        title: 'Cannot generate outline',
        description: 'Please enter a title for your note first.',
      });
      return;
    }
    setIsAiLoading(true);
    try {
      const result = await generateOutline({ title });
      setContent((prevContent) => prevContent + '\n\n' + result.outline);
      toast({
        title: 'Outline Generated!',
        description: 'An outline has been added to your note.',
      });
    } catch (error) {
      console.error('Outline generation error:', error);
      toast({
        variant: 'destructive',
        title: 'Outline generation failed',
        description: 'An error occurred. Please try again.',
      });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const handleSave = async () => {
    if (!user) {
        toast({ variant: 'destructive', title: 'You must be logged in to save.' });
        return;
    }
    setIsSaving(true);
    
    try {
      if (note?.id) {
        // Update existing note
        await updateNote(note.id, { title, content });
        toast({ title: 'Note Updated!', description: 'Your changes have been saved.' });
      } else {
        // Create new note
        const notebookId = searchParams.get('notebook') || 'general';
        const { id: newNoteId } = await addNote({ 
            title, 
            content, 
            userId: user.uid, 
            notebookId: notebookId as Note['notebookId']
        });
        toast({ title: 'Note Saved!', description: 'Your new note has been created.' });
        // Redirect to the new note's page
        router.replace(`/app/notes/${newNoteId}`);
      }
    } catch (error) {
        console.error("Save error:", error);
        toast({ variant: 'destructive', title: 'Save failed', description: 'Could not save your note. Please try again.' });
    } finally {
        setIsSaving(false);
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-2xl overflow-hidden glass">
      <CardContent className="p-0">
        <div className="p-4 border-b flex justify-between items-center gap-4">
          <Input
            placeholder="Untitled Note"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 h-auto p-0 font-headline bg-transparent"
            disabled={isAiLoading || isSaving}
          />
          <Button onClick={handleSave} disabled={isAiLoading || isSaving || !title}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save
          </Button>
        </div>
        <div className="flex items-center justify-between gap-1 p-2 border-b sticky top-0 bg-card/80 backdrop-blur-sm z-10">
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isAiLoading || isSaving}>
                  {isAiLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2 text-primary" />
                  )}
                  AI Actions
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleSummarize}>
                  Summarize
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleGenerateOutline}>
                  Generate outline
                </DropdownMenuItem>
                <DropdownMenuItem disabled>Rewrite</DropdownMenuItem>
                <DropdownMenuItem disabled>Improve tone</DropdownMenuItem>
                <DropdownMenuItem disabled>Extract action items</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-1">
            <Separator orientation="vertical" className="h-6 mx-2" />

            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Code className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6 mx-2" />

            <Button variant="ghost" size="icon" className="h-8 w-8">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Quote className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="p-4">
          <Textarea
            placeholder="Start writing your brilliant ideas..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[60vh] w-full resize-none border-none focus-visible:ring-0 p-0 text-base bg-transparent"
            disabled={isAiLoading || isSaving}
          />
        </div>
      </CardContent>
    </Card>
  );
}
