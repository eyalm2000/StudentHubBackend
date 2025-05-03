import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
// import User, { IUser } from '../models/User';

declare module 'express' {
    export interface Request {
        user?: IUser;
    }
}