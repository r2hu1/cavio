import Header from "@/components/site/header";
import Hero from "@/components/site/hero";

export default function Home() {
	return (
		<div className="px-6">
			<div className="absolute top-0 left-0 right-0 z-[-2] h-full w-full bg-background bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
			<Header />
			<Hero />
		</div>
	);
}
