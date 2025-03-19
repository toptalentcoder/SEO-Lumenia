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
        }
    }, [pathname, isHydrated, router]);

    const refreshUser = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                console.warn("No auth token found, cannot refresh user.");
                return;
            }

            const response = await fetch("http://localhost:7777/api/usrInfo", {
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
