import FolderPageView from "@/modules/folders/views/ui/folder-page-view";
import PageLoader from "@/modules/preloader/views/ui/page-loader";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routers/_app";
import { trpc } from "@/trpc/server";
import { Metadata } from "next";
import { Suspense } from "react";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> => {
  const { id } = await params;
  const caller = appRouter.createCaller(await createTRPCContext());
  const folder = await caller.folder.getById({ id });
  return {
    title: folder.title,
    description: `Your Folder has ${folder?.documents?.length || 0} documents, updated on ${folder.updatedAt ? new Date(folder.updatedAt).toLocaleString() : "never"}`,
  };
};

export default function FolderPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <FolderPageView />
    </Suspense>
  );
}
