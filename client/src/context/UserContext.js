"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
    const { user, setUser, refreshUser, isHydrated } = useAuth();
    const [location, setLocation] = useState("United States"); // Default location

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setLocation(parsedUser.location || "United States");
            } catch (error) {
                console.error("Failed to parse stored user data:", error);
            }
        }
    }, [setUser]);

    if (!isHydrated) return null;

    return (
        <UserContext.Provider value={{ user, setUser, refreshUser, location, setLocation }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};