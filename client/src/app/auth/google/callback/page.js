"use client"

import { useEffect } from "react";

const GoogleCallbackPage = () => {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userDataString = urlParams.get("userData");

        if (userDataString) {
            try {
                const userData = JSON.parse(decodeURIComponent(userDataString));

                // ✅ Store token & user in localStorage
                localStorage.setItem("googleAuthUser", JSON.stringify(userData));

                // ✅ Store token & user in localStorage (so it persists across refresh)
                localStorage.setItem("authToken", userData.token);
                localStorage.setItem("user", JSON.stringify(userData.user));

                // ✅ Close the popup window
                window.close();
            } catch (error) {
                console.error("❌ Error parsing user data:", error);
            }
        } else {
            console.error("❌ Token not found in the URL.");
        }
    }, []);

    return <div>Loading...</div>;
};

export default GoogleCallbackPage;
