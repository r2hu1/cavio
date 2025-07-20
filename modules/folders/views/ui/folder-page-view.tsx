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
import { Skeleton } from "@/components/ui/skeleton";
import CreateDocumentPopup from "@/modules/documents/views/ui/create-document-popup";
import { cn } from "@/lib/utils";
import { Suspense, useEffect } from "react";
import FolderSettingsPopup from "./folder-settings-popup";

export default function FolderPageView() {
  const { id } = useParams();

  const trpc = useTRPC();
  const { data, isLoading, error } = useQuery(
    trpc.document.getAllByFolderId.queryOptions({ folderId: id as string }),
  );

  return (
    <div>
      <CreateWithAI />
      <Header />
      <div
        className={cn(
          "mt-8 grid gap-4",
          isLoading && "sm:grid-cols-2",
          data && data.length >= 2 && "sm:grid-cols-2",
        )}
      >
        <Suspense>
          {!isLoading &&
            data?.map((document, index) => (
              <DocumentCard
                folderId={id as string}
                id={document.id}
                name={document.title}
                key={index}
                createdAt={document.createdAt}
                updatedAt={document.updatedAt}
              />
            ))}
        </Suspense>
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
      </div>
      {!isLoading && data?.length === 0 && (
        <div className="h-72 mt-24 flex items-center justify-center px-6 sm:px-0">
          <div className="place-content-center grid place-items-center">
            <div className="bg-sidebar rounded-lg h-14 w-full sm:w-[400px] border max-w-xl"></div>
            <div className="bg-secondary rounded-lg h-14 w-[calc(100%+50px)] sm:w-[450px] border z-10 -mt-6 max-w-2xl"></div>
            <div className="bg-sidebar rounded-lg h-14 w-full sm:w-[400px] -mt-6 border max-w-xl"></div>
            <div className="text-center mt-7 space-y-2">
              <h1 className="text-base text-foreground">
                Its so empty here :(
              </h1>
              <p className="text-xs sm:text-sm -mt-1 text-foreground/80">
                Start by creating a new document with AI or manually.
              </p>
              <CreateDocumentPopup folderId={id as string}>
                <Button size="sm" className="mt-2">
                  New Document
                  <FilePlus className="!h-3.5 !w-3.5" />
                </Button>
              </CreateDocumentPopup>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
