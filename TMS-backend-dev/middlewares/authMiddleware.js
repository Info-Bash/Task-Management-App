import jwt from 'jsonwebtoken'

const authMiddleWare = async (req, res, next) => {
  
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
      return res.status(401).json({
        success: false,
        message: 'Access denied, no token provided'
      })
    }
    // Decode the token
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userInfo = decodedToken
    next();
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: 'Access Denied, no token provided'
    })
  }
}

export default authMiddleWare;