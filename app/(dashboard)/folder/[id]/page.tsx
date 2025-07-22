import FolderPageView from "@/modules/folders/views/ui/folder-page-view";
import PageLoader from "@/modules/preloader/views/ui/page-loader";
import { Suspense } from "react";

export default function FolderPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <FolderPageView />
    </Suspense>
  );
}
