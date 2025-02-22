'use strict';

import Post from './post.model.js';

/**
 * @swagger
 * /posts:
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
export const addPost = async (req, res) => {
    try {
        const data = req.body;
        const user = req.usuario

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'Usuario no encontrado' 
            });
        }

        const post = new Post({
            ...data,
            author: user._id,
            comments: []
        });

        await post.save();

        res.status(200).json({
            success: true,
            post
        });

    }catch(err){
        res.status(500).json({
            success: false,
            message: 'Error al crear la publicación',
            error: err.message
        });
    }
}

/**
 * @swagger
 * /posts/{idPost}:
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
export const updatePost = async (req, res) => {
    try{
        const { idPost } = req.params;
        const data = req.body;
        const userToken = req.usuario._id;
        const findPost = await Post.findById(idPost)
        

        if(userToken.toString() !== (findPost.author).toString()){
            return res.status(403).json({
                success: false,
                msg: 'No tienes permiso para editar esta publicación'
            });
        }

        const post = await Post.findByIdAndUpdate(idPost, data, { new: true });

        if(!post){
            return res.status(404).json({
                success: false,
                msg: 'Publicación no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            msg: 'Publicación actualizada',
            post
        });


    } catch(err){
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar la publicación',
            error: err.message
        });
    }
};

/**
 * @swagger
 * /posts/{idPost}:
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
export const deletePost = async(req, res) =>{
    try{
        const { idPost } = req.params;
        const userToken = req.usuario._id;
        const findPost = await Post.findById(idPost)
        

        if(userToken.toString() !== (findPost.author).toString()){
            return res.status(403).json({
                success: false,
                msg: 'No tienes permiso para eliminar esta publicación'
            });
        }

        await Post.findByIdAndDelete(idPost);

        res.status(200).json({ 
            success: true,
            message: 'Publicación eliminada exitosamente' 
        });

    }catch(err){
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la publicación',
            error: err.message
        });
    }
}


