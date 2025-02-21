'use strict';

import User from '../user/user.model.js';
import Post from './post.model.js';


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

        const { postId } = data; 

 
        const post = await Post.findById(postId);

        if(!post){
            return res.status(404).json({
                success: false,
                message: 'Post no encontrado'
            });
        }

        const comment = new Comment({
            ...data,
            author: user._id,
            post: postId 
        });

        const savedComment = await comment.save();

        post.comments.push(savedComment._id);
        await post.save();

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




