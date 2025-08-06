"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export default function HistoryPopup({
  children,
}: {
  children: React.ReactNode;
}) {
  const trpc = useTRPC();
  const { data, isPending, error } = useQuery(trpc.ai.history.queryOptions());
  if (!isPending) {
    console.log(data);
  }
  return (
    <div>
      <div></div>
    </div>
  );
}
