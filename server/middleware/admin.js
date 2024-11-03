
const IsAdmin = async (req, res, next) => {
    const user = req.user;
    if (user && user.roleId === 1) {
        next();
    } else {
        
        // It's better not to append internal details like `user.roleId` to the error message sent to clients.
        res.status(401).json({ message: "Unauthorized access" });
    }
};


module.exports = {IsAdmin};
