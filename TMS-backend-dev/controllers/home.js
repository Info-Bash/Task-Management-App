import User from '../models/user.js';

const homeController = async (req, res) => {
  try {
    const user = await User.findById(req.userInfo.userId)
      .select("_id username role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "welcome to the home page",
      user
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Server error"
    })
  }
}




/* const homeController = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    const tasks = await Task.find({ user: userId });

    res.status(200).json({
      success: true,
      message: "Welcome to your dashboard",
      stats: {
        totalTasks: tasks.length,
        completed: tasks.filter(t => t.status === "completed").length,
        pending: tasks.filter(t => t.status === "pending").length,
      },
      tasks
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}; */





export default homeController;