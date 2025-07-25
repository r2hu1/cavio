import DocumentPageView from "@/modules/documents/views/ui/document-page-view";
import PageLoader from "@/modules/preloader/views/ui/page-loader";
import { Suspense } from "react";

export default function DocumentPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <DocumentPageView />
    </Suspense>
  );
}
