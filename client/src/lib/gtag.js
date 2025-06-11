export const GA_ID = "G-1S63ENWK6H"; // Replace with your actual GA4 ID

export const pageview = (url) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("config", GA_ID, {
            page_path: url,
        });
    }
};
