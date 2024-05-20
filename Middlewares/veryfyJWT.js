import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import UserModel from '../Models/UserModel.js';

dotenv.config();

export const verifyJWT = async (req, res, next) => {
  const accessToken = req.signedCookies['Access-Token'];
  if (!accessToken) return res.sendStatus(403);

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, { algorithms: ['HS256'] }, async (err, decodedToken) => {
    try {
      if (err) return res.status(401).json({ success: false, message: err.message, name: err.name });

      const user = await UserModel.findOne({ accessToken: accessToken });
      if (!user) return res.status(401).json({ success: false, message: 'invalid refresh token' });

      if (decodedToken.userID === user._id.toString()) {
        if (decodedToken.sub === user.jwtID) {
          req.user = { userID: decodedToken.userID, username: decodedToken.username, isLoggedIn: true, isAuthenticated: true };
          return next();
        }
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
};
