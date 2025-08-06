"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";

export default function HistoryPopup({
  children,
}: {
  children: React.ReactNode;
}) {
  const trpc = useTRPC();
  const { data, isPending, error } = useQuery(trpc.ai.history.queryOptions());
  const { mutate, isPending: isDeleting } = useMutation(
    trpc.ai.deleteHistory.mutationOptions(),
  );
  const queryClient = useQueryClient();
  const handleDelete = async (id: string) => {
    if (isDeleting) return;
    mutate(
      {
        chatId: id,
      },
      {
        onError: (error) => {
          toast.error(error.message);
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries(trpc.ai.history.queryOptions());
        },
      },
    );
  };
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>History</SheetTitle>
          <SheetDescription className="mt-10 grid gap-3">
            {!isPending &&
              data &&
              data.map((item, index) => (
                <div className="h-12 border hover:bg-sidebar transition cursor-pointer hover:text-foreground rounded-lg flex items-center justify-between px-3 group">
                  <Link key={index} href={`/chat/${item.id}`}>
                    <h1 className="text-sm sm:text-base">{item.title}</h1>
                  </Link>
                  <Button
                    size="sm"
                    className="h-8 w-8 hidden group-hover:flex !-mr-1"
                    variant="outline"
                    disabled={isDeleting}
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash className="!h-3.5 !w-3.5" />
                  </Button>
                </div>
              ))}
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button disabled={!data}>Delete All</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
