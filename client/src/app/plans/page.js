"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { usePlan } from "../../context/UserPlanContext";
import { PiNotePencilBold } from "react-icons/pi";
import { FaRobot } from "react-icons/fa6";
import { FcBusinessman } from "react-icons/fc";
import { BsFillPersonFill } from "react-icons/bs";
import { FaCoins } from "react-icons/fa6";
import { LuTheater } from "react-icons/lu";
import { IoIosBusiness } from "react-icons/io";
import { IoBusinessSharp } from "react-icons/io5";

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
            const response = await fetch("/api/plans"); // Modify this endpoint as needed
            const data = await response.json();
            if (Array.isArray(data.fetchedPlans.apiPlans)) {
                setPlans(data.fetchedPlans.apiPlans); // Set API-based plans
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

            <div className="flex items-center space-x-2 mb-10">
            {/* Monthly Label */}
            <span
                className={`cursor-pointer text-gray-600 dark:text-gray-200`}
                onClick={() => setBillingCycle("monthly")}
            >
                Monthly
            </span>

            {/* Toggle Switch */}
            <div
                className={`relative inline-block w-12 h-6 rounded-full cursor-pointer ${billingCycle === "annually" ? "bg-[#413793]" : "bg-gray-300 dark:bg-gray-600"}`}
                onClick={() => setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly")}
            >
                {/* Knob */}
                <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-in-out ${
                        billingCycle === "annually" ? "transform translate-x-6" : ""
                    }`}
                />
                </div>

                {/* Annual Label */}
                <span
                    className={`cursor-pointer text-gray-600 dark:text-gray-200`}
                    onClick={() => setBillingCycle("annually")}
                >
                    Annual
                </span>
            </div>

            {/* Pricing Plans */}
            <div className="w-full ">
                <div className="flex flex-wrap justify-center p-4 space-x-4 space-y-6 ">
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
                                    className={`p-6 rounded-3xl shadow-xl bg-white dark:bg-slate-800 w-lg items-stretch ${
                                        isCurrentPlan ? "border-primary dark:bg-slate-600" : "border-gray-300 dark:border-gray-700"
                                    }`}
                                >
                                    <div className="flex space-x-4">
                                        <div className="flex space-x-7">
                                            {activeTab === 'subscription' &&
                                                <div key={index} className="bg-gradient-to-b from-[#41388C] to-[#9770C8] rounded-full h-11 w-11 text-white flex justify-center items-center text-xl">
                                                    {index === 0 && <LuTheater />}
                                                    {index === 1 && <LuTheater />}
                                                    {index === 2 && <IoIosBusiness/>}
                                                    {index === 3 && <IoIosBusiness/>}
                                                    {index === 4 && <IoBusinessSharp/>}
                                                </div>
                                            }
                                        </div>

                                        <div>
                                            <h3 className="text-[#413793] dark:text-[#413793] text-xl font-bold mb-2">{plan.plan_name ?? "No Name"}</h3>

                                            <p className="text-3xl font-bold mb-4 text-gray-600 dark:text-gray-200">
                                                {plan.currency === "USD" ? "$" : "€"}
                                                {planPrice}
                                                <span className="text-sm text-gray-400 dark:text-gray-200"> / {billingCycle}</span>
                                                <span className="text-2xl text-gray-400 dark:text-gray-200"> Excluding VAT</span>
                                            </p>

                                            <p className="text-gray-500 dark:text-gray-200 mb-4 h-32 text-sm">{plan.description ?? "No Description Available"}</p>

                                            <div className="flex items-center space-x-7">
                                                {activeTab === 'subscription' ? (
                                                    <div>
                                                        <div className="mt-6 text-sm">
                                                            Each month, you receive:
                                                            <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-200">
                                                                <div className="flex items-center space-x-2">
                                                                    <PiNotePencilBold className="text-[#413793] text-lg"/>
                                                                    <li>{plan.features?.subscription_features?.tokens / 5 ?? "N/A"} guides ({plan.features?.subscription_features?.tokens ?? "N/A"} tokens, valid for 1 month)</li>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <FaRobot className="text-[#413793] text-lg"/>
                                                                    <li>{plan.features?.subscription_features?.ai_tokens ?? "N/A"} AI tokens (valid for 1 month)</li>
                                                                </div>
                                                            </ul>
                                                        </div>
                                                        <div className="mt-3 text-sm">
                                                            Other Perks:
                                                            <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-200">
                                                                <div className="flex items-center space-x-2">
                                                                    <FcBusinessman className="text-[#413793] text-lg"/>
                                                                    <li>up to {plan.features?.subscription_features?.seats ?? "N/A"} seats</li>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <BsFillPersonFill className="text-[#413793] text-lg"/>
                                                                    <li>up to {plan.features?.subscription_features?.guests ?? "N/A"} guests</li>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <BsFillPersonFill className="text-[#413793] text-lg"/>
                                                                    <li>up to {plan.features?.subscription_features?.monitoring ?? "N/A"} monitoring</li>
                                                                </div>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ) : activeTab === 'api' ? (
                                                    <div className="flex items-center space-x-2 text-sm">
                                                        <PiNotePencilBold className="text-[#413793] "/>
                                                        <div className="text-gray-500">{plan.features?.api_features?.parallel_generation ?? "N/A"} Parallel generation</div>
                                                </div>
                                                ) : null} {/* If no tab matches, nothing will be rendered */}
                                            </div>

                                            {/* Button to Subscribe or Indicate Current Plan */}
                                            <button
                                                className={`flex px-4 py-2 rounded-lg items-center mt-7 mx-auto ${
                                                    isCurrentPlan
                                                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                                                        : "bg-[#413793] border-gray-300 hover:border-gray-400 dark:border-0 dark:bg-slate-700 dark:hover:bg-slate-600 text-primary dark:text-gray-200 cursor-pointer"
                                                }`}
                                                disabled={!!isCurrentPlan}
                                                onClick={() => {
                                                    if (!isCurrentPlan) {
                                                        setSelectedPlan({ id: planId, name: plan.plan_name });
                                                        setIsModalOpen(true);
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center space-x-2 text-center justify-center text-white">
                                                    <FaCoins className="text-xl"/>
                                                    <span>
                                                        {isCurrentPlan ?
                                                            "Current Plan" : "Subscribe"
                                                        }
                                                    </span>

                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Subscription Confirmation Modal */}
            {isModalOpen && selectedPlan && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
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
