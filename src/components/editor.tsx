
'use client';

import { useState, useEffect } from 'react';
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
  CalendarIcon,
  Link as LinkIcon,
  Book,
  ShoppingCart,
  Flame,
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
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/firebase/auth-provider';
import { addNote, updateNote } from '@/lib/firebase/firestore';
import type { Note } from '@/lib/types';
import { summarizeText } from '@/ai/flows/summarize-flow';
import { generateOutline } from '@/ai/flows/outline-flow';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Checklist, type ChecklistItemType } from '@/components/ui/checklist';

type EditorProps = {
  note?: Note | null;
};

export function Editor({ note }: EditorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const getInitialNotebookId = () => {
    if (note?.notebookId) return note.notebookId;
    const notebookIdFromUrl = searchParams.get('notebook');
    if (['general', 'projects', 'meetings', 'personal'].includes(notebookIdFromUrl as string)) {
      return notebookIdFromUrl as Note['notebookId'];
    }
    return 'general';
  }

  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  
  // Meeting specific state
  const [meetingDate, setMeetingDate] = useState<Date | undefined>(
    note?.meetingDate instanceof Date ? note.meetingDate : (note?.meetingDate as any)?.toDate() ?? undefined
  );
  const [meetingLink, setMeetingLink] = useState(note?.meetingLink || '');
  const [discussionTopics, setDiscussionTopics] = useState<ChecklistItemType[]>(note?.discussionTopics || []);
  const [actionItems, setActionItems] = useState<ChecklistItemType[]>(note?.actionItems || []);

  // Project specific state
  const [projectFeatures, setProjectFeatures] = useState<ChecklistItemType[]>(note?.projectFeatures || []);
  const [projectIdeas, setProjectIdeas] = useState(note?.projectIdeas || '');
  const [projectTimeline, setProjectTimeline] = useState(note?.projectTimeline || '');

  // Personal specific state
  const [habitName, setHabitName] = useState(note?.habitName || '');
  const [habitGoal, setHabitGoal] = useState(note?.habitGoal || '');
  const [habitStreak, setHabitStreak] = useState(note?.habitStreak || 0);
  const [groceryList, setGroceryList] = useState<ChecklistItemType[]>(note?.groceryList || []);
  const [collectionType, setCollectionType] = useState(note?.collectionType || '');
  const [collectionItems, setCollectionItems] = useState<ChecklistItemType[]>(note?.collectionItems || []);


  const [notebookId, setNotebookId] = useState<Note['notebookId']>(getInitialNotebookId());
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotebookId(getInitialNotebookId());
  }, [note, searchParams]);
  
  const handleSummarize = async () => {
    const textToSummarize = content || projectIdeas;
    if (!textToSummarize) {
      toast({
        variant: 'destructive',
        title: 'Cannot summarize',
        description: 'Please enter some content to summarize.',
      });
      return;
    }
    setIsAiLoading(true);
    try {
      const result = await summarizeText({ text: textToSummarize });
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

    const baseNoteData = {
        title,
        content,
        userId: user.uid,
        notebookId,
    };

    const noteData: Partial<Note> = { ...baseNoteData };

    if (notebookId === 'meetings') {
        if (meetingDate) noteData.meetingDate = meetingDate;
        if (meetingLink) noteData.meetingLink = meetingLink;
        if (discussionTopics.length > 0) noteData.discussionTopics = discussionTopics;
        if (actionItems.length > 0) noteData.actionItems = actionItems;
    } else if (notebookId === 'projects') {
        if (projectFeatures.length > 0) noteData.projectFeatures = projectFeatures;
        if (projectIdeas) noteData.projectIdeas = projectIdeas;
        if (projectTimeline) noteData.projectTimeline = projectTimeline;
    } else if (notebookId === 'personal') {
        if (habitName) noteData.habitName = habitName;
        if (habitGoal) noteData.habitGoal = habitGoal;
        if (habitStreak) noteData.habitStreak = habitStreak;
        if (groceryList.length > 0) noteData.groceryList = groceryList;
        if (collectionType) noteData.collectionType = collectionType;
        if (collectionItems.length > 0) noteData.collectionItems = collectionItems;
    }
    
    try {
      if (note?.id) {
        // Update existing note - pass the cleaned noteData object
        await updateNote(note.id, noteData);
        toast({ title: 'Note Updated!', description: 'Your changes have been saved.' });
      } else {
        // Create new note - pass the cleaned noteData object
        const { id: newNoteId } = await addNote(noteData);
        toast({ title: 'Note Saved!', description: 'Your new note has been created.' });
        router.replace(`/app/notes/${newNoteId}`);
      }
    } catch (error) {
        console.error("Save error:", error);
        toast({ variant: 'destructive', title: 'Save failed', description: 'Could not save your note. Please try again.' });
    } finally {
        setIsSaving(false);
    }
  }

  const renderMeetingFields = () => (
    <div className="space-y-6 p-4 border-b">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <Label htmlFor="meetingDate" className="flex items-center gap-2"><CalendarIcon className="w-4 h-4" /> Meeting Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="meetingDate"
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !meetingDate && "text-muted-foreground"
                            )}
                        >
                        {meetingDate ? format(meetingDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={meetingDate}
                        onSelect={setMeetingDate}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label htmlFor="meetingLink" className="flex items-center gap-2"><LinkIcon className="w-4 h-4" /> Meeting Link</Label>
                <Input id="meetingLink" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="https://..." />
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="discussionTopics">Discussion Topics</Label>
            <Checklist items={discussionTopics} onChange={setDiscussionTopics} placeholder="Add a topic..." />
        </div>
        <div className="space-y-2">
            <Label htmlFor="actionItems">Action Items</Label>
            <Checklist items={actionItems} onChange={setActionItems} placeholder="Add an action item..." />
        </div>
    </div>
  );

  const renderProjectFields = () => (
      <div className="space-y-6 p-4 border-b">
        <div className="space-y-2">
            <Label htmlFor="projectFeatures">Features & Requirements</Label>
            <Checklist items={projectFeatures} onChange={setProjectFeatures} placeholder="Add a feature or requirement..." />
        </div>
        <div className="space-y-2">
            <Label htmlFor="projectIdeas">Brainstorming & Ideas</Label>
            <Textarea id="projectIdeas" value={projectIdeas} onChange={(e) => setProjectIdeas(e.target.value)} placeholder="Jot down random ideas, inspirations, and potential approaches..." className="min-h-[120px]" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="projectTimeline">Timeline & Milestones</Label>
            <Textarea id="projectTimeline" value={projectTimeline} onChange={(e) => setProjectTimeline(e.target.value)} placeholder="Phase 1: ... (due EOW)&#10;Phase 2: ... (next week)" className="min-h-[120px]" />
        </div>
    </div>
  );
  
  const renderPersonalFields = () => (
    <div className="space-y-8 p-4 border-b">
      {/* Habit Tracker */}
      <div className="space-y-4 p-4 rounded-lg border bg-card/50">
        <h3 className="font-semibold flex items-center gap-2"><Flame className="w-5 h-5 text-primary" /> Habit Tracker</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="habitName">Habit</Label>
            <Input id="habitName" value={habitName} onChange={(e) => setHabitName(e.target.value)} placeholder="e.g., Read for 15 minutes" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="habitGoal">Goal</Label>
            <Input id="habitGoal" value={habitGoal} onChange={(e) => setHabitGoal(e.target.value)} placeholder="e.g., Daily" />
          </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="habitStreak">Current Streak (days)</Label>
            <Input id="habitStreak" type="number" value={habitStreak} onChange={(e) => setHabitStreak(Number(e.target.value))} placeholder="0" />
        </div>
      </div>

      {/* Grocery List */}
      <div className="space-y-2 p-4 rounded-lg border bg-card/50">
        <h3 className="font-semibold flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-primary" /> Grocery List</h3>
        <Checklist items={groceryList} onChange={setGroceryList} placeholder="Add a grocery item..." />
      </div>

      {/* Collections */}
      <div className="space-y-4 p-4 rounded-lg border bg-card/50">
        <h3 className="font-semibold flex items-center gap-2"><Book className="w-5 h-5 text-primary" /> Collections</h3>
        <div className="space-y-2">
            <Label htmlFor="collectionType">Collection Type</Label>
            <Input id="collectionType" value={collectionType} onChange={(e) => setCollectionType(e.target.value)} placeholder="e.g., Books to Read, Movies to Watch" />
        </div>
        <div className="space-y-2">
            <Label htmlFor="collectionItems">Items</Label>
            <Checklist items={collectionItems} onChange={setCollectionItems} placeholder="Add a collection item..." />
        </div>
      </div>
    </div>
  );


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
        
        {notebookId === 'meetings' && renderMeetingFields()}
        {notebookId === 'projects' && renderProjectFields()}
        {notebookId === 'personal' && renderPersonalFields()}


        <div className="flex items-center justify-between gap-1 p-2 border-b sticky top-0 bg-card/80 backdrop-blur-sm z-10">
          <div className="flex-1">
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

          <div className="flex items-center gap-1 justify-end">
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
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            {notebookId === 'general' ? 'Note Content' : 'Additional Notes'}
          </Label>
          <Textarea
            placeholder="Start writing your brilliant ideas..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[40vh] w-full resize-none border-none focus-visible:ring-0 p-0 text-base bg-transparent"
            disabled={isAiLoading || isSaving}
          />
        </div>
      </CardContent>
    </Card>
  );
}
