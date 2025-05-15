import { Request, Response, NextFunction } from 'express';

const IsAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // You may want to extend Request interface to include `user`
    const user = req.user as any;
    if (user && user.roleId === 1) {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized access" });
    }
};

export { IsAdmin };