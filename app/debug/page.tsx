"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function DebugPage() {
  const { data: session, isPending } = useSession();
  const [cookies, setCookies] = useState<string>("");
  const [envVars, setEnvVars] = useState<Record<string, string>>({});
  const [serverCookies, setServerCookies] = useState<any>(null);

  useEffect(() => {
    // Get cookies
    setCookies(document.cookie);

    // Get public env vars
    setEnvVars({
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "not set",
      NODE_ENV: process.env.NODE_ENV || "not set",
    });

    // Get server-side cookies
    fetch("/api/debug/cookies", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setServerCookies(data))
      .catch((err) => console.error("Error fetching server cookies:", err));
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/get-session", {
        credentials: "include",
      });

      console.log("Response headers:", response.headers);
      const data = await response.json();
      console.log("Session check:", data);
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error checking auth:", error);
      alert("Error: " + error);
    }
  };

  const testLogin = async () => {
    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: "admin@studiosanz.com",
          password: "admin123",
        }),
      });

      console.log("Login response status:", response.status);
      console.log("Login response headers:");
      response.headers.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
      });

      const data = await response.json();
      console.log("Login response data:", data);

      // Recargar cookies después del login
      setCookies(document.cookie);

      // Recargar cookies del servidor
      const serverCookiesRes = await fetch("/api/debug/cookies", {
        credentials: "include",
      });
      const serverCookiesData = await serverCookiesRes.json();
      setServerCookies(serverCookiesData);

      alert("Login response:\n" + JSON.stringify(data, null, 2) +
            "\n\nClient cookies: " + (document.cookie || "No cookies") +
            "\n\nServer has auth token: " + serverCookiesData.hasBetterAuthToken +
            "\n\nCheck console for full details.");
    } catch (error) {
      console.error("Error testing login:", error);
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
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded mb-2">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Important:</strong> HttpOnly cookies (like auth tokens) are NOT visible here for security.
              They are sent automatically with requests. Check Network tab &gt; Request Headers to verify.
            </p>
          </div>

          <h3 className="font-semibold mt-4 mb-2">Client-side (document.cookie):</h3>
          <pre className="bg-gray-100 p-2 rounded overflow-auto text-sm">
            {cookies || "No cookies accessible from JavaScript (this is normal for httpOnly cookies)"}
          </pre>

          <h3 className="font-semibold mt-4 mb-2">Server-side (cookies seen by API):</h3>
          {serverCookies ? (
            <div className="space-y-2">
              <div className={`p-2 rounded ${serverCookies.hasBetterAuthToken ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <p className="text-sm font-semibold">
                  {serverCookies.hasBetterAuthToken ? "✅ better-auth.session_token FOUND" : "❌ better-auth.session_token NOT FOUND"}
                </p>
              </div>
              <pre className="bg-gray-100 p-2 rounded overflow-auto text-sm">
                {JSON.stringify(serverCookies, null, 2)}
              </pre>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading server cookies...</p>
          )}
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
          <div className="flex gap-2">
            <Button onClick={checkAuth}>Check Auth Endpoint</Button>
            <Button onClick={testLogin} variant="secondary">
              Test Login (admin@studiosanz.com)
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Use "Test Login" to verify if cookies are being set correctly
          </p>
        </div>
      </div>
    </div>
  );
}
