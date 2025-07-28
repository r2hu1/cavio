import DashboardHeader from "@/modules/header/views/ui";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/modules/sidebar/views/ui";
import { AuthProvider } from "@/modules/auth/providers/auth-context";
import { EditorStateProvider } from "@/modules/editor/providers/editor-state-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider className="overflow-x-hidden">
        <EditorStateProvider>
          <DashboardSidebar />
          <SidebarInset>
            <DashboardHeader />
            <div className="px-6 md:px-10 lg:px-32 py-10">{children}</div>
          </SidebarInset>
        </EditorStateProvider>
      </SidebarProvider>
    </AuthProvider>
  );
}
