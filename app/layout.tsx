import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/client";
import { ThemeProvider } from "@/components/theme-provider";
import NavProgress from "@/modules/preloader/views/ui/nav-progress";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Slate",
	description: "Made writing simple, beautiful with AI superpower!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<TRPCReactProvider>
			<html lang="en">
				<body className={`${geistSans.className} antialiased`}>
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
