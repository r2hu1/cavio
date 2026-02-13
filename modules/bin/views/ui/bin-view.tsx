"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Folder,
  RotateCcw,
  Trash2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow, differenceInDays, addDays } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useCallback, useEffect } from "react";
import DynamicNav from "@/modules/header/views/ui/dynamic-nav";
import { Loader } from "@/components/ui/loader";

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

interface RestoreDialogState {
  isOpen: boolean;
  documentId: string | null;
  documentTitle: string;
  parentFolder: {
    id: string;
    title: string;
    deleted: boolean | null;
  } | null;
  availableFolders: { id: string; title: string }[];
}

export default function BinView() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [restoreDialog, setRestoreDialog] = useState<RestoreDialogState>({
    isOpen: false,
    documentId: null,
    documentTitle: "",
    parentFolder: null,
    availableFolders: [],
  });
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [checkingDocId, setCheckingDocId] = useState<string | null>(null);

  const {
    data: deletedDocuments,
    isPending: isLoadingDocuments,
    error: documentsError,
    refetch: refetchDocuments,
  } = useQuery(trpc.document.getDeleted.queryOptions());

  const {
    data: deletedFolders,
    isPending: isLoadingFolders,
    error: foldersError,
    refetch: refetchFolders,
  } = useQuery(trpc.folder.getDeleted.queryOptions());

  const { data: parentFolderStatus } = useQuery({
    ...trpc.document.getParentFolderStatus.queryOptions(
      { id: checkingDocId || "" },
      { enabled: !!checkingDocId },
    ),
    enabled: !!checkingDocId,
  });

  useEffect(() => {
    if (parentFolderStatus && checkingDocId) {
      const doc = deletedDocuments?.find((d: any) => d.id === checkingDocId);
      if (doc) {
        // If parent folder is deleted, show dialog
        if (parentFolderStatus.parentFolder?.deleted) {
          setRestoreDialog({
            isOpen: true,
            documentId: doc.id,
            documentTitle: doc.title || "Untitled Document",
            parentFolder: parentFolderStatus.parentFolder,
            availableFolders: parentFolderStatus.availableFolders,
          });
          setProcessingId(null);
        } else {
          // Otherwise, restore normally
          restoreDocument.mutate({ id: doc.id });
        }
      }
      setCheckingDocId(null);
    }
  }, [parentFolderStatus, checkingDocId, deletedDocuments]);

  const handleError = useCallback((error: any, action: string) => {
    console.error(`Failed to ${action}:`, error);
    const message = error?.message || `Failed to ${action}`;
    toast.error(message);
    setProcessingId(null);
  }, []);

  const invalidateBinData = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: trpc.document.getDeleted.queryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: trpc.folder.getDeleted.queryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: trpc.document.getRecent.queryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: trpc.folder.getRecent.queryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: trpc.document.getAll.queryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: trpc.folder.getAll.queryKey(),
    });
  }, [queryClient, trpc]);

  const handleRestoreDocumentClick = (doc: any) => {
    setProcessingId(doc.id);
    setCheckingDocId(doc.id);
  };

  const restoreDocument = useMutation(
    trpc.document.restore.mutationOptions({
      onMutate: ({ id }) => {
        setProcessingId(id);
      },
      onSuccess: (_, variables) => {
        toast.success("Document restored successfully");
        // Optimistic update - remove from list immediately
        queryClient.setQueryData(
          trpc.document.getDeleted.queryKey(),
          (old: any) =>
            old?.filter((item: any) => item.id !== variables.id) ?? [],
        );
        invalidateBinData();
        setProcessingId(null);
        setRestoreDialog((prev) => ({ ...prev, isOpen: false }));
      },
      onError: (error) => handleError(error, "restore document"),
    }),
  );

  const restoreFolder = useMutation(
    trpc.folder.restore.mutationOptions({
      onMutate: ({ id }) => {
        setProcessingId(id);
      },
      onSuccess: (_, variables) => {
        toast.success("Folder restored successfully");
        // Optimistic update
        queryClient.setQueryData(
          trpc.folder.getDeleted.queryKey(),
          (old: any) =>
            old?.filter((item: any) => item.id !== variables.id) ?? [],
        );
        invalidateBinData();
        setProcessingId(null);
      },
      onError: (error) => {
        if (error?.message?.includes("parent")) {
          toast.error("Cannot restore: Parent folder no longer exists");
        } else {
          handleError(error, "restore folder");
        }
        setProcessingId(null);
      },
    }),
  );

  const permanentDeleteDocument = useMutation(
    trpc.document.permanentDelete.mutationOptions({
      onMutate: ({ id }) => {
        setProcessingId(id);
      },
      onSuccess: (_, variables) => {
        toast.success("Document permanently deleted");
        queryClient.setQueryData(
          trpc.document.getDeleted.queryKey(),
          (old: any) =>
            old?.filter((item: any) => item.id !== variables.id) ?? [],
        );
        setProcessingId(null);
      },
      onError: (error) => handleError(error, "delete document"),
    }),
  );

  const permanentDeleteFolder = useMutation(
    trpc.folder.permanentDelete.mutationOptions({
      onMutate: ({ id }) => {
        setProcessingId(id);
      },
      onSuccess: (_, variables) => {
        toast.success("Folder and its contents permanently deleted");
        queryClient.setQueryData(
          trpc.folder.getDeleted.queryKey(),
          (old: any) =>
            old?.filter((item: any) => item.id !== variables.id) ?? [],
        );
        queryClient.setQueryData(
          trpc.document.getDeleted.queryKey(),
          (old: any) =>
            old?.filter((item: any) => item.folderId !== variables.id) ?? [],
        );
        setProcessingId(null);
      },
      onError: (error) => handleError(error, "delete folder"),
    }),
  );

  // Bulk operations
  const restoreAllFolders = useMutation(
    trpc.folder.restoreAll.mutationOptions({
      onSuccess: (data) => {
        invalidateBinData();
      },
      onError: (error) => {
        handleError(error, "restore all folders");
      },
    }),
  );

  const restoreAllDocuments = useMutation(
    trpc.document.restoreAll.mutationOptions({
      onSuccess: (data) => {
        invalidateBinData();
      },
      onError: (error) => {
        handleError(error, "restore all documents");
      },
    }),
  );

  const permanentDeleteAllFolders = useMutation(
    trpc.folder.permanentDeleteAll.mutationOptions({
      onSuccess: (data) => {
        queryClient.setQueryData(trpc.folder.getDeleted.queryKey(), []);
        queryClient.setQueryData(trpc.document.getDeleted.queryKey(), []);
      },
      onError: (error) => {
        handleError(error, "delete all folders");
      },
    }),
  );

  const permanentDeleteAllDocuments = useMutation(
    trpc.document.permanentDeleteAll.mutationOptions({
      onSuccess: (data) => {
        queryClient.setQueryData(trpc.document.getDeleted.queryKey(), []);
      },
      onError: (error) => {
        handleError(error, "delete all documents");
      },
    }),
  );

  const handleRestoreWithParent = () => {
    if (restoreDialog.parentFolder) {
      restoreFolder.mutate({ id: restoreDialog.parentFolder.id });
    }
  };

  const handleRestoreToDifferentFolder = () => {
    if (selectedFolderId) {
      restoreDocument.mutate({
        id: restoreDialog.documentId!,
        folderId: selectedFolderId,
      });
    }
  };

  const isLoading = isLoadingDocuments || isLoadingFolders;
  const hasError = documentsError || foldersError;
  const hasDocuments = deletedDocuments && deletedDocuments.length > 0;
  const hasFolders = deletedFolders && deletedFolders.length > 0;
  const isEmpty = !hasDocuments && !hasFolders;

  // Track bulk operation states
  const isRestoring =
    restoreAllFolders.isPending || restoreAllDocuments.isPending;
  const isEmptying =
    permanentDeleteAllFolders.isPending ||
    permanentDeleteAllDocuments.isPending;

  // Expose bulk operations to parent via window
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).binOperations = {
        restoreAll: () => {
          restoreAllFolders.mutate();
          restoreAllDocuments.mutate();
        },
        emptyTrash: () => {
          permanentDeleteAllFolders.mutate();
          permanentDeleteAllDocuments.mutate();
        },
        hasItems: !isEmpty,
        isRestoring,
        isEmptying,
      };
    }
  }, [
    isEmpty,
    isRestoring,
    isEmptying,
    restoreAllFolders,
    restoreAllDocuments,
    permanentDeleteAllFolders,
    permanentDeleteAllDocuments,
  ]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Skeleton className="w-full h-100" />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="max-w-4xl mx-auto">
        <DynamicNav />
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Trash2 className="h-6 w-6" />
                Bin
              </h1>
            </div>
          </div>
          <div className="text-center py-20">
            <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-lg font-medium">Failed to load bin</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {documentsError?.message ||
                foldersError?.message ||
                "Something went wrong"}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                refetchDocuments();
                refetchFolders();
              }}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="space-y-6">
        {isEmpty && (
          <div className="text-center py-20">
            <Trash2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg font-medium">Bin is empty</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Deleted documents and folders will appear here
            </p>
          </div>
        )}

        {!isEmpty && (
          <div className="space-y-6">
            {hasFolders && (
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  Folders
                </h2>
                <div className="space-y-2">
                  {deletedFolders?.map((folder: any) => {
                    const daysRemaining = getDaysRemaining(folder.deletedAt);
                    const isProcessing = processingId === folder.id;

                    return (
                      <div
                        key={folder.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Folder className="h-5 w-5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {folder.title || "Untitled Folder"}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">
                                Deleted {formatDeletedDate(folder.deletedAt)}
                              </span>
                              <span className="text-destructive font-medium flex-shrink-0">
                                ({daysRemaining}d left)
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              restoreFolder.mutate({ id: folder.id })
                            }
                            disabled={isProcessing || restoreFolder.isPending}
                            className="flex-1 sm:flex-none"
                          >
                            {isProcessing && restoreFolder.isPending ? (
                              <Loader />
                            ) : (
                              <RotateCcw className="h-4 w-4 sm:mr-2" />
                            )}
                            <span className="inline">Restore</span>
                          </Button>
                          <Credenza>
                            <CredenzaTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="sm:size-sm flex-shrink-0"
                                disabled={isProcessing}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </CredenzaTrigger>
                            <CredenzaContent>
                              <CredenzaHeader>
                                <CredenzaTitle>
                                  Permanently Delete?
                                </CredenzaTitle>
                                <CredenzaDescription>
                                  This will permanently delete the folder and
                                  all its contents. This action cannot be
                                  undone.
                                </CredenzaDescription>
                              </CredenzaHeader>
                              <CredenzaFooter>
                                <CredenzaClose asChild>
                                  <Button variant="secondary">Cancel</Button>
                                </CredenzaClose>
                                <Button
                                  onClick={() =>
                                    permanentDeleteFolder.mutate({
                                      id: folder.id,
                                    })
                                  }
                                  variant="destructive"
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

            {hasDocuments && (
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-3">
                  Documents
                </h2>
                <div className="space-y-2">
                  {deletedDocuments?.map((doc: any) => {
                    const daysRemaining = getDaysRemaining(doc.deletedAt);
                    const isProcessing = processingId === doc.id;

                    return (
                      <div
                        key={doc.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="h-5 w-5 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {doc.title || "Untitled Document"}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">
                                Deleted {formatDeletedDate(doc.deletedAt)}
                              </span>
                              <span className="text-destructive font-medium flex-shrink-0">
                                ({daysRemaining}d left)
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestoreDocumentClick(doc)}
                            disabled={isProcessing || restoreDocument.isPending}
                            className="flex-1 sm:flex-none"
                          >
                            {isProcessing && restoreDocument.isPending ? (
                              <span className="animate-spin">⟳</span>
                            ) : (
                              <RotateCcw className="h-4 w-4 sm:mr-2" />
                            )}
                            <span className="hidden sm:inline">Restore</span>
                          </Button>
                          <Credenza>
                            <CredenzaTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="sm:size-sm flex-shrink-0"
                                disabled={isProcessing}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </CredenzaTrigger>
                            <CredenzaContent>
                              <CredenzaHeader>
                                <CredenzaTitle>
                                  Permanently Delete?
                                </CredenzaTitle>
                                <CredenzaDescription>
                                  This will permanently delete this document.
                                  This action cannot be undone.
                                </CredenzaDescription>
                              </CredenzaHeader>
                              <CredenzaFooter>
                                <CredenzaClose asChild>
                                  <Button
                                    variant="secondary"
                                    disabled={permanentDeleteDocument.isPending}
                                  >
                                    Cancel
                                  </Button>
                                </CredenzaClose>
                                <Button
                                  onClick={() =>
                                    permanentDeleteDocument.mutate({
                                      id: doc.id,
                                    })
                                  }
                                  variant="destructive"
                                  disabled={permanentDeleteDocument.isPending}
                                >
                                  Delete
                                  {permanentDeleteDocument.isPending && (
                                    <Loader />
                                  )}
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
          </div>
        )}
      </div>

      {/* Restore Dialog */}
      <Credenza
        open={restoreDialog.isOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setRestoreDialog((prev) => ({ ...prev, isOpen: false }));
            setProcessingId(null);
          }
        }}
      >
        <CredenzaContent className="sm:max-w-md">
          <CredenzaHeader>
            <CredenzaTitle>Restore Document</CredenzaTitle>
            <CredenzaDescription>
              The folder &quot;{restoreDialog.parentFolder?.title}&quot;
              containing &quot;
              {restoreDialog.documentTitle}&quot; is also deleted.
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Move to a different folder:
              </p>
              <Select
                value={selectedFolderId}
                onValueChange={setSelectedFolderId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                  {restoreDialog.availableFolders.length === 0 ? (
                    <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                      No available folders. Create one first.
                    </div>
                  ) : (
                    restoreDialog.availableFolders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id}>
                        {folder.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </CredenzaBody>
          <CredenzaFooter>
            <CredenzaClose asChild>
              <Button
                variant="secondary"
                onClick={() => {
                  setRestoreDialog((prev) => ({ ...prev, isOpen: false }));
                  setProcessingId(null);
                }}
              >
                Cancel
              </Button>
            </CredenzaClose>
            <Button
              onClick={handleRestoreToDifferentFolder}
              disabled={!selectedFolderId || restoreDocument.isPending}
            >
              Restore
              {restoreDocument.isPending ? (
                <Loader />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
            </Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </div>
  );
}
