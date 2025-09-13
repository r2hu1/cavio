"use client";
import { Button } from "@/components/ui/button";
import SessionPageNav from "./settings-page-nav";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { getApiKey, setApiKey } from "@/modules/ai/views/creds/lib";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PreferencesPageView() {
  const [apiKey, setApiKeyValue] = useState<string>("");

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!apiKey) return;
    await setApiKey(apiKey);
    toast.success("API key updated successfully");
  };

  const getKey = async () => {
    const key = await getApiKey();
    setApiKeyValue(key || "");
  };
  useEffect(() => {
    getKey();
  }, []);

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
        <div className="grid gap-3">
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
              <Button size="icon">
                <Save className="!h-4 !w-4" />
              </Button>
            </div>
            <p className="text-xs text-foreground/60 -mt-2">
              Its safe, never sync with server, stored locally!
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
