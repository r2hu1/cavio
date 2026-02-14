export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex px-6 sm:px-0 h-full w-full absolute top-0 left-0 right-0 flex-col items-center justify-center">
			{children}
		</div>
	);
}
