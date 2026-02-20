import { google } from 'googleapis';
import ConnectDB from '@/DB/connectDB';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
    const { code, error } = req.query;

    if (error) {
        return res.redirect(`/auth/login?error=${error}`);
    }

    if (!code) {
        return res.redirect('/auth/login?error=no_code');
    }

    try {
        await ConnectDB();

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google/callback`
        );

        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Get user info from Google
        const peopleService = google.people({ version: 'v1', auth: oauth2Client });
        const googleUser = await peopleService.people.get({
            resourceName: 'people/me',
            personFields: 'emailAddresses,names,photos',
        });

        const email = googleUser.data.emailAddresses?.[0]?.value;
        const name = googleUser.data.names?.[0]?.displayName || 'User';
        const googleId = googleUser.data.resourceName.split('/')?.[1];
        const profilePic = googleUser.data.photos?.[0]?.url;

        if (!email) {
            return res.redirect('/auth/login?error=no_email');
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // Update Google info if not already set
            if (!user.googleId) {
                user.googleId = googleId;
                user.provider = 'google';
                if (profilePic) {
                    user.profilePic = profilePic;
                }
                await user.save();
            }
        } else {
            // Create new user
            user = await User.create({
                name,
                email,
                googleId,
                profilePic: profilePic || null,
                provider: 'google',
                password: null,
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECREAT,
            { expiresIn: '1d' }
        );

        // Prepare user data
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
            provider: user.provider
        };

        // Redirect to success page with token and user data
        res.redirect(
            `/auth/google-success?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`
        );
    } catch (error) {
        res.redirect(`/auth/login?error=callback_error`);
    }
};

