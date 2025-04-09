// ✅ 3. Volatility Calculator
import { Payload } from "payload";

interface SerpResult {
    rank: number;
    link: string;
    title?: string;
}

interface SnapshotDoc {
    keyword: string;
    category: string;
    date: string;
    results: SerpResult[];
}

export async function calculateImprovedSerpVolatility(payload: Payload, date: string): Promise<Record<string, number>> {
    const today = date;
    const yesterday = new Date(new Date(today).getTime() - 86400000).toISOString().split("T")[0];

    const todaySnapshots = await payload.find({
        collection: "serpSnapshots",
        where: { date: { equals: today } },
        limit: 10000,
    });

    const yesterdaySnapshots = await payload.find({
        collection: "serpSnapshots",
        where: { date: { equals: yesterday } },
        limit: 10000,
    });

    const yesterdayMap = new Map<string, SerpResult[]>();
    const yesterdayDocs = yesterdaySnapshots.docs as unknown as SnapshotDoc[];
    for (const doc of yesterdayDocs) {
        yesterdayMap.set(doc.keyword, doc.results);
    }

    const categoryFlux: Record<string, { totalChange: number; count: number }> = {};

    for (const todayDoc of (todaySnapshots.docs as unknown as SnapshotDoc[]).filter((doc): doc is SnapshotDoc =>
        typeof doc.keyword === "string" &&
        typeof doc.category === "string" &&
        typeof doc.date === "string" &&
        Array.isArray(doc.results)
    )) {
        const yesterdayResults = yesterdayMap.get(todayDoc.keyword) || [];
        const todayResults = todayDoc.results;

        const flux = calculateFlux(todayResults, yesterdayResults);

        if (!categoryFlux[todayDoc.category]) {
            categoryFlux[todayDoc.category] = { totalChange: 0, count: 0 };
        }

        categoryFlux[todayDoc.category].totalChange += flux;
        categoryFlux[todayDoc.category].count++;
    }

    const finalScores: Record<string, number> = {};
    for (const category in categoryFlux) {
        const { totalChange, count } = categoryFlux[category];
        const averageChange = totalChange / Math.max(count, 1);
        const scaled = Math.min(10, Math.round((averageChange / 20) * 10 * 10) / 10); // scale 0–10
        finalScores[category] = scaled;
    }

    return finalScores;
}

function calculateFlux(today: SerpResult[], yesterday: SerpResult[]): number {
    const fluxMap = new Map<string, number>();
    yesterday.forEach((entry) => fluxMap.set(entry.link, entry.rank));

    let flux = 0;
    const matched = new Set<string>();

    // Flux for persistent or new entries
    today.forEach((entry) => {
        const prevRank = fluxMap.get(entry.link);
        if (prevRank) {
            flux += Math.abs(prevRank - entry.rank); // moved
        } else {
            flux += 10 - entry.rank; // new entry in top 10
        }
        matched.add(entry.link);
    });

    // Flux for dropped entries
    yesterday.forEach((entry) => {
        if (!matched.has(entry.link)) {
            flux += 10; // dropped from top 10
        }
    });

    return flux;
}
