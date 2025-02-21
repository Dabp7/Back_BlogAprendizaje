import { Router } from "express";
import { updateUser, updatePassword } from "./user.controller.js";
import { updateUserValidator,  updatePasswordValidator } from "../middlewares/user-validators.js";

const router = Router();


router.put("/updateUser/:uid", updateUserValidator, updateUser);

router.patch("/updatePassword/:uid", updatePasswordValidator, updatePassword);


export default router;
