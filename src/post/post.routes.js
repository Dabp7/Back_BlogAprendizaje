import { Router } from "express";
import { addPost, updatePost, deletePost } from "./post.controller.js";
import { createPostValidator, updatePostValidator, deletePostValidator } from "../middlewares/post-validators.js";

const router = Router();

/**
 * @swagger
 * /posts/addPost:
 *   post:
 *     summary: Crear una nueva publicación
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título de la publicación
 *               content:
 *                 type: string
 *                 description: Contenido de la publicación
 *             required:
 *               - title
 *               - content
 *     responses:
 *       200:
 *         description: Publicación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 post:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109ca
 *                     title:
 *                       type: string
 *                       example: Mi primera publicación
 *                     content:
 *                       type: string
 *                       example: Este es el contenido de mi primera publicación
 *                     author:
 *                       type: string
 *                       example: 60d0fe4f5311236168a109cb
 *                     comments:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: 60d0fe4f5311236168a109cc
 *       404:
 *         description: Usuario no encontrado
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
 *         description: Error al crear la publicación
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
 *                   example: Error al crear la publicación
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.post("/addPost", createPostValidator, addPost);

/**
 * @swagger
 * /posts/editPost/{idPost}:
 *   put:
 *     summary: Actualizar una publicación existente
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: idPost
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicación a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título de la publicación
 *               content:
 *                 type: string
 *                 description: Contenido de la publicación
 *     responses:
 *       200:
 *         description: Publicación actualizada exitosamente
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
 *                   example: Publicación actualizada
 *                 post:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: Mi primera publicación actualizada
 *                     content:
 *                       type: string
 *                       example: Este es el contenido de mi primera publicación actualizada
 *       403:
 *         description: No tienes permiso para editar esta publicación
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
 *                   example: No tienes permiso para editar esta publicación
 *       404:
 *         description: Publicación no encontrada
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
 *                   example: Publicación no encontrada
 *       500:
 *         description: Error al actualizar la publicación
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
 *                   example: Error al actualizar la publicación
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.put("/editPost/:idPost", updatePostValidator, updatePost)

/**
 * @swagger
 * /posts/deletePost/{idPost}:
 *   delete:
 *     summary: Eliminar una publicación existente
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: idPost
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la publicación a eliminar
 *     responses:
 *       200:
 *         description: Publicación eliminada exitosamente
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
 *                   example: Publicación eliminada exitosamente
 *       403:
 *         description: No tienes permiso para eliminar esta publicación
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
 *                   example: No tienes permiso para eliminar esta publicación
 *       404:
 *         description: Publicación no encontrada
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
 *                   example: Publicación no encontrada
 *       500:
 *         description: Error al eliminar la publicación
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
 *                   example: Error al eliminar la publicación
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.delete("/deletePost/:idPost", deletePostValidator, deletePost)

export default router;