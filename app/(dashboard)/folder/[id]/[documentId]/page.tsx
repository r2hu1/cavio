import DocumentPageView from "@/modules/documents/views/ui/document-page-view";
import PageLoader from "@/modules/preloader/views/ui/page-loader";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";
import { Metadata } from "next";
import { Suspense } from "react";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ documentId: string }>;
}): Promise<Metadata> => {
  const { documentId } = await params;
  const caller = appRouter.createCaller(await createTRPCContext());
  const doc = await caller.document.get({ id: documentId });
  return {
    title: doc.title,
    description: `Personal document, updated on ${doc.updatedAt ? new Date(doc.updatedAt).toLocaleString() : "never"}`,
  };
};

export default function DocumentPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <DocumentPageView />
    </Suspense>
  );
}
