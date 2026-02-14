"use client";

import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from "@/components/ui/credenza";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addDays, differenceInDays, formatDistanceToNow } from "date-fns";
import {
  Clock,
  FileText,
  Folder,
  FolderClockIcon,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const AUTO_DELETE_DAYS = 7;

function parseDate(dateValue: string | Date | null): Date | null {
  if (!dateValue) return null;
  if (dateValue instanceof Date) return dateValue;
  try {
    return new Date(dateValue);
  } catch {
    return null;
  }
}

function getDaysRemaining(deletedAt: string | Date | null): number {
  const date = parseDate(deletedAt);
  if (!date) return AUTO_DELETE_DAYS;
  const deleteDate = addDays(date, AUTO_DELETE_DAYS);
  const daysLeft = differenceInDays(deleteDate, new Date());
  return Math.max(0, daysLeft);
}

function formatDeletedDate(deletedAt: string | Date | null): string {
  const date = parseDate(deletedAt);
  if (!date) return "Unknown";
  try {
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return "Unknown";
  }
}

export default function BinView() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: deletedDocuments } = useQuery(
    trpc.document.getDeleted.queryOptions(),
  );

  const { data: deletedFolders } = useQuery(
    trpc.folder.getDeleted.queryOptions(),
  );

  const restoreDocument = useMutation(
    trpc.document.restore.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.setQueryData(
          trpc.document.getDeleted.queryKey(),
          (old: any) =>
            old?.filter((item: any) => item.id !== variables.id) ?? [],
        );
      },
    }),
  );

  const restoreFolder = useMutation(
    trpc.folder.restore.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.setQueryData(
          trpc.folder.getDeleted.queryKey(),
          (old: any) =>
            old?.filter((item: any) => item.id !== variables.id) ?? [],
        );
      },
    }),
  );

  const permanentDeleteDocument = useMutation(
    trpc.document.permanentDelete.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.setQueryData(
          trpc.document.getDeleted.queryKey(),
          (old: any) =>
            old?.filter((item: any) => item.id !== variables.id) ?? [],
        );
      },
    }),
  );

  const permanentDeleteFolder = useMutation(
    trpc.folder.permanentDelete.mutationOptions({
      onSuccess: (_, variables) => {
        queryClient.setQueryData(
          trpc.folder.getDeleted.queryKey(),
          (old: any) =>
            old?.filter((item: any) => item.id !== variables.id) ?? [],
        );
      },
    }),
  );

  const isEmpty =
    (!deletedDocuments || deletedDocuments.length === 0) &&
    (!deletedFolders || deletedFolders.length === 0);

  return (
    <div className="space-y-12">
      {/* Empty State */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
          <Trash2 className="h-10 w-10 mb-4 opacity-40" />
          <p className="text-sm">Your bin is empty</p>
        </div>
      )}

      {/* Content */}
      {!isEmpty && (
        <>
          {/* Folders */}
          {deletedFolders && deletedFolders.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FolderClockIcon className="h-4 w-4" />
                <span>Deleted Folders</span>
              </div>

              <div className="space-y-2">
                {deletedFolders.map((folder: any) => {
                  const daysRemaining = getDaysRemaining(folder.deletedAt);

                  return (
                    <div
                      key={folder.id}
                      className="group flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/30 px-4 py-3 transition"
                    >
                      <div className="flex items-center gap-3">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm">
                            {folder.title || "Untitled Folder"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Deleted {formatDeletedDate(folder.deletedAt)} •{" "}
                            {daysRemaining}d left
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            restoreFolder.mutate({ id: folder.id })
                          }
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>

                        <Credenza>
                          <CredenzaTrigger asChild>
                            <Button size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </CredenzaTrigger>
                          <CredenzaContent>
                            <CredenzaHeader>
                              <CredenzaTitle>Permanently delete?</CredenzaTitle>
                              <CredenzaDescription>
                                This action cannot be undone.
                              </CredenzaDescription>
                            </CredenzaHeader>
                            <CredenzaFooter>
                              <CredenzaClose asChild>
                                <Button variant="secondary">Cancel</Button>
                              </CredenzaClose>
                              <Button
                                variant="destructive"
                                onClick={() =>
                                  permanentDeleteFolder.mutate({
                                    id: folder.id,
                                  })
                                }
                              >
                                Delete
                              </Button>
                            </CredenzaFooter>
                          </CredenzaContent>
                        </Credenza>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Documents */}
          {deletedDocuments && deletedDocuments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>Deleted Documents</span>
              </div>

              <div className="space-y-2">
                {deletedDocuments.map((doc: any) => {
                  const daysRemaining = getDaysRemaining(doc.deletedAt);

                  return (
                    <div
                      key={doc.id}
                      className="group flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/30 px-4 py-3 transition"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm">
                            {doc.title || "Untitled Document"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Deleted {formatDeletedDate(doc.deletedAt)} •{" "}
                            {daysRemaining}d left
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => restoreDocument.mutate({ id: doc.id })}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>

                        <Credenza>
                          <CredenzaTrigger asChild>
                            <Button size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </CredenzaTrigger>
                          <CredenzaContent>
                            <CredenzaHeader>
                              <CredenzaTitle>Permanently delete?</CredenzaTitle>
                              <CredenzaDescription>
                                This action cannot be undone.
                              </CredenzaDescription>
                            </CredenzaHeader>
                            <CredenzaFooter>
                              <CredenzaClose asChild>
                                <Button variant="secondary">Cancel</Button>
                              </CredenzaClose>
                              <Button
                                variant="destructive"
                                onClick={() =>
                                  permanentDeleteDocument.mutate({
                                    id: doc.id,
                                  })
                                }
                              >
                                Delete
                              </Button>
                            </CredenzaFooter>
                          </CredenzaContent>
                        </Credenza>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
