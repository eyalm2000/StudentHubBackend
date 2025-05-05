import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import User, { IUser } from '../models/User';

declare module 'express' {
    export interface Request {
        user?: IUser;
    }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // TODO: add real jwt secret for production
            let decoded: any;
            try {
                decoded = jwt.verify(token, config.jwtSecret);
            } catch (error) {
                console.error('!!! AUTH ERROR:', error);
                return res.status(401).json({ message: 'Unauthorized' });
            }
            
            try {
                const user = await User.findById(decoded.userId);
                if (!user) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                req.user = user;
            } catch (error) {
                console.error('!!! AUTH ERROR:', error);
                return res.status(401).json({ message: 'Unauthorized' });
            }

            next();
        } catch (error) {
            console.error('!!! AUTH ERROR:', error);
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export default authMiddleware;