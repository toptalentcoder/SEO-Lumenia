import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import qs from "qs";
import nodemailer from 'nodemailer';
import VerificationToken from '../models/emailVerificationToken.model.js';
import crypto from 'crypto';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET; // 🔐 Your secret key for JWT
const BASE_URL = process.env.BASE_URL;

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Send verification email
// const sendVerificationEmail = async (email, token) => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: Number(process.env.EMAIL_PORT),
//         secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS,
//         },
//         tls: {
//             rejectUnauthorized: false, // Bypass SSL certificate issues
//         },
//     });

//     const verifyUrl = `${BASE_URL}/api/auth/verify/${token}`;
//     const mailOptions = {
//         from: `"Your App" <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: 'Verify Your Email',
//         text: `Click the following link to verify your email: ${verifyUrl}`,
//         html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email. This link expires in 10 minutes.</p>`,
//     };

//     await transporter.sendMail(mailOptions);
// };

// @route  POST /api/auth/register
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });

    if (user) {
        // const verificationToken = crypto.randomBytes(32).toString('hex');
        // const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10-minute expiry

        // await VerificationToken.create({
        //     userId: user._id,
        //     token: verificationToken,
        //     expiresAt,
        // });

        // await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

// @route  GET /api/auth/verify/:token
// export const verifyUser = async (req, res) => {
//     const { token } = req.params;

//     const tokenEntry = await VerificationToken.findOne({ token });

//     if (!tokenEntry) {
//         return res.status(400).json({ message: 'Invalid or expired token' });
//     }

//     if (tokenEntry.expiresAt < new Date()) {
//         await VerificationToken.deleteOne({ _id: tokenEntry._id }); // Cleanup expired token
//         return res.status(400).json({ message: 'Verification token has expired. Please register again.' });
//     }

//     // Verify user and remove token
//     const user = await User.findById(tokenEntry.userId);
//     if (!user) return res.status(400).json({ message: 'User not found' });

//     user.isVerified = true;
//     await user.save();

//     // Remove the token after successful verification
//     await VerificationToken.deleteOne({ _id: tokenEntry._id });

//     res.json({ message: 'Email verified successfully. You can now log in.' });
// };

// @route  POST /api/auth/login
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Prevent login if the user is not verified
    // if (!user.isVerified) {
    //     return res.status(401).json({ message: 'Please verify your email before logging in.' });
    // }

    if (await user.matchPassword(password)) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

// @route  GET /api/auth/profile (Protected)
export const getUserProfile = async (req, res) => {
    res.json(req.user);
};

export const googleAuth = async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).json({ error: "No authorization code found" });
    }

    try {
        // 🔹 Step 1: Exchange authorization code for access token
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

        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token) {
            return res.status(400).json({ error: "Failed to get access token" });
        }

        // 🔹 Step 2: Fetch user info from Google
        const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        const userData = await userResponse.json();
        if (!userData.email) {
            return res.status(400).json({ error: "No email found in user data" });
        }

        // 🔹 Step 3: Check if user exists in MongoDB
        let user = await User.findOne({ email: userData.email });

        if (!user) {
            // 🔹 Step 4: Create new user
            user = new User({
                email: userData.email,
                name: userData.name,
                googleId: userData.id,
                avatar: userData.picture,
                role: "user",
            });
            await user.save();
        }

        // 🔹 Step 5: Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 🔹 Step 6: Redirect to frontend with token
        const frontendUrl = `http://localhost:3000/auth/google/callback?userData=${encodeURIComponent(
            JSON.stringify({ user, token })
        )}`;

        return res.redirect(frontendUrl);
    } catch (error) {
        console.error("OAuth error:", error);
        return res.status(500).json({ error: "Authentication failed" });
    }
};
