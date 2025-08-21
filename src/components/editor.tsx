'use client';

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

export function Editor() {
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4 border-b">
           <Input
            placeholder="Untitled Note"
            className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 h-auto p-0 font-headline"
          />
        </div>
        <div className="flex items-center gap-1 p-2 border-b sticky top-0 bg-card/80 backdrop-blur-sm z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                AI Actions
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Summarize</DropdownMenuItem>
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
            className="min-h-[60vh] w-full resize-none border-none focus-visible:ring-0 p-0 text-base"
          />
        </div>
      </CardContent>
    </Card>
  );
}
