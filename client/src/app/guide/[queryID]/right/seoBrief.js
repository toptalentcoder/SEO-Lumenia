"use client"

import { FaRobot, FaSpinner } from "react-icons/fa6";
import {useState} from 'react'
import axios from 'axios';
import { useParams } from "next/navigation";
import { useUser } from '../../../../context/UserContext';

export default function SeoBrief({data}){

    const { seoBrief } = data;
    const { user } = useUser();
    const { queryID } = useParams();

    const {
        primaryIntent,
        objective,
        mainTopics,
        importantQuestions,
        writingStyleAndTone,
        recommendedStyle,
        valueProposition,
    } = seoBrief;

    // State for verification results and improvement suggestions
    const [verificationResult, setVerificationResult] = useState(null);
    const [improvementSuggestions, setImprovementSuggestions] = useState("");
    const [isLoading, setIsLoading] = useState(false);  // New state for loading

    const handleVerifyClick = async () => {
        try {
            setIsLoading(true);

            // Fetch SEO Editor content
            const responseSeoEditorContent = await axios.get(
                `/api/get_seo_editor_data?queryID=${queryID}&email=${user.email}`
            );

            const content = responseSeoEditorContent.data.seoEditorData;

            // Send content and SEO brief to the backend for verification
            const response = await axios.post("/api/verify_seo_brief", { content, seoBrief });

            console.log(response.data)
            const { verificationResult, improvementText } = response.data;

            console.log(verificationResult);
            console.log(improvementText);

            // Update the verification state
            setVerificationResult(verificationResult);
            setImprovementSuggestions(improvementText);
        } catch (error) {
            console.error("Error verifying brief:", error);
        }finally {
            setIsLoading(false); // Set loading to false once the request is complete
        }
    };

    // Function to render the circle or checkmark based on verification status
    const renderVerificationIcon = (isVerified) => {
        return isVerified ? (
            <div className="h-4 w-4 bg-green-500 rounded-full border border-gray-600 flex-shrink-0" />
        ) : (
            <div className="h-4 w-4 bg-gray-200 rounded-full border border-gray-600 flex-shrink-0" />
        );
    };

    const isItemVerified = (section, item) => {
        return verificationResult?.[section]?.includes(item);
    };

    return(
        <div>
            <div className="font-semibold text-sm">Context and Objective:</div>
            <div className="ml-10 mt-3 text-gray-400 text-sm">Primary Intent:</div>
            <div className="ml-20 mt-3 text-gray-900 text-sm">{primaryIntent}</div>
            <div className="ml-10 mt-3 text-gray-400 text-sm">Objective:</div>
            <div className="ml-20 mt-2 text-gray-900">
                {objective.map((sentence, index) => (
                    <div key={index} className="flex items-center space-x-2 mt-1">
                        {renderVerificationIcon(verificationResult?.objective)}
                        <div className="flex-grow text-sm">
                            {sentence.trim()}.
                        </div>
                    </div>
                ))}
            </div>
            <div className="font-semibold text-sm mt-3">Main Topics to Cover:</div>
            <div className="ml-10 mt-3 text-gray-400 text-sm">Key Subjects:</div>
            <div className="ml-20 mt-3 text-gray-900 text-sm">
                {mainTopics.map((topic, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {renderVerificationIcon(isItemVerified("mainTopics", topic))}
                        <div className="leading-tight">
                            {topic}
                        </div>
                    </div>
                ))}
            </div>
            <div className="ml-10 mt-3 text-gray-400 text-sm">Questions to Consider:</div>
            <div className="ml-20 mt-3 text-gray-900 text-sm">
                {importantQuestions.map((question, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {renderVerificationIcon(verificationResult?.importantQuestions?.includes(question))}
                        <div className="leading-tight">
                        {question}
                        </div>
                    </div>
                ))}

            </div>
            <div className="font-semibold text-sm mt-3">Writing Style and Tone:</div>
            <div className="ml-10 mt-3 text-gray-400 text-sm">Recommended Tone:</div>
            <div className="ml-20 mt-3 text-gray-900 text-sm">
                {writingStyleAndTone.map((tone, index) => (
                    <div key={index} className="flex items-center gap-2 mt-1">
                        {renderVerificationIcon(verificationResult?.writingStyleAndTone?.includes(tone))}
                        <div>{tone}</div>
                    </div>
                ))}

            </div>
            <div className="ml-10 mt-3 text-gray-400 text-sm">Recommended Style:</div>
            <div className="ml-20 mt-3 text-gray-900 text-sm">
                {recommendedStyle.map((style, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {renderVerificationIcon(verificationResult?.recommendedStyle?.includes(style))}
                        <div className="leading-tight">{style}</div>
                    </div>
                ))}
            </div>
            <div className="font-semibold text-sm mt-3">Value Proposition:</div>
            <div className="ml-10 mt-3 text-gray-900 text-sm">
                {valueProposition.map((prop, index) => (
                    <div key={index} className="inline-flex items-center gap-2">
                        {renderVerificationIcon(verificationResult?.valueProposition?.includes(prop))}
                        <div>{prop}</div>
                    </div>
                ))}

            </div>

            <button
                onClick={handleVerifyClick}
                className="mt-10 flex justify-center items-center space-x-2 text-[#FFFFFF] bg-[#EBB71A] hover:bg-[#C29613] cursor-pointer mx-auto px-5 py-1 rounded-lg">
                {isLoading ? (
                    <FaSpinner className="animate-spin text-white" />
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
                    <h3 className="font-semibold">Improvement Suggestions:</h3>
                    <p>{improvementSuggestions}</p>
                </div>
            )}

        </div>
    )
}