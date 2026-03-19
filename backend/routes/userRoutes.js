import { Router } from "express";
import { validate } from "../middlewares/validatorMiddleware.js";
import { validateUserRegistration, validateUserLogin, validateUserUpdate, validateUpdatePassword } from "../validators/uservalidator.js";
import { authMiddleware } from "../middlewares/auth.js";
import { registerUser, loginUser, getUser, updateUser, updatePassword } from "../controllers/userController.js";
const userRouter=Router();

userRouter.post('/register',validateUserRegistration,validate,registerUser);
userRouter.post('/login',validateUserLogin,validate,loginUser);
userRouter.get('/profile',authMiddleware,getUser);
userRouter.put('/profileupdate',authMiddleware,validateUserUpdate,validate,updateUser);
userRouter.put('/password',authMiddleware,validateUpdatePassword,validate,updatePassword);

export default userRouter;