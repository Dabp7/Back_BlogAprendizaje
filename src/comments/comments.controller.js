import mongoose from 'mongoose';
import Post from '../post/post.model.js';
import Comments from './comments.model.js';
import {fail,errorResponse,pagination} from '../helpers/http.js';
export const addComment=async(req,res)=>{
    try {
        const {author,text,post}=req.body;
        let comment;
        await mongoose.connection.transaction(async session=>{
            const existing=await Post.findOneAndUpdate({_id:post,status:true},{$inc:{commentVersion:1}},{new:true,session});
            if(!existing)fail(404,'Publicación no encontrada');
            [comment]=await Comments.create([{author,text,post:existing._id}],{session});
            await Post.updateOne({_id:existing._id},{$push:{comments:comment._id}},{session});
        });
        return res.status(201).json({success:true,comment,message:'Comentario agregado con éxito'});
    } catch(error) {return errorResponse(res,error);}
};
export const getCommentsByPost=async(req,res)=>{
    try {
        if(!await Post.exists({_id:req.params.idPost,status:true}))fail(404,'Publicación no encontrada');
        const {limit,offset}=pagination(req.query);
        const query={post:req.params.idPost};
        const [total,comments]=await Promise.all([Comments.countDocuments(query),Comments.find(query).sort({createdAt:-1,_id:-1}).skip(offset).limit(limit)]);
        return res.json({success:true,total,comments,limit,offset});
    } catch(error) {return errorResponse(res,error);}
};
