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
import { useQuery } from "@tanstack/react-query";

export default function CreateFolderPopup({
  children,
  triggerClassName,
}: {
  children: React.ReactNode;
  triggerClassName?: string;
}) {
  // const trpc = useTRPC();
  const handleCreateFolder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const formData = new FormData(e.target as HTMLFormElement);
    // const name = formData.get("folder-name") as string;
    // await trpc.folder.create.mutate({ name });
  };
  return (
    <Credenza>
      <CredenzaTrigger className={triggerClassName} asChild>
        {children}
      </CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Create Folder</CredenzaTitle>
          <CredenzaDescription>
            Quickly create a new folder in your workspace.
          </CredenzaDescription>
        </CredenzaHeader>
        <form className="space-y-4" onSubmit={handleCreateFolder}>
          <CredenzaBody className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input id="folder-name" type="text" placeholder="My Blogs" />
          </CredenzaBody>
          <CredenzaFooter>
            <Button>Continue</Button>
            <CredenzaClose asChild>
              <Button variant="secondary">Cancel</Button>
            </CredenzaClose>
          </CredenzaFooter>
        </form>
      </CredenzaContent>
    </Credenza>
  );
}
