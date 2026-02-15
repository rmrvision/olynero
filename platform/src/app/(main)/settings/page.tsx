"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground mb-8">Manage your account settings and preferences.</p>

            <Separator className="mb-8" />

            <div className="space-y-8">
                {/* Profile Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">Profile</h2>
                    <div className="grid gap-4 max-w-md">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Display Name</Label>
                            <Input id="name" defaultValue="John Doe" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" defaultValue="john@example.com" disabled />
                            <p className="text-xs text-muted-foreground">Your email address is managed by your provider.</p>
                        </div>
                        <Button>Save Changes</Button>
                    </div>
                </section>

                <Separator />

                {/* API Keys Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4">API Keys</h2>
                    <div className="border rounded-lg p-4 bg-muted/30">
                        <p className="text-sm text-muted-foreground mb-4">Manage your personal API keys for accessing the Olynero SDK.</p>
                        <Button variant="outline">Create New Key</Button>
                    </div>
                </section>

                <Separator />

                {/* Danger Zone */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h2>
                    <div className="border border-destructive/20 rounded-lg p-4 bg-destructive/5 flex items-center justify-between">
                        <div>
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm text-muted-foreground">Permanently remove your account and all of its data.</p>
                        </div>
                        <Button variant="destructive">Delete Account</Button>
                    </div>
                </section>
            </div>
        </div>
    )
}
