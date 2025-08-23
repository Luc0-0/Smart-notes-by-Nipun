
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
  Calendar as CalendarIcon,
  Link as LinkIcon,
  Book,
  ShoppingCart,
  Flame,
  Trash2,
  Archive,
  ArchiveRestore,
  Tags,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
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
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/firebase/auth-provider';
import { addNote, updateNote, deleteNote } from '@/lib/firebase/firestore';
import type { Note } from '@/lib/types';
import { summarizeText } from '@/ai/flows/summarize-flow';
import { generateOutline } from '@/ai/flows/outline-flow';
import { rewriteText } from '@/ai/flows/rewrite-flow';
import { improveTone } from '@/ai/flows/improve-tone-flow';
import { extractActionItems } from '@/ai/flows/extract-action-items-flow';
import { generateTags } from '@/ai/flows/generate-tags-flow';
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
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState('');
  
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

  const [isArchived, setIsArchived] = useState(note?.isArchived || false);
  const [notebookId, setNotebookId] = useState<Note['notebookId']>(getInitialNotebookId());
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotebookId(getInitialNotebookId());
  }, [note, searchParams]);
  
  const handleAiAction = async (
    action: (input: any) => Promise<any>,
    input: any,
    messages: { loading: string, success: string, error: string }
  ) => {
    const textToProcess = content || projectIdeas;
     if (!textToProcess) {
      toast({
        variant: 'destructive',
        title: 'Cannot perform action',
        description: 'Please enter some content first.',
      });
      return;
    }

    setIsAiLoading(true);
    toast({ title: messages.loading });
    try {
      const result = await action({ ...input, text: textToProcess });
      
      if (result.rewrittenText) {
        setContent(result.rewrittenText);
      } else if (result.summary) {
        setContent(result.summary);
      } else if (result.outline) {
        setContent((prev) => prev + '\n\n' + result.outline);
      } else if (result.actionItems) {
        const newActionItems = result.actionItems.map((text: string) => ({ id: new Date().toISOString() + text, text, checked: false }));
        setActionItems(prev => [...prev, ...newActionItems]);
      }

      toast({ title: messages.success });
    } catch (error) {
      console.error(`${messages.error} error:`, error);
      toast({
        variant: 'destructive',
        title: `${messages.error} failed`,
        description: 'An error occurred. Please try again.',
      });
    } finally {
      setIsAiLoading(false);
    }
  }

  const handleRewrite = () => handleAiAction(rewriteText, {}, { loading: 'Rewriting...', success: 'Rewritten!', error: 'Rewrite' });
  const handleSummarize = () => handleAiAction(summarizeText, {}, { loading: 'Summarizing...', success: 'Summarized!', error: 'Summarization' });
  const handleGenerateOutline = async () => {
    if (!title) {
      toast({ variant: 'destructive', title: 'Please enter a title first.' });
      return;
    }
    setIsAiLoading(true);
    toast({ title: 'Generating outline...' });
    try {
      const { outline } = await generateOutline({ title });
      setContent((prev) => (prev ? prev + '\n\n' : '') + outline);
      toast({ title: 'Outline generated!' });
    } catch (error) {
      console.error('Outline error:', error);
      toast({ variant: 'destructive', title: 'Outline generation failed.' });
    } finally {
      setIsAiLoading(false);
    }
  };
  const handleImproveTone = (tone: string) => handleAiAction(improveTone, { tone }, { loading: `Changing tone to ${tone}...`, success: 'Tone improved!', error: 'Tone improvement' });
  const handleExtractActionItems = () => handleAiAction(extractActionItems, {}, { loading: 'Extracting action items...', success: 'Action items extracted!', error: 'Extraction' });


  const handleSave = async (autoSave = false) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'You must be logged in to save.' });
        return;
    }
    setIsSaving(true);

    const noteContentForTags = [title, content, projectIdeas].filter(Boolean).join('\n');
    let finalTags = tags;

    if (!autoSave && noteContentForTags) {
      try {
        const result = await generateTags({ text: noteContentForTags });
        const newTags = result.tags.filter(tag => !finalTags.includes(tag));
        finalTags = [...finalTags, ...newTags];
      } catch (error) {
        console.error("Auto-tagging error:", error);
      }
    }


    const baseNoteData = {
        title,
        content,
        userId: user.uid,
        notebookId,
        tags: finalTags,
        isArchived,
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
        await updateNote(note.id, noteData);
        if (!autoSave) toast({ title: 'Note Updated!', description: 'Your changes have been saved.' });
      } else {
        const { id: newNoteId } = await addNote(noteData);
        if (!autoSave) toast({ title: 'Note Saved!', description: 'Your new note has been created.' });
        router.replace(`/app/notes/${newNoteId}`);
      }
    } catch (error) {
        console.error("Save error:", error);
        if (!autoSave) toast({ variant: 'destructive', title: 'Save failed', description: 'Could not save your note. Please try again.' });
    } finally {
        setIsSaving(false);
    }
  }

  const handleDelete = async () => {
    if (!note?.id) return;
    setIsSaving(true);
    try {
      await deleteNote(note.id);
      toast({ title: 'Note Deleted', description: 'Your note has been moved to the trash.' });
      router.push('/app/notes');
    } catch (error) {
      console.error("Delete error:", error);
      toast({ variant: 'destructive', title: 'Delete failed', description: 'Could not delete the note.' });
    } finally {
      setIsSaving(false);
    }
  }

  const handleArchiveToggle = async () => {
    if (!note?.id) return;
    const newArchivedState = !isArchived;
    setIsArchived(newArchivedState);
    await updateNote(note.id, { isArchived: newArchivedState });
    toast({ title: newArchivedState ? 'Note Archived' : 'Note Restored' });
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };


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
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Input
            placeholder="Untitled Note"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 h-auto p-0 font-headline bg-transparent"
            disabled={isAiLoading || isSaving}
          />
          <div className="flex items-center gap-2 self-end sm:self-center">
            {note?.id && (
              <>
                 <Button variant="outline" size="icon" onClick={handleArchiveToggle} disabled={isAiLoading || isSaving}>
                  {isArchived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" disabled={isAiLoading || isSaving}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your note.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
            <Button onClick={() => handleSave(false)} disabled={isAiLoading || isSaving || !title}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        </div>
        
        {notebookId === 'meetings' && renderMeetingFields()}
        {notebookId === 'projects' && renderProjectFields()}
        {notebookId === 'personal' && renderPersonalFields()}


        <div className="flex items-center justify-between gap-1 p-2 border-b sticky top-0 bg-card/80 backdrop-blur-sm z-10 flex-wrap">
          <div className="flex-1 flex items-center">
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
                <DropdownMenuItem onClick={handleRewrite}>Rewrite</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Improve tone</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => handleImproveTone('professional')}>Professional</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleImproveTone('casual')}>Casual</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleImproveTone('confident')}>Confident</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExtractActionItems} disabled={notebookId !== 'meetings'}>
                  Extract action items
                </DropdownMenuItem>
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
        <div className="p-4 border-t">
          <Label className="flex items-center gap-2 mb-2"><Tags className="w-4 h-4"/> Tags</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="pl-3 pr-1">
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 text-destructive">
                  <X className="h-3 w-3"/>
                </button>
              </Badge>
            ))}
             <Input 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add a tag..."
              className="h-7 w-auto flex-1 min-w-[100px] border-none shadow-none focus-visible:ring-0 bg-transparent"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
