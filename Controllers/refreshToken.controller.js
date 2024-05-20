import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import UserModel from '../Models/UserModel.js';

dotenv.config();

const refreshTokenController = (req, res) => {
  const refreshToken = req.signedCookies['Refresh-Token'];

  if (!refreshToken) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, { algorithms: ['HS256'] }, async (err, payload) => {
    try {
      if (err) return res.status(403).json({ success: false, err_message: err.message, err_name: err.name });

      const user = await UserModel.findOne({ refreshToken: refreshToken });
      
      if (user) {
        if (payload.userID === user._id.toString()) {
          if (payload.sub === user.jwtID) {
            const jwtID = crypto.randomUUID();

            const accessToken = jwt.sign({ userID: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, {
              algorithm: 'HS256',
              audience: 'PostMan',
              issuer: 'http://127.0.0.1:3000/',
              subject: jwtID,
              expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
            });

            const refreshToken = jwt.sign({ userID: user._id, username: user.username }, process.env.REFRESH_TOKEN_SECRET, {
              algorithm: 'HS256',
              audience: 'PostMan',
              issuer: 'http://127.0.0.1:3000/',
              expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
              subject: jwtID,
            });

            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
            user.jwtID = jwtID;

            await user.save();

            return res
              .status(200)
              .cookie('Access-Token', accessToken, { httpOnly: true, secure: true, signed: true, maxAge: 1 * 60 * 60 * 1000 })
              .cookie('Refresh-Token', refreshToken, { httpOnly: true, secure: true, signed: true, maxAge: 2 * 60 * 60 * 1000 })
              .json({ success: true, message: 'Tokens Obtained' });
          }
        }
      }
      return res.sendStatus(401)
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Internal Server Error', name: err.name });
    }
  });
};

export default refreshTokenController;
