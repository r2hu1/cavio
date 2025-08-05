import { AiChatInputProvider } from "@/modules/ai/views/providers/input-provider";
import StaticInput from "@/modules/ai/views/ui/static-input";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AiChatInputProvider>
      <div className="relative">
        {children}
        <StaticInput />
      </div>
    </AiChatInputProvider>
  );
}
