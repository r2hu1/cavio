"use client";

import { AuroraText } from "@/components/ui/aurora-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowUpRight,
  Bolt,
  FilePlus,
  Loader2,
  PencilLine,
  Sparkles,
} from "lucide-react";
import CreateWithAI from "./create-with-ai";
import Header from "./header";
import DocumentCard from "@/modules/documents/views/ui/document-card";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function FolderPageView() {
  const { id } = useParams();

  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(
    trpc.document.getAllByFolderId.queryOptions({ folderId: id as string }),
  );
  if (!isLoading) {
    console.log(data);
  }
  if (error) {
    console.error(error);
  }
  return (
    <div>
      <CreateWithAI />
      <Header />
      <div className="mt-8 flex gap-3 flex-col">
        {!isLoading &&
          data &&
          data.map((document, index) => (
            <DocumentCard name={document.title} key={index} />
          ))}
        {isLoading && (
          <div className="h-32 flex items-center justify-center">
            <Loader2 className="!h-4 !w-4 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
