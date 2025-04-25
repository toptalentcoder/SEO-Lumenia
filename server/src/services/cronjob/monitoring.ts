import cron from 'node-cron';
import { Payload } from 'payload';
import axios from 'axios';
import { saveKeywordsForSERPWeatherCategory } from '../serpWeather/saveKeywordsToDB';
import { internalPageRank } from '../UrlPageServie/internalPageRank';

// --------- TYPES ---------

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
    title?: string;
}

// --------- CRONJOB ---------

export function startDailyRankTracking(payload: Payload) {
    // 🔁 Every 5 minutes for testing (use '0 2 * * *' for daily at 2am)
    cron.schedule('0 0 * * *', async () => {
        console.log("🔁 Running daily SERP rank tracking...");

        const SERP_API_KEY = process.env.SERP_API_KEY;
        const today = new Date().toISOString().split("T")[0];

        // For the test mode
        // const now = new Date();
        // const today = `${now.toISOString().split("T")[0]}-${now.getHours()}-${now.getMinutes()}`;

        const { docs: shallowUsers } = await payload.find({ collection: 'users', limit: 9999 });

        for (const shallowUser of shallowUsers) {
            const user = await payload.findByID({
                collection: 'users',
                id: shallowUser.id
            }) as unknown as User;

            if (!user.projects?.length) continue;

            const updatedProjects: Project[] = await Promise.all(
                user.projects.map(async (project) => {
                    const updatedSeoGuides: SeoGuide[] = await Promise.all(
                        (project.seoGuides || []).map(async (guide) => {
                            if (!guide.query || !guide.queryID || !Array.isArray(guide.searchResults)) {
                                return guide;
                            }

                            try {
                                const res = await axios.get('https://serpapi.com/search', {
                                    params: {
                                        q: guide.query,
                                        api_key: SERP_API_KEY,
                                        num: 20
                                    }
                                });

                                const serpResults = res.data.organic_results as OrganicResult[] || [];
                                const serpLinks = serpResults.map((r) => r.link);
                                const cronjob: { [link: string]: CronEntry[] } = { ...(guide.cronjob ?? {}) };

                                const originalLinks = guide.searchResults.map((r) => r.link);
                                const linksToTrack = [...new Set([...originalLinks, ...serpLinks])];

                                for (const link of linksToTrack) {
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

                                // (Optional) Add new links to searchResults (if they weren’t originally tracked)
                                const newLinks = serpLinks.filter(link => !originalLinks.includes(link));
                                for (const newLink of newLinks) {
                                    guide.searchResults.push({
                                        title: serpResults.find(r => r.link === newLink)?.title || '',
                                        link: newLink,
                                        wordCount: 0 // Could be filled later
                                    });
                                }

                                return {
                                    ...guide,
                                    cronjob: { ...cronjob },
                                    searchResults: guide.searchResults
                                };
                            } catch (err) {
                                console.error(`❌ SERP fetch error for "${guide.query}" (queryID: ${guide.queryID}):`, err);
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

            // Save updated user
            await payload.update({
                collection: 'users',
                id: user.id,
                data: {
                    projects: updatedProjects
                }
            });

            console.log(`✅ Updated user: ${user.email}`);
        }

        console.log("✅ All users' rank tracking complete.");

        // Internal page rank cronjob
        const { docs } = await payload.find({
            collection: 'internalPageRanks',
            limit: 100,
        });

        for (const record of docs) {
            const scores = await internalPageRank(record.baseUrl, payload);

            await payload.update({
                collection: 'internalPageRanks',
                where: { baseUrl: { equals: record.baseUrl } },
                data: {
                    scores,
                    lastCrawledAt: new Date().toISOString(),
                },
            });

            console.log(`🔄 Refreshed PageRank for ${record.baseUrl}`);
        }

        console.log("✅ Monthly global internal PageRank refresh complete.");
    });
}
