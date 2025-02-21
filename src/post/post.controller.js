'use strict';

import User from '../user/user.model.js';
import Post from './post.model.js';


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
                msg: 'Pulbicación no encontrada'
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
            msg: 'Error al actualizar usuario',
            error: err.message
        });
    }
};


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


