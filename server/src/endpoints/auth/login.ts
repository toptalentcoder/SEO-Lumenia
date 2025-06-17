import { Endpoint, PayloadRequest } from 'payload';
import { withErrorHandling } from '@/middleware/errorMiddleware';
import { FRONTEND_URL } from '@/config/apiConfig';

export const loginEndpoint: Endpoint = {
  path: '/login',
  method: 'post',
  handler: withErrorHandling(async (req: PayloadRequest): Promise<Response> => {
    const { payload } = req;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': FRONTEND_URL || 'http://167.235.246.98:3001',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400',
    };

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    try {
      if (!req.json) {
        throw new Error('Invalid request: Missing JSON parsing function');
      }

      const { email, password } = await req.json();

      if (!email || !password) {
        return new Response(
          JSON.stringify({ error: 'Email and password are required' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          }
        );
      }

      // Attempt to login
      const { user, token } = await payload.login({
        collection: 'users',
        data: { email, password },
        depth: 0,
      });

      // Return the user data and token
      return new Response(
        JSON.stringify({
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,
            profilePicture: user.profilePicture,
            profileImageURL: user.profileImageURL,
            role: user.role,
            subscriptionPlan: user.subscriptionPlan,
            apiPlan: user.apiPlan,
            availableFeatures: user.availableFeatures,
          },
          token,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    } catch (error) {
      console.error('Login error:', error);
      return new Response(
        JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Authentication failed' 
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
  }),
}; 