"use client";
import { Button } from "@/components/ui/button";
import SessionPageNav from "./settings-page-nav";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Loader2 } from "lucide-react";
import {
  getApiKey,
  setApiKey,
  getChatModel,
  setChatModel,
  getCommandModel,
  setCommandModel,
  getProvider,
  setProvider,
} from "@/modules/ai/views/creds/lib";
import { AIProvider } from "@/modules/ai/types";
import { PROVIDER_CONFIG } from "@/modules/ai/constants/providers";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "@/components/ui/loader";

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

  const handleSaveAllKeys = async () => {
    setIsSaving(true);
    try {
      const promises: Promise<void>[] = [];
      const savedProviders: string[] = [];

      for (const p of Object.keys(PROVIDER_CONFIG) as AIProvider[]) {
        const key = apiKeys[p].trim();
        if (key) {
          promises.push(setApiKey(p, key));
          savedProviders.push(PROVIDER_CONFIG[p].name);
        }
      }

      if (promises.length === 0) {
        toast.warning("No API keys to save");
        return;
      }

      await Promise.all(promises);
      toast.success(`API keys saved for: ${savedProviders.join(", ")}`);
      const currentKey = apiKeys[provider];
      if (currentKey) {
        fetchModels(currentKey, provider);
      }
    } catch (error) {
      toast.error("Failed to save API keys");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChatModelChange = async (value: string) => {
    setChatModelValue(value);
    await setChatModel(value);
    toast.success("Chat model updated successfully");
  };

  const handleCommandModelChange = async (value: string) => {
    setCommandModelValue(value);
    await setCommandModel(value);
    toast.success("Command/Copilot model updated successfully");
  };

  const handleProviderChange = async (value: AIProvider) => {
    setProviderValue(value);
    await setProvider(value);
    toast.success(`Provider changed to ${PROVIDER_CONFIG[value].name}`);
    const key = apiKeys[value];
    if (key) {
      fetchModels(key, value);
    } else {
      setModels([]);
    }
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

        if (currentChatValue && !modelValues.includes(currentChatValue)) {
          const fallbackModel = getCheapestModel(availableModels);
          if (fallbackModel) {
            setChatModelValue(fallbackModel);
            await setChatModel(fallbackModel);
            toast.info(`Chat model updated to ${fallbackModel}`);
          }
        }

        if (currentCommandValue && !modelValues.includes(currentCommandValue)) {
          const fallbackModel = getCheapestModel(availableModels);
          if (fallbackModel) {
            setCommandModelValue(fallbackModel);
            await setCommandModel(fallbackModel);
            toast.info(`Command model updated to ${fallbackModel}`);
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

    const keys: Record<AIProvider, string> = {
      gemini: "",
      openrouter: "",
      groq: "",
    };

    for (const p of Object.keys(PROVIDER_CONFIG) as AIProvider[]) {
      const key = await getApiKey(p);
      if (key) keys[p] = key;
    }
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
      <div className="mb-10 flex gap-2 items-center justify-between">
        <div>
          <h1 className="font-medium text-lg">Preferences</h1>
          <p className="text-sm text-foreground/80">
            Manage your AI preferences here.
          </p>
        </div>
      </div>
      <div>
        <div className="grid gap-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">AI Provider</Label>
            <p className="text-xs text-foreground/60 mb-4! -mt-2!">
              Your API keys are stored locally and never sent to our servers.
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

          <div className="border-t pt-4">
            <h2 className="font-medium mb-4">API Keys</h2>
            <div className="space-y-4">
              {(Object.keys(PROVIDER_CONFIG) as AIProvider[]).map((p) => (
                <div key={p} className="space-y-2">
                  <Label htmlFor={`${p}-api-key`}>
                    {PROVIDER_CONFIG[p].name} API Key
                  </Label>
                  <Input
                    type="password"
                    value={apiKeys[p]}
                    onChange={(e) => handleApiKeyChange(p, e.target.value)}
                    id={`${p}-api-key`}
                    name={`${p}-api-key`}
                    placeholder={PROVIDER_CONFIG[p].placeholder}
                  />
                </div>
              ))}
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={handleSaveAllKeys}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader className="h-4 w-4 mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="font-medium mb-5">AI Models</h2>
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
          </div>
        </div>
      </div>
    </div>
  );
}
