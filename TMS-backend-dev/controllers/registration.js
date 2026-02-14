
import User from '../models/user.js'

const regisController = async (req, res) => {
  try {
    //extract user information (not trusting all data coming from req.body)
    const { fullname, username, age, nationalid, phonenumber, email, gender, maritalstatus, password } = req.body;

    //create new user and save it
    const newUser = await User.create({
      fullname,
      username,
      age,
      nationalid,
      phonenumber,
      email,
      gender,
      maritalstatus,
      password
    });

    if (newUser) {
      res.status(201).json({
        success: true,
        message: 'New user registered successfully'
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Unable to register new User! Please try again.'
      });
    }

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

    // Unknown / server error
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
}

export default regisController;