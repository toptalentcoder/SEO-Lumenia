import cron from 'node-cron';
import payload from 'payload';
import axios from 'axios';

// --------------- TYPES ------------------

interface CronEntry {
    date: string;
    position: number;
}

interface SearchResult {
    title: string;
    link: string;
    wordCount: number;
    soseo?: number;
    dseo?: number;
}

interface SeoGuide {
    query: string;
    queryID: string;
    searchResults: SearchResult[];
    cronjob?: {
        [link: string]: CronEntry[];
    };
}

interface Project {
    projectID: string;
    projectName: string;
    seoGuides: SeoGuide[];
}

interface User {
    id: string;
    email: string;
    projects: Project[];
}

interface OrganicResult {
    link: string;
}

// --------------- DAILY TRACKING FUNCTION ------------------

export function startDailyRankTracking() {
    // Runs every day at 2:00 AM
    cron.schedule('*/5 * * * *', async () => {
        console.log("🔁 Running daily SERP rank tracking...");

        const SERP_API_KEY = process.env.SERP_API_KEY;
        const today = new Date().toISOString().split("T")[0];

        const users = await payload.find({ collection: 'users', limit: 9999 });

        for (const userDoc of users.docs) {
            const user = userDoc as unknown as User;

            const updatedProjects = await Promise.all(
                (user.projects || []).map(async (project): Promise<Project> => {
                    const updatedSeoGuides = await Promise.all(
                        (project.seoGuides || []).map(async (guide): Promise<SeoGuide> => {
                            if (!guide.query || !guide.queryID || !Array.isArray(guide.searchResults)) {
                                return guide;
                            }

                            try {
                                const res = await axios.get('https://serpapi.com/search', {
                                    params: {
                                        q: guide.query,
                                        api_key: SERP_API_KEY,
                                    },
                                });

                                const serpLinks = (res.data.organic_results as OrganicResult[] | undefined)?.map((r) => r.link) || [];
                                const cronjob = guide.cronjob || {};

                                for (const result of guide.searchResults) {
                                    const link = result.link;
                                    const position = serpLinks.indexOf(link) + 1;

                                    if (position > 0) {
                                        if (!cronjob[link]) cronjob[link] = [];

                                        const alreadyTracked = cronjob[link].some(
                                            (entry: CronEntry) => entry.date === today
                                        );

                                        if (!alreadyTracked) {
                                            cronjob[link].push({ date: today, position });
                                        }
                                    }
                                }

                                return {
                                    ...guide,
                                    cronjob
                                };
                            } catch (err) {
                                if (err instanceof Error) {
                                    console.error(`❌ SERP fetch error for "${guide.query}" (queryID: ${guide.queryID}):`, err.message);
                                } else {
                                    console.error(`❌ SERP fetch error for "${guide.query}" (queryID: ${guide.queryID}):`, err);
                                }
                                return guide;
                            }
                        })
                    );

                    return {
                        ...project,
                        seoGuides: updatedSeoGuides
                    };
                })
            );

            // Save updated user data
            await payload.update({
                collection: 'users',
                id: user.id,
                data: {
                    projects: updatedProjects
                }
            });
        }

        console.log("✅ Daily SERP rank tracking complete.");
    });
}
