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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [chatModel, setChatModelValue] = useState<string>("gemini-2.5-flash");
  const [commandModel, setCommandModelValue] = useState<string>("gemini-2.5-flash");
  const [models, setModels] = useState<Model[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentKey = apiKeys[provider];
    if (!currentKey) return;
    await setApiKey(provider, currentKey);
    toast.success(`${PROVIDER_CONFIG[provider].name} API key updated successfully`);
    fetchModels(currentKey);
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
    // Fetch models for the new provider if API key exists
    const key = apiKeys[value];
    if (key) {
      fetchModels(key);
    } else {
      setModels([]);
    }
  };

  const handleApiKeyChange = (provider: AIProvider, value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
  };

  const fetchModels = async (key: string) => {
    if (!key) {
      setModels([]);
      return;
    }
    
    setIsLoadingModels(true);
    try {
      const response = await fetch(`/api/ai/models?provider=${provider}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch models");
      }
      const data = await response.json();
      setModels(data.models || []);
    } catch (error: any) {
      console.error("Error fetching models:", error);
      toast.error(error.message || "Failed to fetch models");
      setModels([]);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const loadSettings = async () => {
    const currentProvider = await getProvider();
    setProviderValue(currentProvider);

    // Load API keys for all providers
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

    // Load models if current provider has a key
    const currentKey = keys[currentProvider];
    if (currentKey) {
      fetchModels(currentKey);
    }

    // Load model preferences
    const chat = await getChatModel();
    const command = await getCommandModel();
    setChatModelValue(chat);
    setCommandModelValue(command);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const renderModelSelect = (
    value: string,
    onChange: (value: string) => void,
    label: string,
    description: string
  ) => (
    <div className="space-y-3">
      <Label>{label}</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={isLoadingModels || models.length === 0}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={isLoadingModels ? "Loading models..." : "Select a model"} />
        </SelectTrigger>
        <SelectContent className="max-w-100" align="center">
          {isLoadingModels ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : models.length === 0 ? (
            <div className="px-2 py-4 text-sm text-muted-foreground text-center">
              {apiKeys[provider] ? "No models available" : "Add an API key to see available models"}
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
        {apiKeys[provider] ? description : "Add an API key to see available models."}
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
          {/* Provider Selection */}
          <div className="space-y-3">
            <Label>AI Provider</Label>
            <Select 
              value={provider} 
              onValueChange={(value) => handleProviderChange(value as AIProvider)}
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
            <p className="text-xs text-foreground/60 -mt-2">
              {PROVIDER_CONFIG[provider].description}
            </p>
          </div>

          {/* API Keys for all providers */}
          <div className="border-t pt-4">
            <h2 className="font-medium mb-4">API Keys</h2>
            <div className="space-y-4">
              {(Object.keys(PROVIDER_CONFIG) as AIProvider[]).map((p) => (
                <form key={p} className="space-y-2" onSubmit={handleSave}>
                  <Label htmlFor={`${p}-api-key`}>{PROVIDER_CONFIG[p].name} API Key</Label>
                  <div className="flex w-full gap-2">
                    <Input
                      type="password"
                      value={apiKeys[p]}
                      onChange={(e) => handleApiKeyChange(p, e.target.value)}
                      id={`${p}-api-key`}
                      name={`${p}-api-key`}
                      placeholder={PROVIDER_CONFIG[p].placeholder}
                    />
                    <Button size="icon" type="submit" disabled={provider !== p}>
                      <Save className="!h-4 !w-4" />
                    </Button>
                  </div>
                </form>
              ))}
            </div>
            <p className="text-xs text-foreground/60 mt-2">
              Your API keys are stored locally and never sent to our servers.
            </p>
          </div>

          {/* Model Selection */}
          <div className="border-t pt-4">
            <h2 className="font-medium mb-4">AI Models</h2>
            <div className="grid gap-6">
              {renderModelSelect(
                chatModel,
                handleChatModelChange,
                "Chat Model",
                "Model used for AI chat conversations."
              )}
              
              {renderModelSelect(
                commandModel,
                handleCommandModelChange,
                "Command & Copilot Model",
                "Model used for editor commands and copilot suggestions."
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
