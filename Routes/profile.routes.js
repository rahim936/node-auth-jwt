import { Router } from 'express';
import { verifyJWT } from '../Middlewares/veryfyJWT.js';
import UserModel from '../Models/UserModel.js';

const router = Router();

router.get('/', verifyJWT, async (req, res) => {
  const user = await UserModel.findById(req.user.userID, { password: 0, refreshToken: 0, jwtID: 0 });
  console.log(req.user);
  return res.status(200).json(user);
});

export default router;
