"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/protected");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              
              <Button
                type="button"
                className="w-full mt-2 flex items-center justify-center gap-2"
                variant="outline"
                disabled={isLoading}
                onClick={async () => {
                  const supabase = createClient();
                  setIsLoading(true);
                  setError(null);
                  try {
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: "spotify",
                      
                      options: {
                         scopes: "user-read-email user-read-private streaming user-modify-playback-state user-read-playback-state",
                        redirectTo: `http://10.178.173.29:3000/`,
                      },
                    });
                    if (error) throw error;
                    // The user will be redirected by Supabase
                  } catch (error: unknown) {
                    setError(error instanceof Error ? error.message : "An error occurred");
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                <svg width="20" height="20" viewBox="0 0 496 512" fill="currentColor" aria-hidden="true">
                  <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.6 365.1c-5.3 8.8-16.6 11.5-25.4 6.2-69.7-42.7-157.5-52.3-260.7-28.1-10.1 2.3-20.2-4.2-22.5-14.3-2.3-10.1 4.2-20.2 14.3-22.5 112.1-25.2 209.2-14.1 287.2 32.4 8.8 5.3 11.5 16.6 6.1 25.3zm35.5-61.2c-6.6 10.7-20.7 14.1-31.4 7.5-79.7-49-201.3-63.3-295.2-34.1-12 3.7-24.9-3-28.6-15-3.7-12 3-24.9 15-28.6 104.6-32.1 237.6-16.2 327.7 39.2 10.7 6.6 14.1 20.7 7.5 31.4zm38.7-65.6c-8.2 13.2-25.6 17.3-38.8 9.1-91.2-56.2-229.9-68.7-316.1-37-14.4 5.3-30.3-2.1-35.6-16.5-5.3-14.4 2.1-30.3 16.5-35.6 99.7-36.7 251.4-23.1 356.2 43.2 13.2 8.2 17.3 25.6 9.1 38.8z"/>
                </svg>
                Login with Spotify
              </Button>
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
