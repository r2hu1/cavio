import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { SchedulerInitializer } from "@/components/scheduler-initializer";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import NavProgress from "@/modules/preloader/views/ui/nav-progress";
import { TRPCReactProvider } from "@/trpc/client";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Cavio",
	description: "Made writing simple, beautiful with AI superpower!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<TRPCReactProvider>
			<html lang="en" suppressHydrationWarning>
				<body className={`${geistSans.className} antialiased`}>
					<SchedulerInitializer />
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<NavProgress />
						{children}
					</ThemeProvider>
					<Toaster position="bottom-right" />
				</body>
			</html>
		</TRPCReactProvider>
	);
}
