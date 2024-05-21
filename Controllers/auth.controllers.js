import crypto from 'crypto';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../Models/UserModel.js';

// REGISTER CONTROLLER
export const registerController = async (req, res) => {
  try {
    const { username, email, password, isAdmin, isActive } = req.body;

    const salt = await bcrypt.genSalt();
    const hashPwd = await bcrypt.hash(password, salt);

    const user = await UserModel.create({ username: username, email: email, password: hashPwd, isActive: isActive, isAdmin: isAdmin});

    return res.status(201).json({ success: true, message: 'Registration successful', user: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: err.name });
  }
};

// LOGIN CONTROLLER
export const loginController = async (req, res) => {
  try {
    const { username_or_email, password } = req.body;

    const user = await UserModel.findOne({ $or: [{ username: username_or_email }, { email: username_or_email }] });
    if (!user) return res.status(404).json({ success: false, message: 'Invalid username/email or password' });

    const matchPwd = await bcrypt.compare(password, user.password);
    if (!matchPwd) return res.status(404).json({ success: false, message: 'Invalid username/email or password' });

    const jwtID = crypto.randomUUID();

    const accessToken = jwt.sign({ userID: user._id, username: user.username, }, process.env.ACCESS_TOKEN_SECRET, {
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
      subject: jwtID
    });

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    user.jwtID = jwtID;

    await user.save();

    return res
      .status(200)
      .cookie('Access-Token', accessToken, { httpOnly: true, secure: true, signed: true, maxAge: 1 * 60 * 60 * 1000 })
      .cookie('Refresh-Token', refreshToken, { httpOnly: true, secure: true, signed: true, maxAge: 2 * 60 * 60 * 1000 })
      .json({ success: true, message: 'Login Successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: err.name });
  }
};

// LOGOUT CONTROLLER
export const logoutController = async (req, res) => {
  try {
    const refreshToken = req.signedCookies['Refresh-Token'];
    if (!refreshToken) return res.status(401).json({ success: false, message: 'FORBIDDEN' });

    const user = await UserModel.findOne({ refreshToken: refreshToken });
    if (!user)
      return res
        .status(204)
        .clearCookie('Access-Token', { httpOnly: true, secure: true, signed: true, maxAge: 0 })
        .clearCookie('Refresh-Token', { httpOnly: true, secure: true, signed: true, maxAge: 0 });

    user.accessToken = '';
    user.refreshToken = '';
    user.jwtID = '';

    await user.save();

    return res
      .status(200)
      .clearCookie('Access-Token', { httpOnly: true, secure: true, signed: true, maxAge: 0 })
      .clearCookie('Refresh-Token', { httpOnly: true, secure: true, signed: true, maxAge: 0 })
      .json({ success: true, message: 'Logout Successful' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: err.name });
  }
};
