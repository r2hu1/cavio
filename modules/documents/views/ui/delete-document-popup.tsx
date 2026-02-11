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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteDocumentPopup({
  documentId,
  children,
  triggerClassName,
  folderId,
}: {
  children: React.ReactNode;
  triggerClassName?: string;
  documentId: string;
  folderId: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation(
    trpc.document.delete.mutationOptions(),
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [popupOpen, setPopupOpen] = useState(false);
  const pathname = usePathname();

  const handleDeleteDocument = async () => {
    setLoading(true);
    mutate(
      {
        id: documentId,
        folderId: folderId,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(
            trpc.document.getAllByFolderId.queryOptions({ folderId }),
          );
          await queryClient.invalidateQueries(
            trpc.document.getRecent.queryOptions(),
          );
          await queryClient.invalidateQueries(
            trpc.folder.getRecent.queryOptions(),
          );
          await queryClient.invalidateQueries(
            trpc.document.getAll.queryOptions(),
          );
          if (pathname.includes(documentId)) {
            router.push(`/folder/${folderId}`);
          }
        },
        onError: (error) => {
          toast.error(error.message);
        },
        onSettled: () => {
          setLoading(false);
          setPopupOpen(false);
        },
      },
    );
  };
  return (
    <Credenza
      open={popupOpen}
      onOpenChange={() => {
        if (isPending) return;
        setPopupOpen(!popupOpen);
      }}
    >
      <CredenzaTrigger className={triggerClassName} asChild>
        {children}
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Danger</CredenzaTitle>
          <CredenzaDescription>
            Are you sure you want to delete this document? All your data within
            this document will be permanently deleted. This action cannot be
            undone.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="secondary">Cancel</Button>
          </CredenzaClose>
          <Button
            variant="destructive"
            onClick={handleDeleteDocument}
            disabled={loading}
            type="submit"
          >
            Continue
            {loading ? <Loader className="size-4" /> : null}
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
