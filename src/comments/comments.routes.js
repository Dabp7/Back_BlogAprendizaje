import { Router } from "express";
import { addComment , updateComment, deleteComment} from "./comments.controller.js";
import { createCommentValidator, updateCommentValidator, deleteCommentValidator } from "../middlewares/comments-validators.js";

const router = Router();

router.post("/addComment", createCommentValidator, addComment);

router.patch("/editComment/:idComment", updateCommentValidator, updateComment)

router.delete("/deleteComment/:idComment", deleteCommentValidator, deleteComment)

export default router;