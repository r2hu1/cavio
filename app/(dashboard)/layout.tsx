import DashboardHeader from "@/modules/header/views/ui";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
          <div className="px-6 max-w-3xl w-full mx-auto py-10">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
