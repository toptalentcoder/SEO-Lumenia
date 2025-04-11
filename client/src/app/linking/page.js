"use client"

import { useState } from 'react';
import { useSearchView } from '../../hooks/useSearchView';

export default function Linking(){

    const {currentView, responseData, switchToResults, switchToInput } = useSearchView();
    const [loading, setLoading] = useState(false);

    const handleSearch = async (data) => {
        setLoading(true); // Start loading animation

        try {
            // Store the response and show results
            switchToResults(data);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false); // Stop loading animation
        }
    };

    return(
        <div>
            {loading ? (
                <div>
                    Loading....
                </div>
            ) : currentView === 'input' ? (
                <div>
                    InputView
                </div>
            ) : (
                <div>
                    ResultView
                </div>
            )}
        </div>
    )
}