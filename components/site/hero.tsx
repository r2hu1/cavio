import { Button } from "../ui/button";

export default function Hero() {
	return (
		<section className="py-20 text-center sm:mt-10">
			<div className="mx-auto max-w-4xl space-y-5">
				<h1 className="text-3xl md:text-6xl leading-tight lg:text-7xl font-bold">
					Effortless Writing — AI Powered & Open-Source
				</h1>
				<p className="text-base md:text-xl leading-relaxed lg:text-2xl text-foreground/80">
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
