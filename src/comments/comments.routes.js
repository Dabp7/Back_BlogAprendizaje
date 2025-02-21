import { Router } from "express";
import { addComment } from "./comments.controller.js";
import { createPostValidator, updatePostValidator, deletePostValidator } from "../middlewares/post-validators.js";

const router = Router();

router.post("/addComment", createPostValidator, addComment);



export default router;