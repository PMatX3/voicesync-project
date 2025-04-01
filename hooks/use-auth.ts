// hooks/use-auth.ts
"use client";

import { useState, useEffect } from "react";

// Define the shape of your session user (optional, for TypeScript)
interface SessionUser {
  email: string;
  role: string;
}

interface Session {
  user: SessionUser;
  expires: string;
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        // Check if the response contains a user object
        if (data && Object.keys(data).length > 0 && data.user) {
          setSession(data as Session);
        } else {
          setSession(null);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    // Optional: Poll for session updates (e.g., every 5 minutes)
    const interval = setInterval(fetchSession, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { session, loading };
}
