// app/auth/signin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  useEffect(() => {
    const storedLogs = localStorage.getItem("debugLogs");
    if (storedLogs) {
      setDebugLogs(JSON.parse(storedLogs));
    }
  }, []);

  const addDebugLog = (message: string) => {
    console.log(message);
    const updatedLogs = [...debugLogs, message];
    localStorage.setItem("debugLogs", JSON.stringify(updatedLogs));
    setDebugLogs(updatedLogs);
  };

  const downloadLogs = () => {
    const logsText = debugLogs.join("\n");
    const blob = new Blob([logsText], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "debug-logs.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    setDebugLogs([]);
    localStorage.removeItem("debugLogs");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addDebugLog(`Submitting: ${JSON.stringify({ email, password })}`);

    try {
      // Step 1: Get CSRF token
      addDebugLog("Fetching CSRF token...");
      const csrfResponse = await fetch("/api/auth/csrf");
      if (!csrfResponse.ok) {
        throw new Error(`Failed to fetch CSRF token: ${csrfResponse.status}`);
      }
      const { csrfToken } = await csrfResponse.json();
      addDebugLog(`CSRF Token: ${csrfToken}`);

      // Step 2: Create a form and submit it to /api/auth/callback/credentials
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/api/auth/callback/credentials";
      form.style.display = "none";

      const addField = (name: string, value: string) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };

      addField("csrfToken", csrfToken);
      addField("email", email);
      addField("password", password);
      addField("callbackUrl", "http://localhost:3000/");
      addField("json", "true");

      document.body.appendChild(form);
      addDebugLog("Submitting form to /api/auth/callback/credentials...");
      form.submit();
    } catch (error) {
      addDebugLog(`Sign-in error: ${error}`);
      toast({
        title: "Sign In Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                addDebugLog(`Email changed to: ${e.target.value}`);
              }}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                addDebugLog(`Password changed to: ${e.target.value}`);
              }}
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          <h3>Debug Logs:</h3>
          <pre>{debugLogs.join("\n")}</pre>
          <Button onClick={downloadLogs} className="mt-2 mr-2">
            Download Debug Logs
          </Button>
          <Button onClick={clearLogs} className="mt-2">
            Clear Debug Logs
          </Button>
        </div>
      </Card>
    </div>
  );
}
