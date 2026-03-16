import Task from "../models/task.js";


/* User Create Task  */
export const createTask = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { title, desc } = req.body || {};

    const newTask = await Task.create({
      title,
      desc,
      owner: userId
    });

    if (!newTask) {
      return res.status(400).json({
        success: false,
        message: "Unable to create new task! Please try again."
      });
    } else {
      res.status(201).json({
        success: true,
        message: "New task created successfully",
        data: newTask
      });
    }

  } catch (e) {
    console.error(e);
    // Mongoose validation error    if (e.name === 'ValidationError') {
    if (e.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.keys(e.errors).map(key => e.errors[key].message)
      });
    }

    // Duplicate key error
    if (e.code === 11000) {
      const field = Object.keys(e.keyValue)[1]; // e.g., 'nationalid'
      return res.status(409).json({
        success: false,
        message: "Validation failed",
        errors: {
          [field]: `User task with this ${field} already exists`
        }
      });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later."
    });
  }
};

/* Get All User Tasks */
export const getAllUserTasks = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    const tasks = await Task.find({ owner: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: tasks.length
        ? "Tasks retrieved successfully"
        : "No tasks yet",
      data: tasks,
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

/* Delete a Task */
export const deleteTask = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { id: taskId } = req.params;

    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      owner: userId
    });

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found or not yours"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: deletedTask
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


/* Delete multiple tasks */
export const deleteMultipleTasks = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { ids } = req.body;

    // Validate input
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide an array of task IDs"
      });
    }

    const result = await Task.deleteMany({
      _id: { $in: ids },
      owner: userId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No tasks found to delete"
      });
    }

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} task(s) deleted successfully`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* Mark a task as completed */
export const markTaskCompleted = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { id: taskId } = req.params;

    const task = await Task.findOne({ _id: taskId, owner: userId });

    if (!task) {
      return res.status(404).json({ 
        success: false, 
        message: "Task not found" 
      });
    }

    if (task.status === "completed") {
      return res.status(400).json({ 
        success: false, 
        message: "Task already completed" 
      });
    }

    if (task.status !== "pending") {
      return res.status(400).json({ 
        success: false, 
        message: "Only pending tasks can be marked as completed" 
      });
    }

    task.status = "completed";
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task marked as completed",
      data: task
    });

  } catch (error) {
    console.error(error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* Edit a Task */
export const editTask = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { id: taskId } = req.params;
    const { title, desc } = req.body || {};

    if (!title && !desc) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update"
      });
    }

    // Fetch the task first
    const task = await Task.findOne({ _id: taskId, owner: userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or not yours"
      });
    }

    // Block editing if completed or verified
    if (task.status === "completed" || task.status === "verified") {
      return res.status(400).json({
        success: false,
        message: "Completed or verified tasks cannot be edited"
      });
    }

    const updateFields = {};

    if (title !== undefined) {
      const trimmedTitle = title.trim();

      // Duplicate check only if title changes
      if (trimmedTitle !== task.title) {
        const conflict = await Task.findOne({
          owner: userId,
          title: trimmedTitle,
          _id: { $ne: taskId }
        });

        if (conflict) {
          return res.status(400).json({
            success: false,
            message: "You already have another task with this title"
          });
        }
      }

      updateFields.title = trimmedTitle;
    }

    if (desc !== undefined) {
      updateFields.desc = desc;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask
    });

  } catch (error) {
    console.error(error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// admin mark a task as verified
export const markTaskVerified = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findOne({ _id: taskId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    if (task.status === "verified") {
      return res.status(400).json({
        success: false,
        message: "Task already verified"
      });
    }

    if (task.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Only completed tasks can be verified"
      });
    }

    task.status = "verified";
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task marked as verified",
      data: task
    });

  } catch (error) {
    console.error(error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Admin delete a task
export const adminDeleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    if (task.status !== "verified") {
      return res.status(400).json({
        success: false,
        message: "Only verified tasks can be deleted"
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });

  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};