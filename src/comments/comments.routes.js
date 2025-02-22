import { Router } from "express";
import { addComment , updateComment, deleteComment} from "./comments.controller.js";
import { createCommentValidator, updateCommentValidator, deleteCommentValidator } from "../middlewares/comments-validators.js";

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

/**
 * @swagger
 * /comments/editComment/{idComment}:
 *   patch:
 *     summary: Actualizar un comentario existente
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: idComment
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del comentario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Contenido del comentario
 *     responses:
 *       200:
 *         description: Comentario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: Comentario actualizado
 *                 comment:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *                       example: Este es un comentario actualizado
 *       403:
 *         description: No tienes permiso para editar este comentario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: No tienes permiso para editar este comentario
 *       404:
 *         description: Comentario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: Comentario no encontrado
 *       500:
 *         description: Error al actualizar el comentario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: Error al actualizar el comentario
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.patch("/editComment/:idComment", updateCommentValidator, updateComment)

/**
 * @swagger
 * /comments/deleteComment/{idComment}:
 *   delete:
 *     summary: Eliminar un comentario existente
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: idComment
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del comentario a eliminar
 *     responses:
 *       200:
 *         description: Comentario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Comentario eliminado exitosamente
 *       403:
 *         description: No tienes permiso para eliminar este comentario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: No tienes permiso para eliminar este comentario
 *       404:
 *         description: Comentario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: Comentario no encontrado
 *       500:
 *         description: Error al eliminar el comentario
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
 *                   example: Error al eliminar el comentario
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.delete("/deleteComment/:idComment", deleteCommentValidator, deleteComment)

export default router;