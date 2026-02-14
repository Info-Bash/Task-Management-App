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

    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: taskId,
        owner: userId,
        status: { $ne: "completed" } // prevents double-complete
      },
      { status: "completed" },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found or already completed"
      });
    }

    res.status(200).json({
      success: true,
      message: "Task marked as completed",
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

/* Edit a Task */
export const editTask = async (req, res) => {
  try {
    const userId = req.userInfo.userId;
    const { id: taskId } = req.params;
    const { title, desc } = req.body || {};

    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (desc !== undefined) updateFields.desc = desc;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields provided for update"
      });
    }

    // 🔥 Only run duplicate check if title is being changed
    if (updateFields.title) {
      const conflict = await Task.findOne({
        owner: userId,
        title: updateFields.title,
        _id: { $ne: taskId } // ignore the task being edited
      });

      if (conflict) {
        return res.status(400).json({
          success: false,
          message: "You already have another task with this title"
        });
      }
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, owner: userId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found or not yours"
      });
    }

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


