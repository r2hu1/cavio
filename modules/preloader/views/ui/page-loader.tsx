import { Loader } from "@/components/ui/loader";

export default function PageLoader() {
	return (
		<div className="flex h-[calc(100%-50px)] absolute top-10 left-0 right-0 w-full items-center justify-center">
			<Loader className="!w-5 !h-5" />
		</div>
	);
}
