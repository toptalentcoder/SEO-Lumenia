import { saveKeywordsForSERPWeatherCategory } from '@/services/serpWeather/saveKeywordsToDB';
import { Endpoint, PayloadRequest } from 'payload';

// Define the Payload endpoint
export const saveKeywordsForSERPWeatherCategoryEndpoint: Endpoint = {
    path: '/save-keywords-for-serp-weather-category',
    method: 'get',
    handler: async (req: PayloadRequest) => {
        try {

            await saveKeywordsForSERPWeatherCategory(req.payload);

            // Return the collected results
            return new Response(
                JSON.stringify({
                    message: 'Fetch completed.',
                }),
                {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        } catch (error: unknown) {
            console.error('Error occurred while fetching:', error);

            return new Response(
                JSON.stringify({
                    message: 'An error occurred while fetching data.',
                    error: (error instanceof Error) ? error.message : 'Unknown error',
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
    },
};
