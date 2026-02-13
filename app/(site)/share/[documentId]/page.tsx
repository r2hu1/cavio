import SharedDocumentView from "@/modules/documents/views/ui/shared-document-view";
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
  try {
    const doc = await caller.document.getShared({ id: documentId });
    return {
      title: `${doc.title} - Shared Document`,
      description: `Shared document, updated on ${doc.updatedAt ? new Date(doc.updatedAt).toLocaleString() : "never"}`,
    };
  } catch {
    return {
      title: "Shared Document",
      description: "This document is not available or is private.",
    };
  }
};

export default function SharedDocumentPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SharedDocumentView />
    </Suspense>
  );
}
