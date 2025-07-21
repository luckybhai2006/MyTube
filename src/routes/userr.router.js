import { registerUser } from '../controllers/user.controller.js';
import { Router } from 'express';

const router = Router();

// Example route: Get all users
router.route('/register').post(registerUser);



// module.exports = router;
export default router;