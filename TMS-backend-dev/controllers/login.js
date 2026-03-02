import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginController = async (req, res) => {
  try {
    const {email, password} = req.body;

    //check if user exist in the DB
    const user = await User.findOne({email});

    if (!user){
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials!"
      })
    }

    // Check if user is suspended
    if (!user.isActive) {
      return res.status(400).json({
        message: "Your account has been suspended. Contact admin."
      })
    }

    // compare password when user exist
    const isPassMatch = await bcrypt.compare(password, user.password);

    if (!isPassMatch){
      return res.status(400).json({
        success : false,
        message : 'Invalid Credentials!'
      })
    }

    // create a user token
    const accessToken = jwt.sign({
      userId: user._id,
      username: user.username,
      role: user.role
    }, process.env.JWT_SECRET_KEY, {
      expiresIn: '10hrs'
    })

    res.status(200).json({
      success: true,
      message: 'User Logged in Successully!',
      accessToken
    })

  } catch (e) {
    console.log(e);

    /* General Error */
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
}

export default loginController;