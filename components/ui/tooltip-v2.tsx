import {
  Tooltip as V2,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Tooltip({
  children,
  text,
  className,
}: {
  children: React.ReactNode;
  text: string;
  className?: string;
}) {
  return (
    <V2>
      <TooltipTrigger asChild className={className}>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </V2>
  );
}
