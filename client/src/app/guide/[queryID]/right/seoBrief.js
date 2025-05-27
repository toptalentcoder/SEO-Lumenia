"use client"

import { FaRobot, FaSpinner } from "react-icons/fa6";
import {useState, useEffect} from 'react'
import axios from 'axios';
import { useParams } from "next/navigation";
import { useUser } from '../../../../context/UserContext';
import { NEXT_PUBLIC_API_URL } from "../../../../config/apiConfig";
import ReactMarkdown from "react-markdown";

const CustomTooltip = ({ text }) => (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black text-white text-sm rounded py-3 px-4 z-10 whitespace-nowrap">
        {text}
    </div>
);

export default function SeoBrief({data, setIsContentNull, setIsVerifyBriefButtonClicked}){
    const { seoBrief } = data;
    const { user } = useUser();
    const { queryID } = useParams();

    // State for verification results and improvement suggestions
    const [verificationResult, setVerificationResult] = useState(null);
    const [improvementSuggestions, setImprovementSuggestions] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    // Load verification state when component mounts
    useEffect(() => {
        if (!user?.email) return; 

        const loadVerificationState = async () => {
            try {
                const response = await axios.get(
                    `/api/get_seo_editor_data?queryID=${queryID}&email=${user.email}`
                );

                if (response.data.success) {
                    if (response.data.briefVerification != null) {
                      const { verificationResult, improvementText } = response.data.briefVerification;
                      setVerificationResult(verificationResult);
                      setImprovementSuggestions(improvementText);
                    } else {
                      setVerificationResult(null);
                      setImprovementSuggestions("");
                    }
                  }
                  
            } catch (error) {
                console.error("Error loading verification state:", {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    request: {
                        url: error.config?.url,
                        method: error.config?.method,
                        params: error.config?.params
                    }
                });
            }
        };

        loadVerificationState();
    }, [queryID, user]);

    // Add null check for seoBrief
    if (!seoBrief) {
        return <div>Loading SEO brief...</div>;
    }

    const {
        primaryIntent,
        objective,
        mainTopics,
        importantQuestions,
        writingStyleAndTone,
        recommendedStyle,
        valueProposition,
    } = seoBrief;

    const handleVerifyClick = async () => {
        if (!user?.email) {
            setImprovementSuggestions("");
            return;
        }


        const content = document.querySelector('[contenteditable="true"]')?.innerText || "";
        setIsLoading(true);
        setImprovementSuggestions("");
        setProgress(0);

        setIsLoading(true);

        try {
            setIsVerifyBriefButtonClicked(true);

            if (!content.trim()) {
                setIsContentNull(true);
                setImprovementSuggestions("");
                setProgress(0);
                setIsLoading(false);
            }

            // Create the request promise
            const response = await axios.post(`${NEXT_PUBLIC_API_URL}/api/verify_seo_brief`, {
                content: content.trim() || "",
                seoBrief: seoBrief,
                queryID: queryID,
                email: user.email,
                language: data.language
            }, { timeout: 60000 });

            if (response.data.jobId) {
                // Start polling for job status
                const pollInterval = setInterval(async () => {
                    try {
                        const statusResponse = await axios.get(`${NEXT_PUBLIC_API_URL}/api/seoBriefStatus/${response.data.jobId}`);
                        const statusData = statusResponse.data;

                        // Update progress if available
                        if (statusData.progress) {
                            setProgress(statusData.progress);
                        }

                        // Handle different job states
                        switch (statusData.status) {
                            case 'completed':
                                clearInterval(pollInterval);
                                setIsLoading(false);
                                setProgress(100);
                                // Update both verification result and improvement suggestions
                                if (statusData.result) {
                                    setVerificationResult(statusData.result);
                                    setImprovementSuggestions(statusData.result.improvementText || "");
                                }
                                break;
                            case 'failed':
                                clearInterval(pollInterval);
                                setIsLoading(false);
                                setProgress(0);
                                setVerificationResult(null);
                                setImprovementSuggestions("");
                                break;
                            case 'stalled':
                                clearInterval(pollInterval);
                                setIsLoading(false);
                                setProgress(0);
                                setVerificationResult(null);
                                setImprovementSuggestions("");
                                break;
                            case 'active':
                            case 'waiting':
                            case 'delayed':
                                setIsLoading(true);
                                break;
                        }
                    } catch (error) {
                        console.error('Polling error:', error);
                        // Keep loading state active on temporary errors
                        setIsLoading(true);
                    }
                }, 2000); // Poll every 2 seconds

                // Set a timeout to clear the interval after 5 minutes
                setTimeout(() => {
                    clearInterval(pollInterval);
                    if (isLoading) {
                        setIsLoading(false);
                        setProgress(0);
                        setImprovementSuggestions("");
                    }
                }, 300000); // 5 minutes timeout
            }
        } catch (error) {
            setIsLoading(false);
            setProgress(0);
            setIsVerifyBriefButtonClicked(false);
            // Log the raw error for debugging
            console.error("Raw error in handleVerifyClick:", error);

            if (error && (error.message || error.response)) {
                console.error("Error in handleVerifyClick:", {
                    message: error.message,
                    response: error.response?.data,
                    status: error.response?.status,
                    request: {
                        url: error.config?.url,
                        method: error.config?.method,
                        params: error.config?.params
                    }
                });
            } else {
                console.error("Unknown error in handleVerifyClick:", error);
            }
            if (error.message === 'Request timeout') {
                setImprovementSuggestions("");
            } else if (error.code === 'ECONNABORTED') {
                setImprovementSuggestions("");
            } else {
                setImprovementSuggestions("");
            }
        } finally {
            setIsVerifyBriefButtonClicked(false);
        }
    };

    // Function to render the circle, checkmark, or partial icon based on verification status
    const renderVerificationIcon = (status) => {
        const tooltipMap = {
            fully: "Nice! You've covered this point.",
            partially: "You've started this, but keep going!",
            missing: "This still needs to be worked on.",
        };
    
        const iconMap = {
            fully: "✅",
            partially: "🔍",
            missing: "⚪",
        };
    
        return (
            <div className="relative h-4 w-4 flex-shrink-0 cursor-pointer group">
                {iconMap[status] || "⚪"}
                <div className="hidden group-hover:block">
                    <CustomTooltip text={tooltipMap[status] || "Status unknown"} />
                </div>
            </div>
        );
    };
    

    const getItemStatus = (section, item) => {
        const sectionData = verificationResult?.[section];
        if (!Array.isArray(sectionData)) return "missing";
    
        const found = sectionData.find(entry => entry.item === item);
        return found?.status || "missing";
    };
    

    return(
        <div>
            <div className="font-semibold text-sm text-gray-600">Context and Objective:</div>
            <div className="ml-10 mt-3 text-gray-400 text-sm">Primary Intent:</div>
            <div className="ml-20 mt-3 text-gray-900 text-sm">{primaryIntent}</div>
            <div className="ml-10 mt-3 text-gray-400 text-sm">Objective:</div>
            <div className="ml-20 mt-2 text-gray-900">
                {objective.map((sentence, index) => (
                    <div key={index} className="flex items-center space-x-2 mt-1">
                        {renderVerificationIcon(getItemStatus("objective", sentence))}
                        <div className="flex-grow text-sm">
                            {sentence.trim()}.
                        </div>
                    </div>
                ))}
            </div>
            <div className="font-semibold text-sm mt-3 text-gray-600">Main Topics to Cover:</div>
            <div className="ml-10 mt-3 text-gray-400 text-sm">Key Subjects:</div>
            <div className="ml-20 mt-3 text-gray-900 text-sm">
                {mainTopics.map((topic, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {renderVerificationIcon(getItemStatus("mainTopics", topic))}
                        <div className="leading-tight">
                            {topic}
                        </div>
                    </div>
                ))}
            </div>
            <div className="ml-10 mt-3 text-gray-400 text-sm ">Questions to Consider:</div>
            <div className="ml-20 mt-3 text-gray-900 text-sm">
                {importantQuestions.map((question, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {renderVerificationIcon(getItemStatus("importantQuestions", question))}
                        <div className="leading-tight">
                            {question}
                        </div>
                    </div>
                ))}

            </div>
            <div className="font-semibold text-sm mt-3 text-gray-600">Writing Style and Tone:</div>
            <div className="ml-10 mt-3 text-gray-400 text-sm">Recommended Tone:</div>
            <div className="ml-20 mt-3 text-gray-900 text-sm">
                {writingStyleAndTone.map((tone, index) => (
                    <div key={index} className="flex items-center gap-2 mt-1">
                        {renderVerificationIcon(getItemStatus("writingStyleAndTone", tone))}
                        <div>{tone}</div>
                    </div>
                ))}

            </div>
            <div className="ml-10 mt-3 text-gray-400 text-sm">Recommended Style:</div>
            <div className="ml-20 mt-3 text-gray-900 text-sm">
                {recommendedStyle.map((style, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {renderVerificationIcon(getItemStatus("recommendedStyle", style))}
                        <div className="leading-tight">{style}</div>
                    </div>
                ))}
            </div>
            <div className="font-semibold text-sm mt-3 text-gray-600">Value Proposition:</div>
            <div className="ml-10 mt-3 text-gray-900 text-sm">
                {valueProposition.map((prop, index) => (
                    <div key={index} className="inline-flex items-center gap-2">
                        {renderVerificationIcon(getItemStatus("valueProposition", prop))}
                        <div>{prop}</div>
                    </div>
                ))}

            </div>

            <button
                onClick={handleVerifyClick}
                className="mt-10 flex justify-center items-center space-x-2 text-[#FFFFFF] bg-[#EBB71A] hover:bg-[#C29613] cursor-pointer mx-auto px-5 py-1 rounded-lg">
                {isLoading ? (
                    <>
                        <div className="relative w-24 h-6 flex items-center justify-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-[#413793] h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="absolute left-1/2 transform -translate-x-1/2 text-xs text-gray-900 font-semibold">{progress}%</span>
                        </div>
                        <span className="ml-2">Verifying...</span>
                    </>
                ) : (
                    <>
                        <FaRobot />
                        <span>200</span>
                        <span>-</span>
                        <span>Verify Brief Items</span>
                    </>
                )}
            </button>

            {/* Display improvement suggestions at the bottom */}
            {improvementSuggestions && (
                <div className="mt-5 text-gray-900 text-sm">
                    <ReactMarkdown>{improvementSuggestions}</ReactMarkdown>
                </div>
            )}

        </div>
    )
}