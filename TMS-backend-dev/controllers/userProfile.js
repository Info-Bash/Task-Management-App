
import User from "../models/user.js";

export const userProfileController = async (req, res) => {
  try {
    const userId = req.params.id;
    const userData = await User.findById(userId).select('role fullname username age nationalid phonenumber email gender maritalstatus -_id');
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      user: userData
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}

export const userProfileUpdateController = async (req, res) => {
  try {
    const userId = req.params.id;

    // allow only editable fields
    const allowedFields = ["fullname", "age", "phonenumber", "maritalstatus"];
    const updateData = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // user updates only their own profile
    if (!req.userInfo || req.userInfo.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId, updateData,{
        new: true,
        runValidators: true
      }
    ).select("fullname age gender phonenumber maritalstatus email username nationalid role -_id");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (e) {
    console.error(e);

     // Mongoose validation error
    if (e.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(e.errors)[0].message
      });
    }

    // Duplicate key error
    if (e.code === 11000) {
      const field = Object.keys(e.keyValue)[0]; // e.g., 'nationalid'
      return res.status(409).json({
        success: false,
        message: 'Validation failed',
        errors: {
          [field]: `${field} already exists`
        }
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
