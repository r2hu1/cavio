import Link from "next/link";
import SharedLogo from "../shared-logo";
import { Button } from "../ui/button";
import { ModeToggle } from "../theme-switcher";

export default function Header() {
	return (
		<header className="w-full bg-sidebar/80 backdrop-blur-sm sticky top-10 z-[999] border h-14 rounded-full max-w-5xl mx-auto flex items-center justify-between mt-10 px-5">
			<div>
				<SharedLogo />
			</div>
			<div className="-mr-2 items-center gap-2 hidden sm:flex">
				<Button
					asChild
					variant="ghost"
					className="rounded-full hover:!bg-sidebar-accent"
				>
					<Link className="text-sm" href="https://github.com/r2hu1">
						About
					</Link>
				</Button>
				<Button
					asChild
					variant="ghost"
					className="rounded-full hover:!bg-sidebar-accent"
				>
					<Link className="text-sm" href="/">
						Pricing
					</Link>
				</Button>
				<Button
					asChild
					variant="ghost"
					className="rounded-full hover:!bg-sidebar-accent"
				>
					<Link className="text-sm" href="https://github.com/r2hu1/slate">
						Use Case
					</Link>
				</Button>
				<Button
					asChild
					variant="ghost"
					className="rounded-full hover:!bg-sidebar-accent"
				>
					<Link
						className="text-sm"
						href="https://www.kapwing.com/e/68971253494d74d1a712ef3b"
						target="_blank"
					>
						Demo
					</Link>
				</Button>
			</div>

			<div className="flex items-center gap-2 -mr-2">
				{/*<ModeToggle className="!rounded-full" />*/}
				<Button asChild className="rounded-full">
					<Link className="text-sm" href="/auth/sign-in">
						Get Started
					</Link>
				</Button>
			</div>
		</header>
	);
}
