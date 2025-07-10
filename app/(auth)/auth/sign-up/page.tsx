"use client";
import SocialSignInButton from "@/components/auth/social-signin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth-client";
import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const firstName = formData.get("first-name");
      const lastName = formData.get("last-name");
      const email = formData.get("email");
      const password = formData.get("password");
      const { error } = await signUp.email({
        email: email as string,
        password: password as string,
        name: `${firstName} ${lastName}`,
      });
      if (error) {
        setError(error?.message);
        toast.error(error?.message);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  return (
    <div>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input type="text" id="first-name" name="first-name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input type="text" id="last-name" name="last-name" required />
              </div>
            </div>
            <Label className="mb-2" htmlFor="email">
              Email
            </Label>
            <Input type="email" id="email" name="email" required />
            <Label className="mb-2" htmlFor="password">
              Password
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
            {error && (
              <div className="bg-secondary items-center justify-center flex h-12 rounded-lg">
                <p className="text-sm text-foreground/80">{error}</p>
              </div>
            )}
            <Button disabled={loading} className="w-full" type="submit">
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="grid">
          <div className="text-center">
            <p className="text-center">or</p>
          </div>
          <div className="grid grid-cols-2 gap-2 w-full">
            <SocialSignInButton type="github" />
            <SocialSignInButton type="google" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
