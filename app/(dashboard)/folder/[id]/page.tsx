import FolderPageView from "@/modules/folders/views/ui/folder-page-view";
import { Suspense } from "react";

export default function FolderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FolderPageView />
    </Suspense>
  );
}
