"use client";
import { useState, useEffect } from "react";

export function useStreamText(input: string | undefined, speed = 40) {
	const safeText = typeof input === "string" ? input : "";
	const [streamed, setStreamed] = useState("");
	const [completed, setCompleted] = useState(false);

	useEffect(() => {
		if (completed) return;
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

		setCompleted(true);
		return () => clearInterval(interval);
	}, []);

	return streamed;
}
