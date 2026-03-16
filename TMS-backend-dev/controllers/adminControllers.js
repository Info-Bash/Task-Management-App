import User from "../models/user.js";
import Task from "../models/task.js";


/* Get all Users in admin Page */
export const getUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 8;
    const search = req.query.search || "";
    const role = req.query.role || "";
    const isActive = req.query.isActive || "";

    const skip = (page - 1) * limit;

    // Build match condition
    let match = {};

    if (search) {
      match.username = { $regex: search, $options: "i" };
    }

    if (role) {
      match.role = role;
    }

    if (isActive === "true" || isActive === "false") {
      match.isActive = isActive === "true";
    }

    // Get total count (for pagination)
    const totalResults = await User.countDocuments(match);
    const totalPages = Math.ceil(totalResults / limit);

    // Aggregation
    const users = await User.aggregate([
      { $match: match },

      {
        $lookup: {
          from: "tasks",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$owner", "$$userId"] }
              }
            },
            {
              $group: {
                _id: null,
                totalTasks: { $sum: 1 },
                completedTasks: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "completed"] }, 1, 0]
                  }
                },
                verifiedTasks: {
                  $sum: {
                    $cond: [{ $eq: ["$status", "verified"] }, 1, 0]
                  }
                }
              }
            }
          ],
          as: "taskStats"
        }
      },

      {
        $addFields: {
          totalTasks: { $ifNull: [{ $arrayElemAt: ["$taskStats.totalTasks", 0] }, 0] },
          completedTasks: { $ifNull: [{ $arrayElemAt: ["$taskStats.completedTasks", 0] }, 0] },
          verifiedTasks: { $ifNull: [{ $arrayElemAt: ["$taskStats.verifiedTasks", 0] }, 0] }
        }
      },

      {
        $project: {
          _id: 1,
          username: 1,
          gender: 1,
          role: 1,
          isActive: 1,
          totalTasks: 1,
          completedTasks: 1,
          verifiedTasks: 1
        }
      },

      { $skip: skip },
      { $limit: limit }
    ]);

    res.json({
      users,
      totalPages,
      totalResults
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* Get all Tasks in admin Page */
export const getAllTasksAdmin = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const rawSearch = req.query.search?.trim() || "";
    const status = req.query.status || "";
    const skip = (page - 1) * limit;


    // Search parsing logic

    let usernameSearch = null;
    let titleSearch = null;

    if (rawSearch) {
      const parts = rawSearch.split(" ");

      const usernamePart = parts.find(p => p.startsWith("@"));

      if (usernamePart) {
        usernameSearch = usernamePart.substring(1); // remove "@"
        titleSearch = parts
          .filter(p => !p.startsWith("@"))
          .join(" ");
      } else {
        titleSearch = rawSearch;
      }
    }

    // Aggregation Pipeline

    const result = await Task.aggregate([
      // Join users first
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerInfo"
        }
      },

      {
        $unwind: {
          path: "$ownerInfo",
          preserveNullAndEmptyArrays: false
        }
      },

      // Task Filtering
      {
        $match: {
          ...(status && { status }),

          ...(usernameSearch && {
            "ownerInfo.username": {
              $regex: usernameSearch,
              $options: "i"
            }
          }),

          ...(titleSearch && {
            title: {
              $regex: titleSearch,
              $options: "i"
            }
          })
        }
      },

      // Facet (single DB hit for data + total count + status breakdown)
      {
        $facet: {
          tasks: [
            {
              $addFields: {
                ownerUsername: "$ownerInfo.username",

                shortTitle: {
                  $cond: {
                    if: { $gt: [{ $strLenCP: "$title" }, 40] },
                    then: {
                      $concat: [
                        { $substrCP: ["$title", 0, 40] },
                        "..."
                      ]
                    },
                    else: "$title"
                  }
                },

                shortDescription: {
                  $cond: {
                    if: { $gt: [{ $strLenCP: "$desc" }, 80] },
                    then: {
                      $concat: [
                        { $substrCP: ["$desc", 0, 80] },
                        "..."
                      ]
                    },
                    else: "$desc"
                  }
                },

                displayTime: {
                  $switch: {
                    branches: [
                      {
                        case: { $eq: ["$status", "completed"] },
                        then: "$dateCompleted"
                      },
                      {
                        case: { $eq: ["$status", "verified"] },
                        then: "$dateVerified"
                      }
                    ],
                    default: "$createdAt"
                  }
                }
              }
            },

            { $sort: { displayTime: -1 } },
            { $skip: skip },
            { $limit: limit },

            {
              $project: {
                _id: 1,
                shortTitle: 1,
                shortDescription: 1,
                ownerUsername: 1,
                status: 1,
                displayTime: 1
              }
            }
          ],

          // Count total filtered tasks
          totalCount: [
            { $count: "count" }
          ],

          // Status breakdown
          statusStats: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]);

    // Response (extracting results from facet)

    const tasks = result[0].tasks;
    const totalTasks = result[0].totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalTasks / limit);

    const statusMap = {
      pending: 0,
      completed: 0,
      verified: 0
    };

    result[0].statusStats.forEach(stat => {
      statusMap[stat._id] = stat.count;
    });

    res.json({
      tasks,
      totalTasks,
      totalPending: statusMap.pending,
      totalCompleted: statusMap.completed,
      totalVerified: statusMap.verified,
      totalPages
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* Update user status (activate/suspend) */
export const toggleUserStatus = async (req, res) => {
  try {
    const presentUserId = req.userInfo.userId;
    const { userId } = req.params;
    const { isActive } = req.body;

    // prevent self status change
    if (presentUserId === userId) {
      return res.status(400).json({
        message: "You cannot change your own account status"
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: `User ${isActive ? "activated" : "suspended"} successfully`,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* Update user role (admin/user) */
export const updateUserRole = async (req, res) => {
  try {
    const presentUserId = req.userInfo.userId;
    const { userId } = req.params;
    const { role } = req.body;

    // allowed roles
    const allowedRoles = ["user", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role"
      });
    }

    // prevent self role change    
    if (presentUserId === userId) {
      return res.status(400).json({
        message: "You cannot change your own role"
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: `User role updated to ${role}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

/* Delete user */
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const presentUserId = req.userInfo.userId;

    // prevent self delete
    if (presentUserId === userId) {
      return res.status(400).json({
        message: "You cannot delete your own account"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // prevent deleting last admin
    if (user.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });

      if (adminCount === 1) {
        return res.status(400).json({
          message: "Cannot delete the last admin"
        });
      }
    }

    // delete related tasks
    await Task.deleteMany({ owner: userId });

    // delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User deleted successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
};