import DashboardHeader from "@/modules/header/views/ui";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/modules/sidebar/views/ui";
import { AuthProvider } from "@/modules/auth/providers/auth-context";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.premium.getActiveSubscription.queryOptions(),
  );
  void queryClient.prefetchQuery(trpc.premium.getFreeUsage.queryOptions());
  return (
    <AuthProvider>
      <SidebarProvider>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense>
            <ErrorBoundary fallback={<div>Error</div>}>
              <DashboardSidebar />
            </ErrorBoundary>
          </Suspense>
        </HydrationBoundary>
        <SidebarInset>
          <DashboardHeader />
          <div className="px-6 py-10">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}
