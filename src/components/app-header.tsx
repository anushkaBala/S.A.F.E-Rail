"use client";

import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const pathToTitle: { [key: string]: string } = {
  '/dashboard': 'Dashboard',
  '/cctv': 'CCTV Analysis',
  '/identification': 'Child Identification',
  '/alerts': 'Alerts',
  '/admin': 'Admin Management',
};

export function AppHeader() {
  const pathname = usePathname();
  const title = pathToTitle[pathname] || 'S.A.F.E Rail';
  const { toast } = useToast();

  const handleNotificationClick = () => {
    toast({
      title: 'No new notifications',
      description: 'You are all caught up.',
    });
  };

  const handleMenuClick = (item: string) => {
    toast({
      title: `Navigating to ${item}`,
      description: 'This is a placeholder action.',
    });
  };

  return (
    <header className="flex items-center justify-between p-4 bg-card border-b h-16">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full" onClick={handleNotificationClick}>
          <Bell className="w-5 h-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative w-8 h-8 rounded-full">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://placehold.co/40x40.png" alt="@admin" data-ai-hint="person avatar" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleMenuClick('Profile')}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleMenuClick('Settings')}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleMenuClick('Logout')}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
