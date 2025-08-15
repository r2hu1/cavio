import { Button } from "../ui/button";

export default function Hero() {
	return (
		<section className="py-14 sm:py-20 sm:text-center sm:mt-10">
			<div className="mx-auto max-w-4xl space-y-5">
				<h2 className="leading-tight text-3xl font-bold text-gray-900 dark:text-gray-50 sm:text-6xl">
					Made Writing Beautiful,
					<span className="animate-text-gradient inline-flex bg-gradient-to-r from-neutral-900 via-slate-500 to-neutral-500 bg-[200%_auto] bg-clip-text leading-tight text-transparent dark:from-neutral-100 dark:via-slate-400 dark:to-neutral-400">
						AI Powered & Open-Source.
					</span>
				</h2>
				<p className="text-sm md:text-lg leading-relaxed lg:text-xl text-foreground/80">
					Write faster, clearer, and with more creativity using our open-source
					AI assistant — self-host it for full control, from quick notes to
					long-form content.
				</p>
			</div>
			<div className="mx-auto w-full max-w-7xl border p-1 rounded-lg shadow-xl !mt-14 md:!mt-32">
				<img src="/site/demo-dash.png" className="w-full rounded-lg" />
			</div>
		</section>
	);
}
