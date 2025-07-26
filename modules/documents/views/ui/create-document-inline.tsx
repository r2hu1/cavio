"use client";
import { useTRPC } from "@/trpc/client";
import { Slot } from "@radix-ui/react-slot";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateDocumentInline({
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
  const router = useRouter();

  const handleCreateDocument = async () => {
    if (loading) return;
    setLoading(true);
    mutate(
      {
        title: "Untitled Document",
        folderId: folderId,
      },
      {
        onSuccess: async (e) => {
          router.push(`/folder/${folderId}/${e.id}`);
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
        },
      },
    );
  };
  return (
    <Slot onClick={handleCreateDocument} className={triggerClassName}>
      {children}
    </Slot>
  );
}
