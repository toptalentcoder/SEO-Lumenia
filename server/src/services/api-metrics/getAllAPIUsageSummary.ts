import { Payload } from "payload";
import { getAzureOPenAIUsage } from "./azure_open_ai";
import { semrushApiMetrics } from "./semrush";
import { serpApiMetrics } from "./serp_api";
import { serperApiMetrics } from "./serper_dev";

type ThresholdType = 'percent' | 'absolute';

type ThresholdEntry = {
    provider: string;
    threshold: number;
    type: ThresholdType;
};

export const collectAllMetrics = async (payload: Payload): Promise<string | null> => {
    const messages: string[] = [];
    let shouldAlert = false;

    const globalSettings = await payload.findGlobal({ slug: 'telegram-token-settings' });

    // Get the thresholds from global settings
    const azureThreshold = globalSettings?.azureThreshold || 50;
    const semrushThreshold = globalSettings?.semrushThreshold || 10000;
    const serpapiThreshold = globalSettings?.serpapiThreshold || 300;
    const serperThreshold = globalSettings?.serperThreshold || 300;

  // Helper function to check if the remaining value is below the threshold
    const checkThresholdBreach = (remaining: number, threshold: number): boolean => {
        return remaining < threshold;
    };

    // --- Azure OpenAI ---
    try {
        const azure = await getAzureOPenAIUsage();

        const remaining = parseFloat(azure.remainingCredit);

        const breach = checkThresholdBreach(remaining, azureThreshold);

        if (breach) shouldAlert = true;

        messages.push(`🔵 **Azure OpenAI Usage Alert**:
            Your usage with Azure OpenAI is almost up!
            - **Total Credit**: $${azure.totalCredit}
            - **Used**: $${azure.usedCredit}
            - **Remaining Balance**: $${azure.remainingCredit}
            - **Status**: ${azure.statusText}

            **What does this mean?**
            You're nearing your credit limit for Azure OpenAI. If the remaining balance gets too low, you may experience service interruptions. Please ensure you top up or adjust your usage to avoid disruptions.

            *Take action*: If you're nearing the limit, consider increasing your budget or reducing usage to avoid service issues.`);

    } catch (e) {
        messages.push('🔵 Azure OpenAI: ❌ Failed to fetch');
    }

    // --- SEMrush ---
    try {
        const semrush = await semrushApiMetrics();

        const remaining = Number(semrush.remaining);

        const breach = checkThresholdBreach(remaining, semrushThreshold);

        if (breach) shouldAlert = true;

        messages.push(`🟡 **SEMrush Usage Alert**:
            Your SEMrush API usage is approaching its limit.
            - **Used**: ${semrush.used} API unit requests
            - **Remaining**: ${semrush.remaining} API unit requests

            **What does this mean?**
            You're close to reaching your API usage limit for SEMrush. This could impact your ability to gather SEO data. Ensure you monitor your usage and consider upgrading or adjusting your plan.

            *Take action*: If you're using SEMrush frequently, consider reviewing your plan or usage limits to avoid any interruption in service.`);

    } catch (e) {
        messages.push('🟡 SEMrush: ❌ Failed to fetch');
    }

    // --- SERP API ---
    try {
        const serp = await (await serpApiMetrics()).json();

        const remaining = Number(serp.searches_left);

        const breach = checkThresholdBreach(remaining, serpapiThreshold);

        if (breach) shouldAlert = true;

        messages.push(`🟢 **SERP API Usage Alert**:
            You're getting close to your limit for SERP API searches.
            - **Total number of Searches**: ${serp.total_searches}
            - **Remaining number of Searches**: ${serp.searches_left}
            - **Your current plan**: ${serp.plan}

            **What does this mean?**
            You're about to reach your search limit with the SERP API, which might affect your ability to pull search engine ranking data. If you’re using this for critical tasks, it’s important to keep an eye on your usage.

            *Take action*: If you need more searches, consider upgrading your plan or reducing your search frequency to stay within your limits.`);

    } catch (e) {
        messages.push('🟢 SERP API: ❌ Failed to fetch');
    }

    // --- Serper.dev ---
    try {
        const serper = await (await serperApiMetrics()).json();

        const credits = parseInt(serper.balance, 10);

        const breach = checkThresholdBreach(credits, serperThreshold);

        if (breach) shouldAlert = true;

        messages.push(`🟣 **Serper.dev Usage Alert**:
            You're almost out of credits for Serper.dev.
            - **Credits Left**: ${serper.balance}

            **What does this mean?**
            You're getting low on credits for Serper.dev, which may prevent you from making additional requests. If you're relying on this service, it’s important to act before you run out.

            *Take action*: Consider replenishing your credits or reducing usage to avoid service interruption.`);

    } catch (e) {
        messages.push('🟣 Serper.dev: ❌ Failed to fetch');
    }

    return shouldAlert ? messages.join('\n\n') : null;
};
