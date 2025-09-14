import PageLoader from "@/modules/preloader/views/ui/page-loader";
import DangerPageView from "@/modules/settings/views/danger-page.view";
import { Suspense } from "react";

export default async function SessionsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <DangerPageView />
    </Suspense>
  );
}
