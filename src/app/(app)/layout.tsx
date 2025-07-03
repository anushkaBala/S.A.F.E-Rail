import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { LayoutDashboard, Video, ScanFace, Bell, Settings, Shield } from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import { Toaster } from '@/components/ui/toaster';
import { AnalysisProvider } from '@/context/AnalysisContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AnalysisProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3 p-2">
              <div className="p-2 rounded-lg bg-success text-success-foreground">
                <Shield className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-success group-data-[collapsible=icon]:hidden">S.A.F.E Rail</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="divide-y divide-success/30 border-y border-success/30">
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="CCTV Analysis">
                  <Link href="/cctv">
                    <Video />
                    <span className="group-data-[collapsible=icon]:hidden">CCTV Analysis</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Child Identification">
                  <Link href="/identification">
                    <ScanFace />
                    <span className="group-data-[collapsible=icon]:hidden">Child Identification</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Alerts">
                  <Link href="/alerts">
                    <Bell />
                    <span className="group-data-[collapsible=icon]:hidden">Alerts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Admin">
                  <Link href="/admin">
                    <Settings />
                    <span className="group-data-[collapsible=icon]:hidden">Admin</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <AppHeader />
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    </AnalysisProvider>
  );
}
