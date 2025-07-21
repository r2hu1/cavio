import { GalleryVerticalEnd } from "lucide-react";

export default function Logo({ className }: { className?: string }) {
  return (
    <div
      className={`bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md ${className}`}
    >
      <GalleryVerticalEnd className="size-4" />
    </div>
  );
}
