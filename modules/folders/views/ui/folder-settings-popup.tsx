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
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function FolderSettingsPopup({
  children,
  triggerClassName,
}: {
  children: React.ReactNode;
  triggerClassName?: string;
}) {
  // const trpc = useTRPC();
  // const queryClient = useQueryClient();
  // const { mutate } = useMutation(trpc.folder.create.mutationOptions());
  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  // const router = useRouter();

  return (
    <Credenza open={popupOpen} onOpenChange={setPopupOpen}>
      <CredenzaTrigger className={triggerClassName} asChild>
        {children}
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Folder Settings</CredenzaTitle>
        </CredenzaHeader>
        <CredenzaDescription>
          Manage your folder settings here.
        </CredenzaDescription>
        <CredenzaBody>
          <div>
            <div className="flex gap-2">
              <Input id="name" placeholder="Folder Name" />
              <Button size="icon">
                <Save className="!h-4 !w-4" />
              </Button>
            </div>
            <div></div>
          </div>
        </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
