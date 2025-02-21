import { Router } from "express";
import { addPost, updatePost, deletePost } from "./post.controller.js";
import { createPostValidator, updatePostValidator, deletePostValidator } from "../middlewares/post-validators.js";

const router = Router();

router.post("/addPost", createPostValidator, addPost);

router.put("/editPost/:idPost", updatePostValidator, updatePost)

router.delete("/deletePost/:idPost", deletePostValidator, deletePost)

export default router;