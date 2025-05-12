import { Router } from "express";
import { addComment, getCommentsByPost  } from "./comments.controller.js";
import { createCommentValidator} from "../middlewares/comments-validators.js";

const router = Router();

/**
 * @swagger
 * /comments/addComment:
 *   post:
 *     summary: Agregar un nuevo comentario
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               post:
 *                 type: string
 *                 description: ID del post al que se agrega el comentario
 *               content:
 *                 type: string
 *                 description: Contenido del comentario
 *             required:
 *               - post
 *               - content
 *     responses:
 *       200:
 *         description: Comentario agregado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 comment:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
 *                     content:
 *                       type: string
 *                       example: Este es un comentario
 *                     author:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109cb
 *                     post:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109cc
 *                 message:
 *                   type: string
 *                   example: Comentario agregado con éxito
 *       404:
 *         description: Usuario o post no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Usuario no encontrado
 *       500:
 *         description: Error al agregar el comentario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error al agregar el comentario
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.post("/addComment", createCommentValidator, addComment);

router.get("/getCommentsByPost/:idPost", getCommentsByPost);

export default router;