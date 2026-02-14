"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { PROVIDER_CONFIG } from "@/modules/ai/constants/providers";
import type { AIProvider } from "@/modules/ai/types";
import {
	getAllApiKeys,
	getChatModel,
	getCommandModel,
	getProvider,
	setApiKey,
	setChatModel,
	setCommandModel,
	setProvider,
} from "@/modules/ai/views/creds/lib";
import { Loader2, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import SessionPageNav from "./settings-page-nav";

interface Model {
	value: string;
	label: string;
	description?: string;
	version?: string;
}

export default function PreferencesPageView() {
	const [provider, setProviderValue] = useState<AIProvider>("gemini");
	const [apiKeys, setApiKeys] = useState<Record<AIProvider, string>>({
		gemini: "",
		openrouter: "",
		groq: "",
	});
	const [chatModel, setChatModelValue] = useState<string>("");
	const [commandModel, setCommandModelValue] = useState<string>("");
	const [models, setModels] = useState<Model[]>([]);
	const [isLoadingModels, setIsLoadingModels] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);

	const fetchingProviderRef = useRef<AIProvider | null>(null);

	const handleSavePreferences = async () => {
		setIsSaving(true);
		try {
			const key = apiKeys[provider].trim();

			// Save all preferences
			await setProvider(provider);

			if (key) {
				await setApiKey(provider, key);
			}

			if (chatModel) {
				await setChatModel(chatModel);
			}

			if (commandModel) {
				await setCommandModel(commandModel);
			}

			toast.success("Preferences saved successfully");

			// Refresh models if API key is present
			if (key) {
				fetchModels(key, provider);
			}
		} catch (error) {
			toast.error("Failed to save preferences");
			console.error(error);
		} finally {
			setIsSaving(false);
		}
	};

	const handleProviderChange = (value: AIProvider) => {
		setProviderValue(value);
		const key = apiKeys[value];
		if (key) {
			fetchModels(key, value);
		} else {
			setModels([]);
		}
	};

	const handleChatModelChange = (value: string) => {
		setChatModelValue(value);
	};

	const handleCommandModelChange = (value: string) => {
		setCommandModelValue(value);
	};

	const handleApiKeyChange = (provider: AIProvider, value: string) => {
		setApiKeys((prev) => ({ ...prev, [provider]: value }));
	};

	const getCheapestModel = (availableModels: Model[]): string => {
		const flashModel = availableModels.find((m) =>
			m.value.toLowerCase().includes("flash"),
		);
		if (flashModel) return flashModel.value;

		const liteModel = availableModels.find((m) =>
			m.value.toLowerCase().includes("lite"),
		);
		if (liteModel) return liteModel.value;

		return availableModels[0]?.value || "";
	};

	const fetchModels = async (key: string, targetProvider: AIProvider) => {
		if (!key) {
			setModels([]);
			return;
		}

		fetchingProviderRef.current = targetProvider;
		setIsLoadingModels(true);

		try {
			const response = await fetch(`/api/ai/models?provider=${targetProvider}`);
			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to fetch models");
			}
			const data = await response.json();
			const availableModels = data.models || [];

			if (fetchingProviderRef.current !== targetProvider) {
				console.log("Provider changed during fetch, discarding results");
				return;
			}

			setModels(availableModels);

			const modelValues = availableModels.map((m: Model) => m.value);

			if (isInitialized && availableModels.length > 0) {
				const currentChatValue = chatModel;
				const currentCommandValue = commandModel;

				// Set fallback if no model selected or current model not available
				if (!currentChatValue || !modelValues.includes(currentChatValue)) {
					const fallbackModel = getCheapestModel(availableModels);
					if (fallbackModel) {
						setChatModelValue(fallbackModel);
					}
				}

				if (
					!currentCommandValue ||
					!modelValues.includes(currentCommandValue)
				) {
					const fallbackModel = getCheapestModel(availableModels);
					if (fallbackModel) {
						setCommandModelValue(fallbackModel);
					}
				}
			}
		} catch (error: any) {
			console.error("Error fetching models:", error);
			toast.error(error.message || "Failed to fetch models");
			setModels([]);
		} finally {
			if (fetchingProviderRef.current === targetProvider) {
				setIsLoadingModels(false);
			}
		}
	};

	const loadSettings = async () => {
		const currentProvider = await getProvider();
		setProviderValue(currentProvider);

		const keys = await getAllApiKeys();
		setApiKeys(keys);

		const chat = await getChatModel();
		const command = await getCommandModel();
		setChatModelValue(chat);
		setCommandModelValue(command);

		setIsInitialized(true);

		const currentKey = keys[currentProvider];
		if (currentKey) {
			fetchModels(currentKey, currentProvider);
		}
	};

	useEffect(() => {
		loadSettings();
	}, []);

	const renderModelSelect = (
		value: string,
		onChange: (value: string) => void,
		label: string,
		description: string,
	) => (
		<div className="space-y-3">
			<Label>{label}</Label>
			<Select
				value={value}
				onValueChange={onChange}
				disabled={isLoadingModels || models.length === 0}
			>
				<SelectTrigger className="w-full">
					<SelectValue
						placeholder={
							isLoadingModels ? "Loading models..." : "Select a model"
						}
					/>
				</SelectTrigger>
				<SelectContent className="max-w-100" align="center">
					{isLoadingModels ? (
						<div className="flex items-center justify-center py-4">
							<Loader2 className="h-4 w-4 animate-spin" />
						</div>
					) : models.length === 0 ? (
						<div className="px-2 py-4 text-sm text-muted-foreground text-center">
							{apiKeys[provider]
								? "No models available"
								: "Add an API key to see available models"}
						</div>
					) : (
						models.map((model) => (
							<SelectItem key={model.value} value={model.value}>
								{model.label}
							</SelectItem>
						))
					)}
				</SelectContent>
			</Select>
			<p className="text-xs text-foreground/60 -mt-2">
				{apiKeys[provider]
					? description
					: "Add an API key to see available models."}
			</p>
		</div>
	);

	return (
		<div>
			<SessionPageNav active={"preferences"} />
			<div>
				<div className="grid gap-6">
					<div className="space-y-3">
						<Label className="text-base font-medium">AI Provider</Label>
						<p className="text-xs text-foreground/60 mb-4! -mt-2!">
							Your API keys are encrypted and stored securely in our database.
						</p>
						<Select
							value={provider}
							onValueChange={(value) =>
								handleProviderChange(value as AIProvider)
							}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select a provider" />
							</SelectTrigger>
							<SelectContent>
								{(Object.keys(PROVIDER_CONFIG) as AIProvider[]).map((p) => (
									<SelectItem key={p} value={p}>
										{PROVIDER_CONFIG[p].name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor={`${provider}-api-key`}>
								{PROVIDER_CONFIG[provider].name} API Key
							</Label>
							<Input
								type="password"
								value={apiKeys[provider]}
								onChange={(e) => handleApiKeyChange(provider, e.target.value)}
								id={`${provider}-api-key`}
								name={`${provider}-api-key`}
								placeholder={PROVIDER_CONFIG[provider].placeholder}
							/>
						</div>
					</div>

					<div className="grid gap-4">
						{renderModelSelect(
							chatModel,
							handleChatModelChange,
							"Chat Model",
							"",
						)}

						{renderModelSelect(
							commandModel,
							handleCommandModelChange,
							"Command & Copilot Model",
							"",
						)}
					</div>

					<div className="flex justify-end">
						<Button
							size="sm"
							onClick={handleSavePreferences}
							disabled={isSaving}
						>
							Save
							{isSaving ? (
								<Loader className="h-4 w-4 mr-2" />
							) : (
								<Save className="h-4 w-4 mr-2" />
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
