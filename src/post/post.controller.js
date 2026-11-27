import mongoose from 'mongoose';
import Post from './post.model.js';
import Category from '../category/category.model.js';
import Comments from '../comments/comments.model.js';
import {fail,errorResponse,pagination} from '../helpers/http.js';
function postFields(body) {
    return Object.fromEntries(['title','text','author','date','category','urlImage'].filter(key=>body[key]!==undefined).map(key=>[key,body[key]]));
}
export const addPost=async(req,res)=>{
    try {
        const data=postFields(req.body);
        if(!await Category.exists({_id:data.category}))fail(404,'Categoría no encontrada');
        const post=await Post.create({...data,comments:[],status:true});
        return res.status(201).json({success:true,post});
    }catch(error){return errorResponse(res,error);}
};
export const getPosts=async(req,res)=>{
    try{
        const {limit,offset}=pagination(req.query);
        const query={status:true};
        if(req.query.category!==undefined){if(typeof req.query.category!=='string'||!mongoose.isValidObjectId(req.query.category))fail(400,'Categoría inválida');query.category=req.query.category;}
        const [total,posts]=await Promise.all([Post.countDocuments(query),Post.find(query).populate('category','name description').select('-commentVersion').sort({createdAt:-1,_id:-1}).skip(offset).limit(limit)]);
        return res.json({success:true,total,posts,limit,offset});
    }catch(error){return errorResponse(res,error);}
};
export const updatePost=async(req,res)=>{
    try{
        const data=postFields(req.body);
        if(!Object.keys(data).length)fail(400,'No hay campos editables');
        if(data.category&&!await Category.exists({_id:data.category}))fail(404,'Categoría no encontrada');
        const post=await Post.findOneAndUpdate({_id:req.params.idPost,status:true},{$set:data},{new:true,runValidators:true});
        if(!post)fail(404,'Publicación no encontrada');
        return res.json({success:true,message:'Publicación actualizada',post});
    }catch(error){return errorResponse(res,error);}
};
export const deletePost=async(req,res)=>{
    try{
        let post;
        await mongoose.connection.transaction(async session=>{
            post=await Post.findOneAndUpdate({_id:req.params.idPost,status:true},{$set:{status:false,comments:[]},$inc:{commentVersion:1}},{new:true,session});
            if(!post)fail(404,'Publicación no encontrada');
            await Comments.deleteMany({post:post._id},{session});
        });
        return res.json({success:true,message:'Publicación desactivada y comentarios retirados',post});
    }catch(error){return errorResponse(res,error);}
};
