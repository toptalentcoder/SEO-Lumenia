import { PayloadRequest } from "payload";
import qs from "querystring";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from "../config/apiConfig";

interface GoogleTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
    token_type: string;
    id_token?: string;
}

// Define expected structure of user data
interface GoogleUserResponse {
    id: string;
    email: string;
    verified_email: boolean;
    name: string;
    given_name?: string;
    family_name?: string;
    picture: string;
    locale?: string;
}

export const googleAuthHandler = async (req: PayloadRequest) : Promise<Response> => {

    // Extract authorization code from query string
    const url = req.url ? new URL(req.url, `http://localhost`) : null;
    const code = url?.searchParams.get("code");

    if (!code) {
        return new Response(
            JSON.stringify({ error: 'No authorization code found' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        // Step 1: Exchange authorization code for access token
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: qs.stringify({
                code,
                client_id: GOOGLE_CLIENT_ID,
                client_secret: GOOGLE_CLIENT_SECRET,
                redirect_uri: GOOGLE_REDIRECT_URI,
                grant_type: "authorization_code",
            }),
        });

        const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;

        if (!tokenData.access_token) {
            return new Response(
                JSON.stringify({ error: 'Failed to get access token' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Step 2: Fetch user info from Google
        const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        const userData = (await userResponse.json()) as GoogleUserResponse;
<<<<<<< HEAD
        console.log(userData);
=======
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c

        if (!userData.email) {
            return new Response(
                JSON.stringify({ error: 'No email found in user data' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Step 3: Check if user exists in Payload CMS
        const existingUser = await req.payload.find({
            collection: "users",
            where: { email: { equals: userData.email } },
        });

        let user;
        if (existingUser.docs.length > 0) {
            user = existingUser.docs[0];
        } else {
            user = await req.payload.create({
                collection: "users",
                data: {
                    email: userData.email,
                    password : 'googlePassword',
                    username: userData.name,
                    googleId: userData.id,
                    profileImageURL: userData.picture,
                    role : 'user'
                },
            });
        }

        // Step 4: Authenticate user and create a session
        const loggedInUser = await req.payload.login({
            collection: "users",
            data: {
                email: user.email,
                password : user.password ?? "googlePassword"
            },
            req, // Pass the request object to maintain session cookies
        });

        if (loggedInUser) {

            // Step 5: Redirect to the frontend with the token
<<<<<<< HEAD
            const frontendUrl = `http://localhost:3000/auth/google/callback?userData=${encodeURIComponent(JSON.stringify(loggedInUser))}`;
=======
            const frontendUrl = `https://lumenia.io/auth/google/callback?userData=${encodeURIComponent(JSON.stringify(loggedInUser))}`;
>>>>>>> 5d3cd160f40f1342a61686711004e9c33c78384c

            // Return a 302 redirect to the frontend with the token
            return Response.redirect(frontendUrl, 302);
        }

        return new Response(
            JSON.stringify({ error: 'Authentication failed' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error("OAuth error:", error);
        return new Response(
            JSON.stringify({ error: 'Authentication failed' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
