
import Link from 'next/link';
import {
  Notebook,
  Tag,
  Archive,
  Settings,
  BrainCircuit,
  File,
  Home,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';

const menuItems = [
  { href: '/app', icon: <Home />, label: 'Dashboard' },
  { href: '/app/notes', icon: <File />, label: 'All Notes' },
  { href: '/app/notebooks', icon: <Notebook />, label: 'Notebooks' },
  { href: '/app/tags', icon: <Tag />, label: 'Tags' },
  { href: '/app/archive', icon: <Archive />, label: 'Archive' },
];

export function SidebarNav() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
            <BrainCircuit className="h-8 w-8 text-primary" />
            <span className="text-lg font-semibold whitespace-nowrap group-data-[collapsible=icon]:hidden">Smart Notes</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                tooltip={item.label}
                // A real implementation would use usePathname() to check for active state
                // For now, we'll just show the first item as active for demonstration
                isActive={item.href === '/app/notes'} 
              >
                <Link href={item.href}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings">
                <Link href="/app/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
