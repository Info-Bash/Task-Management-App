
import User from "../models/user.js";

const adminMiddleware = async (req, res, next) => {
  const user = await User.findById(req.userInfo.userId);
  if (user && user.role === 'admin') {
    next(); // User is an admin, allow access
  } else {
    res.status(403).json({
      message: 'Access denied. Admins only.'
    }); // User is not an admin, deny access
  }
};

export default adminMiddleware;