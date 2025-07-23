"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTRPC } from "@/trpc/client";
import { Slot } from "@radix-ui/react-slot";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateFolderInline({
  children,
  triggerClassName,
}: {
  children: React.ReactNode;
  triggerClassName?: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(trpc.folder.create.mutationOptions());
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateFolder = async () => {
    if (loading) return;
    setLoading(true);
    mutate(
      {
        title: "Untitled Folder",
      },
      {
        onSuccess: async (e) => {
          toast.success("Folder created successfully");
          router.push(`/folder/${e.id}`);
          await queryClient.invalidateQueries(
            trpc.folder.getAll.queryOptions(),
          );
          await queryClient.invalidateQueries(
            trpc.folder.getRecent.queryOptions(),
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
    <Slot onClick={handleCreateFolder} className={triggerClassName}>
      {children}
    </Slot>
  );
}
