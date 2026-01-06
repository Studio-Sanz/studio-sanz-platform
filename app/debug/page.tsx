"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function DebugPage() {
  const { data: session, isPending } = useSession();
  const [cookies, setCookies] = useState<string>("");
  const [envVars, setEnvVars] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get cookies
    setCookies(document.cookie);

    // Get public env vars
    setEnvVars({
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "not set",
      NODE_ENV: process.env.NODE_ENV || "not set",
    });
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/get-session", {
        credentials: "include",
      });
      const data = await response.json();
      console.log("Session check:", data);
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error checking auth:", error);
      alert("Error: " + error);
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Debug Information</h1>

      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Session Status</h2>
          <div className="space-y-2">
            <p>
              <strong>Pending:</strong> {isPending ? "Yes" : "No"}
            </p>
            <p>
              <strong>Session exists:</strong> {session ? "Yes" : "No"}
            </p>
            {session && (
              <div className="mt-2">
                <p>
                  <strong>User:</strong>
                </p>
                <pre className="bg-gray-100 p-2 rounded mt-1 overflow-auto">
                  {JSON.stringify(session.user, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Cookies</h2>
          <pre className="bg-gray-100 p-2 rounded overflow-auto text-sm">
            {cookies || "No cookies found"}
          </pre>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
          <pre className="bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Window Location</h2>
          <pre className="bg-gray-100 p-2 rounded overflow-auto text-sm">
            {typeof window !== "undefined" ? window.location.href : "N/A"}
          </pre>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Actions</h2>
          <Button onClick={checkAuth}>Check Auth Endpoint</Button>
        </div>
      </div>
    </div>
  );
}
