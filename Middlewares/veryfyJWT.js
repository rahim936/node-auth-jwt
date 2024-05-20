import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import UserModel from '../Models/UserModel.js';

dotenv.config();

export const verifyJWT = (req, res, next) => {
  const accessToken = req.signedCookies['Access-Token'];
  if (!accessToken) return res.sendStatus(403);

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, { algorithms: ['HS256'] }, async (err, payload) => {
    try {
      if (err) return res.status(401).json({ success: false, message: err.message, name: err.name });

      const user = await UserModel.findOne({ accessToken: accessToken });
      if (!user) return res.status(401).json({ success: false, message: 'invalid refresh token' });

      if (payload.userID === user._id.toString()) {
        if (payload.sub === user.jwtID) {
          req.user = { userID: payload.userID, username: payload.username, isLoggedIn: true, isAuthenticated: true };
          return next();
        }
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
};
