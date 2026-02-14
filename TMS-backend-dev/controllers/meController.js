import User from '../models/user.js';

const meController = async (req, res) => {
  try {
    const user = await User.findById(req.userInfo.userId)
      .select("_id username role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export default meController;