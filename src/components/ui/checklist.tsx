
'use client';

import { useState, useEffect, useRef } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ChecklistItemType = {
  id: string;
  text: string;
  checked: boolean;
};

type ChecklistProps = {
  items: ChecklistItemType[];
  onChange: (items: ChecklistItemType[]) => void;
  placeholder?: string;
};

export function Checklist({ items, onChange, placeholder = "Add an item..." }: ChecklistProps) {
  const [internalItems, setInternalItems] = useState(items);
  const newItemInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInternalItems(items);
  }, [items]);

  const updateItems = (newItems: ChecklistItemType[]) => {
    setInternalItems(newItems);
    onChange(newItems);
  };

  const handleAddItem = () => {
    const newItemText = newItemInputRef.current?.value.trim();
    if (newItemText) {
      const newItem: ChecklistItemType = {
        id: new Date().toISOString(),
        text: newItemText,
        checked: false,
      };
      updateItems([...internalItems, newItem]);
      if (newItemInputRef.current) {
        newItemInputRef.current.value = '';
      }
    }
    newItemInputRef.current?.focus();
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddItem();
    }
  };

  const handleToggleChecked = (id: string) => {
    const newItems = internalItems.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    updateItems(newItems);
  };

  const handleTextChange = (id: string, newText: string) => {
    const newItems = internalItems.map((item) =>
      item.id === id ? { ...item, text: newText } : item
    );
    updateItems(newItems);
  };

  const handleDeleteItem = (id: string) => {
    const newItems = internalItems.filter((item) => item.id !== id);
    updateItems(newItems);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2">
        {internalItems.map((item) => (
          <div key={item.id} className="flex items-center gap-2 group">
            <Checkbox
              id={`item-${item.id}`}
              checked={item.checked}
              onCheckedChange={() => handleToggleChecked(item.id)}
              className="mt-1"
            />
            <Input
              type="text"
              value={item.text}
              onChange={(e) => handleTextChange(item.id, e.target.value)}
              className={cn(
                "flex-1 h-auto py-1 border-none shadow-none focus-visible:ring-0 bg-transparent",
                item.checked ? "line-through text-muted-foreground" : ""
              )}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100"
              onClick={() => handleDeleteItem(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
       <div className="flex items-center gap-2 pt-2">
        <Input
          ref={newItemInputRef}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="h-9"
        />
        <Button onClick={handleAddItem} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </div>
    </div>
  );
}
