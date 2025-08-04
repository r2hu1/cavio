import NewChatPageView from "@/modules/ai/views/ui/new-chat-page-view";
import PageLoader from "@/modules/preloader/views/ui/page-loader";
import { Suspense } from "react";

export default function ChatPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <NewChatPageView />
    </Suspense>
  );
}
