import { Skeleton } from "./ui/skeleton";

export default function TextSkeleton({
	text,
	type = "p",
	className,
	skeletonClassName,
}: {
	text?: string | null;
	type?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
	className?: string;
	skeletonClassName?: string;
}) {
	const Slot = type;
	return text ? (
		<Slot className={`${className}`}>{text}</Slot>
	) : (
		<Skeleton className={`h-2 w-20 ${skeletonClassName}`} />
	);
}
