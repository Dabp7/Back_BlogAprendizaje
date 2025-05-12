
import Post from './post.model.js';
import Category from '../category/category.model.js';


export const addPost = async (req, res) => {
    try {
        const data = req.body;


        const post = new Post({
            ...data,
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
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({ status: true }).populate('category', 'name description').sort({ createdAt: -1 });;

        res.status(200).json({
            success: true,
            posts
        });

    } catch(err){
        res.status(500).json({
            success: false,
            message: 'Error al obtener las publicaciones',
            error: err.message
        });
    }
}


export const updatePost = async (req, res) => {
    try{
        const { idPost } = req.params;
        const data = req.body;
        
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

export const deletePost = async(req, res) =>{
    try{
        const { idPost } = req.params;

        const post = await Post.findByIdAndUpdate(idPost, {status: false}, { new: true });

        res.status(200).json({ 
            success: true,
            message: 'Publicación eliminada exitosamente',
            post
        });

    }catch(err){
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la publicación',
            error: err.message
        });
    }
}


