
'use client';

import { useState } from 'react';
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
import { summarizeText } from '@/ai/flows/summarize-flow';

export function Editor() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const { toast } = useToast();

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

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <Input
            placeholder="Untitled Note"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 h-auto p-0 font-headline"
            disabled={isAiLoading}
          />
        </div>
        <div className="flex items-center gap-1 p-2 border-b sticky top-0 bg-card/80 backdrop-blur-sm z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={isAiLoading}>
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
              <DropdownMenuItem>Generate outline</DropdownMenuItem>
              <DropdownMenuItem>Rewrite</DropdownMenuItem>
              <DropdownMenuItem>Improve tone</DropdownMenuItem>
              <DropdownMenuItem>Extract action items</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
        <div className="p-4 prose prose-sm max-w-none">
          <Textarea
            placeholder="Start writing your brilliant ideas..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[60vh] w-full resize-none border-none focus-visible:ring-0 p-0 text-base"
            disabled={isAiLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
