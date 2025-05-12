import Category from "../category/category.model.js"
import Post from "../post/post.model.js"
import Comments from "../comments/comments.model.js"


export const categoryExists = async (idCategory = " ") => {
    const existe = await Category.findById(idCategory)
    if(!existe){
        throw new Error("No existe la categoria con el ID proporcionado")
    }
}

export const postExists = async (idPost = " ") => {
    const existe = await Post.findById(idPost)
    if(!existe){
        throw new Error("No existe la publicación con el ID proporcionado")
    }
}

export const commentExists = async (idComment = " ") => {
    const existe = await Comments.findById(idComment)
    if(!existe){
        throw new Error("No existe el comentario con el ID proporcionado")
    }
}




