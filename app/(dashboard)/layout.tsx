import DashboardHeader from "@/modules/header/views/ui";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/modules/sidebar/views/ui";
import { AuthProvider } from "@/modules/auth/providers/auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <DashboardHeader />
          <div>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
