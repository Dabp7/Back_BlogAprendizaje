'use strict';

import Post from '../post/post.model.js';
import Comments from "./comments.model.js"

/**
 * @swagger
 * /comments:
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
export const addComment = async(req, res) =>{
    try {
        const data = req.body; 
        const user = req.usuario;

        if(!user){
            return res.status(404).json({ 
                success: false, 
                message: 'Usuario no encontrado' 
            });
        }

        const { post } = data; 

 
        const findPost = await Post.findById(post);

        if(!findPost){
            return res.status(404).json({
                success: false,
                message: 'Post no encontrado'
            });
        }

        const comment = new Comments({
            ...data,
            author: user._id,
            post: findPost 
        });

            const savedComment = await comment.save();

            findPost.comments.push(savedComment._id);

            await findPost.save();

        res.status(200).json({
            success: true,
            comment: savedComment,
            message: 'Comentario agregado con éxito'
        });

    }catch(err){
        res.status(500).json({
            success: false,
            message: 'Error al agregar el comentario',
            error: err.message
        });
    }
};

/**
 * @swagger
 * /comments/{idComment}:
 *   put:
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
export const updateComment = async (req, res) => {
    try{
        const { idComment } = req.params;
        const data = req.body;
        const userToken = req.usuario._id;
        const findComment = await Comments.findById(idComment)
        

        if(userToken.toString() !== (findComment.author).toString()){
            return res.status(403).json({
                success: false,
                msg: 'No tienes permiso para editar este comentario'
            });
        }

        const comment = await Comments.findByIdAndUpdate(idComment, data, { new: true });

        if(!comment){
            return res.status(404).json({
                success: false,
                msg: 'Comentario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            msg: 'Comentario actualizado',
            comment
        });


    } catch(err){
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el comentario',
            error: err.message
        });
    }
};

/**
 * @swagger
 * /comments/{idComment}:
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
export const deleteComment = async(req, res) =>{
    try{
        const { idComment } = req.params;
        const userToken = req.usuario._id;
        const findComment = await Comments.findById(idComment)
        

        if(userToken.toString() !== (findComment.author).toString()){
            return res.status(403).json({
                success: false,
                msg: 'No tienes permiso para eliminar este comentario'
            });
        }
    
        const findPost = await Post.findById(findComment.post);

        findPost.comments.pull(idComment);

        await findPost.save();

        await Comments.findByIdAndDelete(idComment);

        res.status(200).json({ 
            success: true,
            message: 'Comentario eliminado exitosamente'            
        });

    }catch(err){
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el comentario',
            error: err.message
        });
    }
}






