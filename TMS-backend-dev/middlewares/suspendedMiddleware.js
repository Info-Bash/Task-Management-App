
import User from "../models/user.js";

const checkSuspended = async (req, res, next) => {
    const user = await User.findById(req.userInfo.userId);

    if (!user.isActive) {
      return res.status(403).json({
        message: "Account suspended. Access denied."
      });
    }

    next();

};

export default checkSuspended;