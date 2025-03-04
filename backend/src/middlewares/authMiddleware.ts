import {NextFunction, Request, Response, RequestHandler} from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

export interface AuthenticatedRequest extends Request {
    user?: { userId: number, username: string, displayName: string };
}

export const authenticateUser: RequestHandler = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({message: 'Access denied. No token provided.'});
        return;
    }

    const token = authHeader.split(' ')[1];

    try {
        req.user = jwt.verify(token, JWT_SECRET) as { userId: number, username: string, displayName: string };
        next();
    } catch (error) {
        console.error("❌ Token verification failed:", error);
        res.status(401).json({message: 'Invalid or expired token.'});
        return;
    }
};
