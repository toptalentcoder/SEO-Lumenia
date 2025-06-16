"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth"; // ✅ Import custom hook
import { useRouter } from "next/navigation";

const UserContext = createContext(undefined);

export function UserProvider({ children } ) {
  const { user, setUser, refreshUser, isHydrated } = useAuth();
  const [location, setLocation] = useState("United States"); // Default location
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastRefreshTime = useRef(0);
  const router = useRouter();

  const refreshUserData = async () => {
    // Prevent multiple simultaneous refreshes
    if (isRefreshing) return;
    
    // Rate limit refreshes to once every 5 seconds
    const now = Date.now();
    if (now - lastRefreshTime.current < 5000) return;
    
    setIsRefreshing(true);
    lastRefreshTime.current = now;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.warn("No auth token found during refresh");
        localStorage.removeItem("user");
        setUser(null);
        router.push("/auth/signin");
        return;
      }

      // Check token expiry
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.tokenExpiry && new Date(userData.tokenExpiry) < new Date()) {
            console.warn("Token expired, logging out...");
            localStorage.removeItem("user");
            localStorage.removeItem("authToken");
            setUser(null);
            router.push("/auth/signin");
            return;
          }
        } catch (error) {
          console.error("Error parsing stored user data:", error);
        }
      }

      const res = await fetch("/api/users/me", {
        method: "GET",
        credentials: "include",
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        console.warn("Session expired or invalid, logging out.");
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        setUser(null);
        router.push("/auth/signin");
        return;
      }

      const data = await res.json();
      if (!data.user) {
        throw new Error("Invalid user data received");
      }
      
      // Add token expiry to user data
      const userData = {
        ...data.user,
        tokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      };
      
      // Update both context and localStorage atomically
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
    } catch (err) {
      console.error("Error refreshing session", err);
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");
      setUser(null);
      router.push("/auth/signin");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Update location once user data is loaded
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setLocation(parsedUser.location || "United States"); // ✅ Use stored location or fallback
      } catch (error) {
        console.error("❌ Failed to parse stored user data:", error);
      }
    }
  }, [setUser]);

  // ⛔ Prevent rendering until hydration is complete
  if (!isHydrated) return null;

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser, refreshUserData, location, setLocation }}>
      {children}
    </UserContext.Provider>
  );
}

// ✅ Custom hook to use user data globally
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
