'use strict';

import Post from '../post/post.model.js';
import Comments from "./comments.model.js"


export const addComment = async(req, res) =>{
    try {
        const data = req.body; 

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

export const getCommentsByPost = async (req, res) => {
    try {
        const { idPost } = req.params;
        
        const comments = await Comments.find({ post: idPost })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            comments
        });

    } catch(err) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los comentarios',
            error: err.message
        });
    }
}







