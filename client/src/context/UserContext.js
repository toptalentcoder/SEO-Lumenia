"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth"; // ✅ Import custom hook

const UserContext = createContext(undefined);

export function UserProvider({ children } ) {
  const { user, setUser, refreshUser, isHydrated } = useAuth();
  const [location, setLocation] = useState("United States"); // Default location
  const [isRefreshing, setIsRefreshing] = useState(false);
  const lastRefreshTime = useRef(0);

  const refreshUserData = async () => {
    // Prevent multiple simultaneous refreshes
    if (isRefreshing) return;
    
    // Rate limit refreshes to once every 5 seconds instead of 30
    const now = Date.now();
    if (now - lastRefreshTime.current < 5000) return;
    
    setIsRefreshing(true);
    lastRefreshTime.current = now;

    try {
      const res = await fetch("/api/users/me", {
        method: "GET",
        credentials: "include",
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (!res.ok) {
        console.warn("Session expired, logging out.");
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        setUser(null);
        return;
      }

      const data = await res.json();
      
      // Update both context and localStorage atomically
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Force a small delay to ensure state updates are processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (err) {
      console.error("Error refreshing session", err);
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
