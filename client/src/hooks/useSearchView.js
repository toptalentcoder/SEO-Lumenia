import { useState } from "react";

export function useSearchView() {
    const [currentView, setCurrentView] = useState("input");
    const [responseData, setKeys] = useState([]);

    const switchToResults = (newResponseData) => {
        setKeys(newResponseData);
        setCurrentView("results");
    };

    const switchToInput = () => {
        setCurrentView("input");
        setKeys([]);
    };

    return {
        currentView,
        responseData,
        switchToResults,
        switchToInput,
    };
}
