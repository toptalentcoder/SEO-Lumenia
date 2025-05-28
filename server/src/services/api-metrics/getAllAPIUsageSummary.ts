import { getAzureOPenAIUsage } from "./azure_open_ai";
import { semrushApiMetrics } from "./semrush";
import { serpApiMetrics } from "./serp_api";
import { serperApiMetrics } from "./serper_dev";


export const collectAllMetrics = async (): Promise<string> => {
    const messages: string[] = [];

    try {
        const azure = await getAzureOPenAIUsage();
        messages.push(`🔵 Azure OpenAI:
            Used: $${azure.usedCredit}
            Remaining: $${azure.remainingCredit}
            Status: ${azure.statusText}`);

    } catch (e) {
        messages.push('🔵 Azure OpenAI: ❌ Failed to fetch');
    }

    try {
        const semrush = await (await semrushApiMetrics()).json();
        messages.push(`🟡 SEMrush:
    Used: ${semrush.used.toLocaleString()}
    Remaining: ${semrush.remaining.toLocaleString()}
    Usage: ${semrush.percentUsed}%`);

    } catch (e) {
        messages.push('🟡 SEMrush: ❌ Failed to fetch');
    }

    try {
        const serp = await (await serpApiMetrics()).json();
        messages.push(`🟢 SERP API:
    Total: ${serp.total_searches}
    Remaining: ${serp.searches_left}
    Plan: ${serp.plan}`);

    } catch (e) {
        messages.push('🟢 SERP API: ❌ Failed to fetch');
    }

    try {
        const serper = await (await serperApiMetrics()).json();
        messages.push(`🟣 Serper.dev:
    Today: ${serper.today}
    Last Month: ${serper.lastMonth}
    Credits: ${serper.balance}`);

    } catch (e) {
        messages.push('🟣 Serper.dev: ❌ Failed to fetch');
    }

    return messages.join('\n\n');
};
