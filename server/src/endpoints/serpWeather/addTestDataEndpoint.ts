import { withErrorHandling } from "@/middleware/errorMiddleware";
import { Endpoint, PayloadRequest } from "payload";
import { calculateImprovedSerpVolatility } from "@/services/serpWeather/calculateSerpVolatility";
import { addDays, format } from "date-fns";

export const addTestDataEndpoint: Endpoint = {
  path: "/add-test-data",
  method: "post",
  handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
    try {
      const { payload } = req;
      
      // Calculate yesterday's date
      const yesterday = addDays(new Date(), -1);
      const yesterdayStr = format(yesterday, "yyyy-MM-dd");
      const todayStr = format(new Date(), "yyyy-MM-dd");

      // Get today's snapshots
      const todaySnapshots = await payload.find({
        collection: "serpSnapshots",
        where: {
          "tracking.date": {
            equals: todayStr,
          },
        },
      });

      // Create yesterday's data based on today's data
      for (const snapshot of todaySnapshots.docs) {
        // Find today's tracking entry
        const todayTracking = snapshot.tracking?.find(t => t.date === todayStr);
        if (!todayTracking) continue;
        
        // Create a slightly modified version of today's data for yesterday
        const yesterdayTracking = {
          ...todayTracking,
          date: yesterdayStr,
          results: todayTracking.results?.map(result => ({
            ...result,
            rank: Math.max(1, result.rank + Math.floor(Math.random() * 3) - 1), // Slightly vary the rank
          })),
        };

        // Create or update the snapshot with yesterday's data
        if (snapshot.tracking) {
          // Remove yesterday's entry if it exists
          const filteredTracking = snapshot.tracking.filter(t => t.date !== yesterdayStr);
          
          // Add yesterday's entry
          const updatedTracking = [...filteredTracking, yesterdayTracking];
          
          // Update the snapshot
          await payload.update({
            collection: "serpSnapshots",
            id: snapshot.id,
            data: {
              tracking: updatedTracking,
            },
          });
        } else {
          // Create new snapshot with yesterday's data
          await payload.create({
            collection: "serpSnapshots",
            data: {
              keyword: snapshot.keyword,
              category: snapshot.category,
              tracking: [yesterdayTracking],
            },
          });
        }
      }

      // Calculate volatility scores
      const volatilityScores = await calculateImprovedSerpVolatility(payload, todayStr);

      // Save volatility scores
      for (const [category, score] of Object.entries(volatilityScores)) {
        await payload.create({
          collection: "serpVolatilityScores",
          data: {
            category,
            date: todayStr,
            score,
            scoreLevel: getScoreLevel(score),
            features: {
              peopleAlsoAsk: 0,
              imagePack: 0,
              related: 0,
              knowledgeGraph: 0,
              newsPack: 0,
            },
          },
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Test data added successfully",
          snapshotsAdded: todaySnapshots.docs.length,
          volatilityScoresAdded: Object.keys(volatilityScores).length,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error adding test data:", error);
      
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to add test data",
          error: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }),
};

// Helper function to determine score level
function getScoreLevel(score: number): 'low' | 'medium' | 'high' | 'extreme' {
  if (score < 3) return 'low';
  if (score < 5) return 'medium';
  if (score < 8) return 'high';
  return 'extreme';
} 