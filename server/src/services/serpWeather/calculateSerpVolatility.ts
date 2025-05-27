import { Payload } from "payload";

interface SerpResult {
    rank: number;
    link: string;
    title?: string;
}

interface SnapshotDoc {
    keyword: string;
    category: string;
    tracking: {
        date: string;
        results: SerpResult[];
    }[];
}

export async function calculateImprovedSerpVolatility(
    payload: Payload,
    date: string
): Promise<Record<string, number>> {
    const today = date;
    const yesterday = new Date(
        new Date(today).getTime() - 86400000
    ).toISOString().split("T")[0];

    // ✅ fetch all and filter in-memory
    const snapshotData = await payload.find({
        collection: "serpSnapshots",
        limit: 10000,
    });

    const categoryFlux: Record<string, { totalChange: number; count: number }> = {};

    for (const doc of snapshotData.docs as unknown as SnapshotDoc[]) {
        const todayEntry = doc.tracking.find((t) => t.date === today);
        const yesterdayEntry = doc.tracking.find((t) => t.date === yesterday);

        if (!todayEntry || !yesterdayEntry) continue;

        const flux = calculateFlux(todayEntry.results, yesterdayEntry.results);

<<<<<<< HEAD
        console.log(flux)

=======
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c
        if (!categoryFlux[doc.category]) {
            categoryFlux[doc.category] = { totalChange: 0, count: 0 };
        }

        categoryFlux[doc.category].totalChange += flux;
        categoryFlux[doc.category].count++;
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

// Add a secondary metric like overlap ratio if needed
function calculateFlux(today: SerpResult[], yesterday: SerpResult[]): number {
    const fluxMap = new Map<string, number>();
    yesterday.forEach((entry) => fluxMap.set(entry.link, entry.rank));

    let flux = 0;
    const matched = new Set<string>();

    today.forEach((entry) => {
        const prevRank = fluxMap.get(entry.link);
        if (prevRank !== undefined) {
            flux += Math.abs(prevRank - entry.rank);
        } else {
            flux += 10 - entry.rank;
        }
        matched.add(entry.link);
    });

    yesterday.forEach((entry) => {
        if (!matched.has(entry.link)) {
            flux += 10;
        }
    });

    return flux;
}