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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function DeleteFolderPopup({
  folderId,
  children,
  triggerClassName,
}: {
  children: React.ReactNode;
  triggerClassName?: string;
  folderId: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation(
    trpc.folder.delete.mutationOptions(),
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [popupOpen, setPopupOpen] = useState(false);

  const handleDeleteFolder = async () => {
    setLoading(true);
    mutate(
      {
        id: folderId,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(
            trpc.folder.getAll.queryOptions(),
          );
          await queryClient.invalidateQueries(
            trpc.premium.getFreeUsage.queryOptions(),
          );
          await queryClient.invalidateQueries(
            trpc.folder.getRecent.queryOptions(),
          );
          toast.success("Folder deleted successfully");
          router.push("/");
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
          <CredenzaTitle>Danger</CredenzaTitle>
          <CredenzaDescription>
            Are you sure you want to delete this folder? All your documents
            inside this folder will be permanently deleted. This action cannot
            be undone.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaFooter>
          <CredenzaClose asChild>
            <Button variant="secondary">Cancel</Button>
          </CredenzaClose>
          <Button
            variant="destructive"
            onClick={handleDeleteFolder}
            disabled={loading}
            type="submit"
          >
            {loading ? <Loader2 className="animate-spin" /> : null} Continue
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
