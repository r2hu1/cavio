"use client";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Tooltip from "@/components/ui/tooltip-v2";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PencilLine } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RenameFolderInline({
  folderId,
  textClassName,
  inputClassName,
}: {
  folderId: string;
  textClassName?: string;
  inputClassName?: string;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate } = useMutation(trpc.folder.update.mutationOptions());
  const { data, isPending, error } = useQuery(
    trpc.folder.getById.queryOptions({ id: folderId }),
  );
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
    if (data) {
      setNewFolderName(data.title);
    }
  }, [isPending]);

  const [isEditing, setIsEditing] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (newFolderName.length < 5 || newFolderName == data?.title) {
      setIsEditing(false);
      return;
    }
    setLoading(true);
    setIsEditing(false);
    mutate(
      {
        title: newFolderName,
        id: folderId,
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(
            trpc.folder.getAll.queryOptions(),
          );
          await queryClient.invalidateQueries(
            trpc.folder.getById.queryOptions({ id: folderId }),
          );
          await queryClient.invalidateQueries(
            trpc.folder.getRecent.queryOptions(),
          );
        },
        onError: (error) => {
          toast.error(error.message);
        },
        onSettled: () => {
          setLoading(false);
          setIsEditing(false);
        },
      },
    );
  };

  return isPending ? (
    <Skeleton className="h-4 w-20" />
  ) : isEditing ? (
    <Input
      className={cn("w-[150px]", inputClassName)}
      autoFocus
      value={newFolderName}
      onChange={(e) => setNewFolderName(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => e.key == "Enter" && handleSave()}
      onKeyUp={(e) => e.key == "Escape" && setIsEditing(false)}
    />
  ) : (
    <h1
      onClick={() => setIsEditing(!isEditing)}
      className={cn(
        "flex items-center gap-2",
        loading && "animate-pulse",
        textClassName,
      )}
    >
      {data?.title}
      <Tooltip text="Rename Folder">
        <PencilLine className="!h-3.5 cursor-pointer !w-3.5 text-foreground/70" />
      </Tooltip>
    </h1>
  );
}
