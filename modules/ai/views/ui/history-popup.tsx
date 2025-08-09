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
import { ClockFading, Loader2, Trash } from "lucide-react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

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
  const pathname = usePathname();
  const router = useRouter();


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
          if(pathname === `/chat/${id}`){
            router.push('/chat');
          }
        },
      },
    );
  };

  const handleDeleteAll = async () => {
    if (isDeleting) return;
    mutate(
      {},
      {
        onError: (error) => {
          toast.error(error.message);
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries(trpc.ai.history.queryOptions());
          if(pathname.includes('/chat')){
            router.push('/');
          }
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
          <SheetDescription asChild className="mt-10 grid gap-3">
            <div>
              {!isPending &&
                data &&
                data.map((item, index) => (
                  <div
                    key={index}
                    className="h-16 border hover:bg-sidebar gap-3 transition cursor-pointer hover:text-foreground rounded-lg flex items-center px-3 group"
                  >
                    <ClockFading className="!min-h-4 !min-w-4"/>
                    <Link href={`/chat/${item.id}`} className="grid gap-px h-fit">
                      <h1 className="text-sm sm:text-base w-full flex items-center gap-2 truncate whitespace-nowrap overflow-hidden">
                        {item.title}
                      </h1>
                      <p className="text-xs">{item.updatedAt ? new Date(item.updatedAt).toDateString() : ''}</p>
                    </Link>
                    <Button
                      size="sm"
                      className="h-8 w-8 hidden ml-auto group-hover:flex"
                      variant="outline"
                      disabled={isDeleting}
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash className="!h-3.5 !w-3.5" />
                    </Button>
                  </div>
                ))}
              {isPending && (
                <div className="flex items-center h-32 justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {!isPending && !data?.length && (
                <div className="flex border rounded-lg items-center h-32 justify-center">
                  <p className="text-sm text-foreground/80">Nothing yet :(</p>
                </div>
              )}
            </div>
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button
            disabled={!data?.length || isDeleting}
            onClick={handleDeleteAll}
          >
            Delete All
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
