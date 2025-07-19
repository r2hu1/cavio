import FolderPageView from "@/modules/folders/views/ui/folder-page-view";
import { Suspense } from "react";

export default function FolderPage() {
  return (
    <Suspense>
      <FolderPageView />
    </Suspense>
  );
}
