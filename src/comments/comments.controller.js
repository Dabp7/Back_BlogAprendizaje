'use strict';

import User from '../user/user.model.js';
import Post from '../post/post.model.js';
import Comments from "./comments.model.js"


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






