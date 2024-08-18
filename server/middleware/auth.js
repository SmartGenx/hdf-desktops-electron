const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const  Unauthorized  = require('../errors/Unauthorized');
const {JWT_SECRET} = require('../secrets');

const prisma = new PrismaClient();

const isAuthenticated = async (req, res, next) => {
    // 1. Get the token from the request headers
    const token = req.headers.authorization;

    // 2. Check if the token is missing or undefined
    if (!token || typeof token !== 'string') {
        return next(new Unauthorized("Unauthorized"));
    }

    try {
        // 3. Verify and decode the token
        const payload = jwt.verify(token, JWT_SECRET);
        // Do something with the payload if needed

        // Fetch user data from the database
        const user = await prisma.user.findFirst({ where: { id: payload.userId } });

        // Check if the user exists
        if (!user) {
            return next(new Unauthorized("Unauthorized"));
        }

        // Assign the 'user' property
        req.user = user;

        // Call next() to proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle token verification error
        return next(new Unauthorized("Unauthorized"));
    }
};

module.exports = {isAuthenticated};
