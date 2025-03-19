"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const PlanContext = createContext(undefined);

export const PlanProvider = ({ children }) => {
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [selectedPlanName, setSelectedPlanName] = useState(null);

    // ✅ Load from localStorage when the app starts
    useEffect(() => {
        const storedPlanId = localStorage.getItem("selectedPlanId");
        const storedPlanName = localStorage.getItem("selectedPlanName");

        if (storedPlanId && storedPlanName) {
            setSelectedPlanId(storedPlanId);
            setSelectedPlanName(storedPlanName);
        }
    }, []);

    const setPlan = (planId, planName) => {
        setSelectedPlanId(planId);
        setSelectedPlanName(planName);
        localStorage.setItem("selectedPlanId", planId);
        localStorage.setItem("selectedPlanName", planName);
    };

    const clearPlan = () => {
        setSelectedPlanId(null);
        setSelectedPlanName(null);
        localStorage.removeItem("selectedPlanId");
        localStorage.removeItem("selectedPlanName");
    };

    return (
        <PlanContext.Provider value={{ selectedPlanId, selectedPlanName, setPlan, clearPlan }}>
            {children}
        </PlanContext.Provider>
    );
};

export const usePlan = () => {
    const context = useContext(PlanContext);
    if (!context) {
        throw new Error("usePlan must be used within a PlanProvider");
    }
    return context;
};
