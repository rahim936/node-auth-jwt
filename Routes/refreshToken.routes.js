import { Router } from "express";

import refreshTokneController from '../Controllers/refreshToken.controller.js'

const router = Router()

router.get('/', refreshTokneController)

export default router;