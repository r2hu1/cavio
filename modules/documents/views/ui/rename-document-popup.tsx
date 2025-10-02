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
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function RenameDocumentPopup({
  documentId,
  children,
  triggerClassName,
  folderId,
  documentName,
}: {
  children: React.ReactNode;
  triggerClassName?: string;
  documentId: string;
  folderId: string;
  documentName?: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(trpc.document.update.mutationOptions());
  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [currDocName, setCurrDocName] = useState(documentName || "");

  const handleRenameDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = currDocName;
    // if (name.length < 5) {
    //   toast.error("Name must be at least 5 characters long");
    //   return;
    // }
    setLoading(true);
    mutate(
      {
        title: name,
        id: documentId,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(
            trpc.document.get.queryOptions({ id: documentId }),
          );
          await queryClient.invalidateQueries(
            trpc.document.getAllByFolderId.queryOptions({ folderId }),
          );
          await queryClient.invalidateQueries(
            trpc.document.getRecent.queryOptions(),
          );
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
    <Credenza open={popupOpen} onOpenChange={setPopupOpen}>
      <CredenzaTrigger className={triggerClassName} asChild>
        {children}
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Rename</CredenzaTitle>
          <CredenzaDescription>
            Rename your document to a new name.
          </CredenzaDescription>
        </CredenzaHeader>
        <form className="space-y-4" onSubmit={handleRenameDocument}>
          <CredenzaBody className="space-y-2">
            <Label htmlFor="document-name">Document Name</Label>
            <Input
              required
              id="document-name"
              name="document-name"
              type="text"
              placeholder="My Document"
              value={currDocName}
              onChange={(e) => setCurrDocName(e.target.value)}
            />
          </CredenzaBody>
          <CredenzaFooter>
            <Button disabled={loading} type="submit">
              {loading ? <Loader2 className="animate-spin" /> : null} Continue
            </Button>
          </CredenzaFooter>
        </form>
      </CredenzaContent>
    </Credenza>
  );
}
