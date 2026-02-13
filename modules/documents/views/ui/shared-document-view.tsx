"use client";

import { useParams, useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import PageLoader from "@/modules/preloader/views/ui/page-loader";
import { Plate, usePlateEditor } from "platejs/react";
import { EditorContainer, Editor as EditorPlate } from "@/components/ui/editor";
import { MarkdownPlugin } from "@platejs/markdown";
import { BaseEditorKit } from "@/components/editor/editor-base-kit";
import { useEffectOnce } from "platejs/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Lock, Copy, Check, FolderPlus, LogIn } from "lucide-react";
import { useState } from "react";
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
  CredenzaBody,
} from "@/components/ui/credenza";
import { useSession } from "@/lib/auth-client";
import SharedLogo from "@/components/shared-logo";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function SharedDocumentView() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;
  const trpc = useTRPC();
  const { data: authData } = useSession();
  const isAuthenticated = !!authData?.session;
  const [copied, setCopied] = useState(false);
  const [cloneDialogOpen, setCloneDialogOpen] = useState(false);

  const { data, isPending, error } = useQuery(
    trpc.document.getShared.queryOptions({ id: documentId }),
  );

  const { data: folders } = useQuery({
    ...trpc.folder.getAll.queryOptions(),
    enabled: isAuthenticated,
  });

  const { mutate: cloneDocument, isPending: isCloning } = useMutation(
    trpc.document.clone.mutationOptions({
      onSuccess: (data) => {
        router.push(`/folder/${data.folderId}/${data.id}`);
      },
    }),
  );

  const editor = usePlateEditor({
    plugins: [...BaseEditorKit],
    autoSelect: "end",
    //@ts-ignore
    id: "shared",
    //@ts-ignore
    shouldInitialize: false,
  });

  useEffectOnce(() => {
    if (data?.content) {
      editor.tf.init({
        value: (editor: any) =>
          editor.getApi(MarkdownPlugin).markdown.deserialize(data.content),
        autoSelect: "end",
      });
    }
  }, [data]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClone = (folderId: string) => {
    cloneDocument({ documentId, folderId });
  };

  if (isPending) {
    return (
      <div className="px-6 py-5 md:px-10">
        <div className="flex items-center justify-between pb-6">
          <SharedLogo />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9" />
            <Skeleton className="h-9 w-24 " />
          </div>
        </div>

        <div className="border rounded-md px-6 pb-10">
          <div className="mt-10 space-y-4">
            <Skeleton className="h-10 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/3 rounded-md" />
          </div>
          <div className="mt-8 space-y-3">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
            <Skeleton className="h-4 w-4/6 rounded-md" />
          </div>
          <div className="mt-10 space-y-4">
            <Skeleton className="h-6 w-1/2 rounded-md" />
          </div>
          <div className="mt-6 space-y-3">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
            <Skeleton className="h-4 w-5/6 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">
            {error.message === "This document is not shared publicly"
              ? "Private Document"
              : "Document Not Found"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {error.message === "This document is not shared publicly"
              ? "This document is private and cannot be accessed."
              : "The document you're looking for doesn't exist."}
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-5 md:px-10 px-6 lg:px-20 pb-10">
      <header className="space-y-2 py-2">
        <div className="h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SharedLogo />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm" onClick={handleCopyLink}>
              {copied ? (
                <Check className="size-4!" />
              ) : (
                <Copy className="size-4!" />
              )}
            </Button>

            {isAuthenticated ? (
              <Credenza
                open={cloneDialogOpen}
                onOpenChange={setCloneDialogOpen}
              >
                <CredenzaTrigger asChild>
                  <Button size="sm">
                    Clone
                    <FolderPlus className="size-4!" />
                  </Button>
                </CredenzaTrigger>
                <CredenzaContent>
                  <CredenzaHeader>
                    <CredenzaTitle>Clone Document</CredenzaTitle>
                    <CredenzaDescription>
                      Choose a folder to clone &quot;{data?.title}&quot; into
                      your workspace.
                    </CredenzaDescription>
                  </CredenzaHeader>
                  <CredenzaBody>
                    <div className="space-y-2 mt-4 max-h-64 mb-10 sm:mb-0 overflow-y-auto">
                      {folders && folders.length > 0 ? (
                        folders.map((folder) => (
                          <Button
                            key={folder.id}
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => handleClone(folder.id)}
                            disabled={isCloning}
                          >
                            <FolderPlus className="mr-2 h-4 w-4" />
                            {folder.title}
                          </Button>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No folders found. Create a folder first.
                        </div>
                      )}
                    </div>
                  </CredenzaBody>
                </CredenzaContent>
              </Credenza>
            ) : (
              <Link href={`/auth/sign-in?redirect=/share/${documentId}`}>
                <Button size="sm">
                  Sign in to Clone
                  <LogIn className="size-4!" />
                </Button>
              </Link>
            )}
          </div>
        </div>
        {/*<div className="flex gap-3 items-center justify-center">
          <h1>{data.title}</h1> <Badge>Shared Document</Badge>
        </div>*/}
      </header>
      <main className="border rounded-md px-6 py-0">
        <Plate editor={editor}>
          <EditorContainer variant="default">
            <EditorPlate
              readOnly
              spellCheck={false}
              variant="none"
              className="max-w-5xl mx-auto"
            />
          </EditorContainer>
        </Plate>
      </main>
    </div>
  );
}
