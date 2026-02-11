import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Globe,
  Monitor,
  User,
  Key,
  Loader2,
} from "lucide-react";
import { Session } from "better-auth";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";
import { Loader } from "@/components/ui/loader";

export default function SessionCard({
  session,
  onRevokeCallback,
}: {
  session: Session;
  onRevokeCallback: () => void;
}) {
  const [revoking, setRevoking] = useState(false);

  const isExpired = new Date() > session.expiresAt;
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const parseUserAgent = (userAgent?: string | null) => {
    if (!userAgent) return null;

    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
      return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Unknown Browser";
  };

  const revokeSession = async () => {
    setRevoking(true);
    await authClient.revokeSession(
      {
        token: session.token,
      },
      {
        onError: (error) => {
          toast.error(error.error.message);
        },
        onSuccess: () => {
          toast.success("Session revoked");
        },
        onResponse: () => {
          setRevoking(false);
          onRevokeCallback();
        },
      },
    );
  };

  return (
    <Card className="p-0 bg-sidebar !h-fit shadow-none hover:shadow-md transition">
      <CardHeader className="py-3 px-4 !pb-1.5 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {parseUserAgent(session.userAgent)}
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <Badge variant={isExpired ? "destructive" : "default"}>
              {isExpired ? "Expired" : "Active"}
            </Badge>
            <Button
              size="sm"
              className="h-[22.5px] text-xs"
              variant="outline"
              onClick={revokeSession}
              disabled={revoking}
            >
              Revoke
              {revoking && <Loader className="!h-3 !w-3" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-0 px-4 pb-3">
        <div className="grid gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Key className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Token:</span>
            <span className="font-mono text-xs truncate">
              {session.token.substring(0, 16)}...
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Created:</span>
            <span>{formatDate(session.createdAt)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Expires:</span>
            <span className={isExpired ? "text-destructive" : ""}>
              {formatDate(session.expiresAt)}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">IP Address:</span>
            <span className="font-mono">{session.ipAddress || "N/A"}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Browser:</span>
            <span>{parseUserAgent(session.userAgent) || "N/A"}</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Last updated: {formatDate(session.updatedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
