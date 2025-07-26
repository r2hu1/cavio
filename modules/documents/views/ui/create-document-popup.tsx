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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateDocumentPopup({
  children,
  triggerClassName,
  folderId,
}: {
  children: React.ReactNode;
  triggerClassName?: string;
  folderId: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(trpc.document.create.mutationOptions());
  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const router = useRouter();

  const handleCreateDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("document-name") as string;
    if (name.length < 5) {
      toast.error("Name must be at least 5 characters long");
      return;
    }
    setLoading(true);
    mutate(
      {
        title: name,
        folderId: folderId,
      },
      {
        onSuccess: async (e) => {
          // router.push(`/folder/${folderId}/${e.id}`);
          await queryClient.invalidateQueries(
            trpc.document.getAllByFolderId.queryOptions({ folderId }),
          );
          await queryClient.invalidateQueries(
            trpc.premium.getFreeUsage.queryOptions(),
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
          <CredenzaTitle>New Document</CredenzaTitle>
          <CredenzaDescription>
            Quickly create a new document inside your folder.
          </CredenzaDescription>
        </CredenzaHeader>
        <form className="space-y-4" onSubmit={handleCreateDocument}>
          <CredenzaBody className="space-y-2">
            <Label htmlFor="document-name">Document Name</Label>
            <Input
              id="document-name"
              name="document-name"
              type="text"
              placeholder="My notes"
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
