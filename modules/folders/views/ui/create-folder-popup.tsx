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

export default function CreateFolderPopup({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Credenza>
      <CredenzaTrigger asChild>{children}</CredenzaTrigger>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Create Folder</CredenzaTitle>
          <CredenzaDescription>
            Quickly create a new folder and start writing your thoughts.
          </CredenzaDescription>
        </CredenzaHeader>
        <CredenzaBody>
          <form className="space-y-2">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input id="folder-name" type="text" placeholder="My Blogs" />
          </form>
        </CredenzaBody>
        <CredenzaFooter>
          <Button>Continue</Button>
          <CredenzaClose asChild>
            <Button variant="secondary">Cancel</Button>
          </CredenzaClose>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
}
