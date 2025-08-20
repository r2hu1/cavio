"use client";
import { useState, useEffect } from "react";

export function useStreamText(input: string | undefined, speed = 40) {
	const safeText = typeof input === "string" ? input : "";
	const [streamed, setStreamed] = useState("");

	useEffect(() => {
		setStreamed("");
		let i = 0;
		const interval = setInterval(() => {
			if (i < safeText.length) {
				const char = safeText.charAt(i);
				setStreamed((prev) => prev + char);
				i++;
			} else {
				clearInterval(interval);
			}
		}, speed);

		return () => clearInterval(interval);
	}, [safeText, speed]);

	return streamed;
}
