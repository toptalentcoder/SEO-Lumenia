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

export const collectAllMetrics = async (payload : Payload): Promise<string |null> => {
    const messages: string[] = [];
    let shouldAlert = false;
    
    const { docs } = await payload.find({
        collection: 'api-thresholds',
        limit: 100,
    });

    const getThresholdEntry = (provider: string): ThresholdEntry => {
        const entry = docs.find((doc: any) => doc.provider === provider);

        if (!entry || typeof entry.threshold !== 'number' || !entry.type) {
            return { provider, threshold: 100, type: 'percent' }; // default fallback
        }

        return {
            provider: entry.provider,
            threshold: Number(entry.threshold),
            type: entry.type as ThresholdType,
        };
    };

    try {
        const azure = await getAzureOPenAIUsage();

        const remaining = parseFloat(azure.remainingCredit);
        const total = parseFloat(azure.totalCredit);
        const percentRemaining = (remaining / total) * 100;

        const { threshold, type } = getThresholdEntry('azure');

        let breach = false;
        if (type === 'percent') breach = percentRemaining < threshold;
        if (type === 'absolute') breach = remaining < threshold;

        if (breach) shouldAlert = true;

        messages.push(`🔵 Azure OpenAI:
            Used: $${azure.usedCredit}
            Remaining: $${azure.remainingCredit}
            Status: ${azure.statusText}`);

    } catch (e) {
        messages.push('🔵 Azure OpenAI: ❌ Failed to fetch');
    }

    try {
        const semrush = await semrushApiMetrics();

        const remaining = semrush.remaining;
        const usedPercent = parseFloat(semrush.percentUsed);
        const remainingPercent = 100 - usedPercent;

        const { threshold, type } = getThresholdEntry('semrush');

        let breach = false;
        if (type === 'percent') breach = remainingPercent < threshold;
        if (type === 'absolute') breach = remaining < threshold;

        if (breach) shouldAlert = true;

        messages.push(`🟡 SEMrush:
            Used: ${semrush.used}
            Remaining: ${semrush.remaining}
            Usage: ${semrush.percentUsed}%`);

    } catch (e) {
        messages.push('🟡 SEMrush: ❌ Failed to fetch');
    }

    try {
        const serp = await (await serpApiMetrics()).json();

        const remaining = serp.searches_left;
        const total = serp.total_searches;
        const remainingPercent = (remaining / total) * 100;

        const { threshold, type } = getThresholdEntry('serpapi');

        let breach = false;
        if (type === 'percent') breach = remainingPercent < threshold;
        if (type === 'absolute') breach = remaining < threshold;

        if (breach) shouldAlert = true;

        messages.push(`🟢 SERP API:
            Total: ${serp.total_searches}
            Remaining: ${serp.searches_left}
            Plan: ${serp.plan}`);

    } catch (e) {
        messages.push('🟢 SERP API: ❌ Failed to fetch');
    }

    try {
        const serper = await (await serperApiMetrics()).json();

        const credits = parseInt(serper.balance, 10);
        const { threshold, type } = getThresholdEntry('serper');

        let breach = false;
        if (type === 'absolute') breach = credits < threshold;
        if (type === 'percent') {
            // Optional: calculate percent if total is known (you can skip or hardcode 500,000 for example)
        }

        if (breach) shouldAlert = true;

        messages.push(`🟣 Serper.dev:
            Today: ${serper.today}
            Last Month: ${serper.lastMonth}
            Credits Left: ${serper.balance}`);

    } catch (e) {
        messages.push('🟣 Serper.dev: ❌ Failed to fetch');
    }

    return shouldAlert ? messages.join('\n\n') : null;
};
