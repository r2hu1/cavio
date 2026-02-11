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
  setCommandModel
} from "@/modules/ai/views/creds/lib";
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
  const [apiKey, setApiKeyValue] = useState<string>("");
  const [chatModel, setChatModelValue] = useState<string>("gemini-2.5-flash");
  const [commandModel, setCommandModelValue] = useState<string>("gemini-2.5-flash");
  const [models, setModels] = useState<Model[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!apiKey) return;
    await setApiKey(apiKey);
    toast.success("API key updated successfully");
    fetchModels(apiKey);
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

  const fetchModels = async (key: string) => {
    if (!key) {
      setModels([]);
      return;
    }
    
    setIsLoadingModels(true);
    try {
      const response = await fetch("/api/ai/models");
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

  const getKey = async () => {
    const key = await getApiKey();
    setApiKeyValue(key || "");
    if (key) {
      fetchModels(key);
    }
  };

  const getCurrentModels = async () => {
    const chat = await getChatModel();
    const command = await getCommandModel();
    setChatModelValue(chat);
    setCommandModelValue(command);
  };

  useEffect(() => {
    getKey();
    getCurrentModels();
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
              {apiKey ? "No models available" : "Add an API key to see available models"}
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
        {apiKey ? description : "Add an API key to see available models."}
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
            Manage your preferences here.
          </p>
        </div>
      </div>
      <div>
        <div className="grid gap-6">
          <form className="space-y-3" onSubmit={handleSave}>
            <Label htmlFor="gemini-api-key">Gemini API Key</Label>
            <div className="flex w-full gap-2">
              <Input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKeyValue(e.target.value)}
                id="gemini-api-key"
                name="gemini-api-key"
                placeholder="AIza................"
              />
              <Button size="icon" type="submit">
                <Save className="!h-4 !w-4" />
              </Button>
            </div>
            <p className="text-xs text-foreground/60 -mt-2">
              Its safe, never sync with server, stored locally!
            </p>
          </form>

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
