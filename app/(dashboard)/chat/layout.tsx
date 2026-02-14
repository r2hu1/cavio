import StaticInput from "@/modules/ai/views/ui/static-input";

export default function ChatLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative">
			{children}
			<StaticInput />
		</div>
	);
}
