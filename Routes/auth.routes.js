import { Router } from "express";

import { validateLogin, validateRegister } from "../Middlewares/auth.middlewares.js";
import { registerController, loginController, logoutController } from '../Controllers/auth.controllers.js'

const router = Router()

router.post('/register', validateRegister, registerController)
router.post('/login', validateLogin, loginController)
router.post('/logout', logoutController)

export default router;