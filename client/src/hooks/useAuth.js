"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export function useAuth() {
    const [user, setUser] = useState(null);
    const [isHydrated, setIsHydrated] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (typeof window === "undefined") return;

        setIsHydrated(true);

        const token = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("user");

<<<<<<< HEAD
        if (token && storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
            } catch (error) {
                console.error("Invalid user data in localStorage", error);
                localStorage.removeItem("user");
                setUser(null);
            }
        } else {
            const publicPaths = ["/", "/auth/signup", "/auth/signin", "/privacy-policy", "/terms-of-service"];

            if (pathname && !publicPaths.includes(pathname) && isHydrated) {
                console.warn("Redirecting to signin...");
                router.push("/auth/signin");
            }
=======
        if (!token || !storedUser) {
            const publicPaths = ["/", "/auth/signup", "/auth/signin", "/privacy-policy", "/terms-of-service"];
            if (pathname && !publicPaths.includes(pathname) && isHydrated) {
                console.warn("No auth token found, redirecting to signin...");
                localStorage.removeItem("authToken");
                localStorage.removeItem("user");
                setUser(null);
                router.push("/auth/signin");
            }
            return;
        }

        try {
            const userData = JSON.parse(storedUser);
            // Check if the token is expired
            const tokenExpiry = userData.tokenExpiry;
            if (tokenExpiry && new Date(tokenExpiry) < new Date()) {
                console.warn("Token expired, redirecting to signin...");
                localStorage.removeItem("authToken");
                localStorage.removeItem("user");
                setUser(null);
                router.push("/auth/signin");
                return;
            }
            setUser(userData);
        } catch (error) {
            console.error("Invalid user data in localStorage", error);
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
            setUser(null);
            router.push("/auth/signin");
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
        }
    }, [pathname, isHydrated, router]);

    const refreshUser = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.warn("No auth token found, cannot refresh user.");
                return;
            }

<<<<<<< HEAD
            const response = await fetch("/api/usrInfo", {
=======
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usrInfo`, {
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.warn("Unauthorized, logging out...");
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("user");
                    setUser(null);
                    router.push("/auth/signin");
                }
                throw new Error("Failed to fetch user data");
            }

            const data = await response.json();
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
        } catch (error) {
            console.error("Error refreshing user data:", error);
            localStorage.removeItem("user");
            setUser(null);
        }
    };

    return { user, setUser, refreshUser, isHydrated };
}
