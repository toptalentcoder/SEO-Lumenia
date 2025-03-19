"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { usePlan } from "../../context/UserPlanContext";

export default function PricingTable({ isUpdatingSubscription }) {
    const { user, refreshUser } = useUser();
    const [plans, setPlans] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const { selectedPlanId, selectedPlanName, setPlan } = usePlan();
    const [billingCycle, setBillingCycle] = useState("monthly");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState("subscription"); // State for active tab

    // Function to fetch plans for subscription
    const fetchSubscriptionPlans = async () => {
        try {
            const response = await fetch("/api/plans");
            const data = await response.json();
            if (Array.isArray(data.fetchedPlans.subscriptionPlans)) {
                setPlans(data.fetchedPlans.subscriptionPlans);
                if (data.fetchedPlans.subscriptionPlans.length > 0) {
                    const firstPlan = data.fetchedPlans.subscriptionPlans[0];
                    setBillingCycle(firstPlan.interval_unit === "MONTH" ? "monthly" : "annually");
                }
            } else {
                setPlans([]);
            }
        } catch (error) {
            console.error("Error fetching plans:", error);
        } finally {
            setFetchLoading(false);
        }
    };

    // Function to fetch plans for API-based plans
    const fetchApiPlans = async () => {
        try {
            const response = await fetch("/api/api-plans"); // Modify this endpoint as needed
            const data = await response.json();
            if (Array.isArray(data.apiPlans)) {
                setPlans(data.apiPlans); // Set API-based plans
            } else {
                setPlans([]);
            }
        } catch (error) {
            console.error("Error fetching API plans:", error);
        } finally {
            setFetchLoading(false);
        }
    };

    // useEffect to fetch plans based on active tab
    useEffect(() => {
        setFetchLoading(true); // Show loading
        if (activeTab === "subscription") {
            fetchSubscriptionPlans();
        } else if (activeTab === "api") {
            fetchApiPlans();
        }
    }, [activeTab]);

    const handleSubscription = async (planId, planName) => {
        try {
            setIsProcessing(true);
            const response = await fetch("/api/create-subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId }),
            });

            const result = await response.json();
            if (response.ok && result.approvalUrl) {
                setPlan(planId, planName);
                setTimeout(() => {
                    window.location.href = result.approvalUrl;
                }, 1000);
            } else {
                alert("Subscription creation failed.");
                setIsProcessing(false);
            }
        } catch (error) {
            alert("An error occurred while creating the subscription.");
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col items-center mx-auto py-10">
            {/* Tab Buttons */}
            <div className="flex mb-6">
                <button
                    onClick={() => setActiveTab("subscription")}
                    className={`px-6 py-2 rounded-tl-xl rounded-bl-xl ${
                        activeTab === "subscription"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : "bg-white text-gray-600 dark:text-gray-200"
                    }`}
                >
                    Subscription
                </button>
                <button
                    onClick={() => setActiveTab("api")}
                    className={`px-6 py-2 rounded-tr-xl rounded-br-xl ${
                        activeTab === "api"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : "bg-white text-gray-600 dark:text-gray-200"
                    }`}
                >
                    API
                </button>
            </div>

            {/* Pricing Plans */}
            <div className="w-full overflow-x-auto scrollbar-hide">
                <div className="flex space-x-4 flex-wrap justify-center p-4">
                    {plans
                        .filter((plan) => {
                            return billingCycle === "monthly"
                                ? plan.month_plan_id && plan.monthly_price !== undefined
                                : plan.year_plan_id && plan.yearly_price !== undefined;
                        })
                        .map((plan, index) => {
                            const planId = billingCycle === "monthly" ? plan.month_plan_id : plan.year_plan_id;
                            const planPrice = billingCycle === "monthly" ? plan.monthly_price ?? 0 : plan.yearly_price ?? 0;

                            const isCurrentPlan =
                                (billingCycle === "monthly" && user?.billing_plan?.month_plan_id === plan.month_plan_id) ||
                                (billingCycle === "annually" && user?.billing_plan?.year_plan_id === plan.year_plan_id);

                            return (
                                <div
                                    key={index}
                                    className={`p-6 rounded-3xl shadow-md border-2 bg-white dark:bg-slate-800 w-80 ${
                                        isCurrentPlan ? "border-primary dark:bg-slate-600" : "border-gray-300 dark:border-gray-700"
                                    }`}
                                >
                                    <h3 className="text-gray-600 dark:text-gray-200 text-xl font-bold mb-2">{plan.plan_name ?? "No Name"}</h3>
                                    <p className="text-gray-600 dark:text-gray-200 mb-4">{plan.description ?? "No Description Available"}</p>

                                    <p className="text-3xl font-bold mb-4 text-gray-600 dark:text-gray-200">
                                        {plan.currency === "USD" ? "$" : "€"}
                                        {planPrice}
                                        <span className="text-sm text-gray-500 dark:text-gray-200"> / {billingCycle}</span>
                                    </p>

                                    {/* Button to Subscribe or Indicate Current Plan */}
                                    <button
                                        className={`w-full py-2 rounded-lg ${
                                            isCurrentPlan
                                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                                : "bg-white border-2 border-gray-300 hover:border-gray-400 dark:border-0 dark:bg-slate-700 dark:hover:bg-slate-600 text-primary dark:text-gray-200"
                                        }`}
                                        disabled={!!isCurrentPlan}
                                        onClick={() => {
                                            if (!isCurrentPlan) {
                                                setSelectedPlan({ id: planId, name: plan.plan_name });
                                                setIsModalOpen(true);
                                            }
                                        }}
                                    >
                                        {isCurrentPlan ? "Current Plan" : "Upgrade Plan"}
                                    </button>

                                    {/* Dynamic Feature List */}
                                    <ul className="mt-6 space-y-4 text-gray-600 dark:text-gray-200">
                                        <li>✓ {plan.results_per_search ?? "N/A"} results per search</li>
                                        <li>✓ {plan.backlinks_monitored ?? "N/A"} backlinks monitored</li>
                                        <li>✓ {plan.plugin_clicks ?? "N/A"} Plugin clicks</li>
                                        <li>✓ {plan.keyword_searches ?? "N/A"} keyword searches</li>
                                        <li>✓ {plan.competitive_analyses ?? "N/A"} competitive analyses</li>
                                        <li>✓ {plan.simultaneous_bulk_competitive ?? "N/A"} simultaneous bulk competitive</li>
                                        <li>✓ {plan.bulk_keywords ?? "N/A"} bulk keywords</li>
                                        <li>✓ {plan.serp_scanner ?? "N/A"} SERP Scanner</li>
                                    </ul>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Subscription Confirmation Modal */}
            {isModalOpen && selectedPlan && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-11/12 sm:w-96">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            Confirm Subscription
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                            Are you sure you want to subscribe to <strong>{selectedPlan.name}</strong>?
                        </p>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-200 rounded-lg"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isProcessing}
                            >
                                Cancel
                            </button>
                            <button
                                className={`px-4 py-2 text-white rounded-lg ${
                                    isProcessing ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                                }`}
                                onClick={() => {
                                    if (selectedPlan) {
                                        handleSubscription(selectedPlan.id, selectedPlan.name);
                                    }
                                }}
                                disabled={isProcessing}
                            >
                                {isProcessing ? "Processing..." : "OK"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
