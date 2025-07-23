import AccountPageView from "@/modules/account/views/ui/account-page-view";
import PageLoader from "@/modules/preloader/views/ui/page-loader";
import { Suspense } from "react";

export default async function AccountPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <AccountPageView />
    </Suspense>
  );
}
