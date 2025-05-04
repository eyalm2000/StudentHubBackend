import { Request, Response, NextFunction } from 'express';
import config from '../config';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { google } from 'googleapis';

export const redirectToGoogle = async (req: Request, res: Response, next: NextFunction) => {
    console.log('initiating google oauth flow');
    try {
        const oauth2Client = new google.auth.OAuth2(
            config.google.clientId,
            config.google.clientSecret,
            config.google.redirectUri
        );

        const googleAuthUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/classroom.courses.readonly',
                'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
                'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly'
            ],
            prompt: 'consent'
        });

        console.log('redirecting to google auth url', googleAuthUrl);
        res.redirect(googleAuthUrl);

    } catch (error) {
        console.error('!!! ERROR redirecting to google', error);
        next(error);
    }
}

export const handleGoogleCallback = async (req: Request, res: Response, next: NextFunction) => {
    console.log('handling google callback');
    try {
        const code = req.query.code as string;
        if (!code) {
            console.error('!!! No code provided by google');
            res.status(400).send('No authorization code provided by google');
            return;
        }

        console.log(`Received authorization code: ${code.substring(0, 10)}...`);

        const oauth2Client = new google.auth.OAuth2(
            config.google.clientId,
            config.google.clientSecret,
            config.google.redirectUri
        )

        const { tokens } = await oauth2Client.getToken(code);
        console.log('tokens received from google');

        oauth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        })

        const userInfo = await oauth2.userinfo.get();
        console.log('user info received from google', userInfo);
        
        const profile = userInfo.data;
        console.log('user profile:', profile);

        let user = await User.findOne({ googleAccountId: profile.id });
        if (user) {
            
            console.log('user found:', user.name.google, 'email:', user._id);
            user.name.google = profile.name || user.name.google;
            user.email = profile.email || user.email;
            user.profilePictureUrl = {
                google: profile.picture || user.profilePictureUrl?.google || '',
                ofek: user.profilePictureUrl?.ofek || '',
                webtop: user.profilePictureUrl?.webtop || ''
            };

            user.googleTokens = {
                accessToken: tokens.access_token!,
                refreshToken: tokens.refresh_token || user.googleTokens?.refreshToken || '',
                expiresAt: new Date(tokens.expiry_date!)
            };

            await user.save();
            console.log('user updated successfully');

        } else {
            console.log('user not found, creating new user...');
            user = new User({
                googleAccountId: profile.id,
                name: {
                    google: profile.name || 'Unamed User',
                },
                email: profile.email,
                profilePictureUrl: {
                    google: profile.picture || null,
                    ofek: '',
                    webtop: ''
                },
                googleTokens: {
                    accessToken: tokens.access_token!,
                    refreshToken: tokens.refresh_token || null,
                    expiresAt: new Date(tokens.expiry_date!)
                }
            });
            
            await user.save();
            console.log('new user created successfully with id:', user._id);

            const payload = {
                userId: user._id.toString(),
                email: user.email,
                name: user.name.google
            };
            
            const jwtToken = jwt.sign(
                payload,
                config.jwtSecret!,
                { expiresIn: '7d' }
            )

            console.log(`JWT generated for user ${user._id}`);

            res.status(200).json({
                message: 'Authentication successful!',
                token: jwtToken,
                userId: user._id,
                name: user.name.google,
                email: user.email
            });
        }
    } catch (error) {
        console.error('!!! ERROR handling google callback', error);
        next(error);
    }
}

