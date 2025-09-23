import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function AuthCodeError({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-red-500">
            Authentication Error
          </CardTitle>
          <CardDescription className="text-center">
            There was an error during the authentication process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          <p className="text-sm text-muted-foreground text-center">
            This could be due to:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Cancelling the authentication process</li>
            <li>Network connectivity issues</li>
            <li>Invalid or expired authentication code</li>
            <li>Supabase configuration issues</li>
          </ul>
          <div className="pt-4">
            <Button asChild className="w-full">
              <Link href="/auth/login">
                Try Again
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}