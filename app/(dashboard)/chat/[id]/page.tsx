import IdChatPageView from "@/modules/ai/views/ui/id-chat-page-view";
import PageLoader from "@/modules/preloader/views/ui/page-loader";
import { Suspense } from "react";

interface PageProps {
  params: {
    id: string;
  };
}
export default async function ChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const param = await params;
  return (
    <Suspense fallback={<PageLoader />}>
      <IdChatPageView params={param.id} />
    </Suspense>
  );
}
