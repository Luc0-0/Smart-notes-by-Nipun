import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UserNav } from '@/components/user-nav';
import { SidebarTrigger } from '@/components/ui/sidebar';

type HeaderProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

export function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-lg px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search notes..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <UserNav />
    </header>
  );
}
