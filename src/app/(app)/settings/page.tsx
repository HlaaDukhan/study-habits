"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      <Card className="bg-card border-border mb-6">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Email</span>
            <span className="text-foreground/80 text-sm">
              {session?.user?.email}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">Name</span>
            <span className="text-foreground/80 text-sm">
              {session?.user?.name || "Not set"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground text-lg">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator className="bg-border" />
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="border-red-900 text-red-400 hover:bg-red-900/20"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
