import mongoose from 'mongoose';
import Category from '../src/category/category.model.js';
import Post from '../src/post/post.model.js';
import Comments from '../src/comments/comments.model.js';
export async function seedDemo(){
    const categories=[{_id:'660000000000000000000001',name:'Tecnología',description:'Aprendizaje con ejemplos sintéticos'},{_id:'660000000000000000000002',name:'Proyectos',description:'Prácticas de desarrollo'}];
    for(const category of categories)await Category.updateOne({_id:category._id},{$setOnInsert:category},{upsert:true});
    const posts=[
        {_id:'670000000000000000000001',title:'Un contrato claro para los comentarios',text:'Esta publicación usa datos ficticios. Probá agregar un comentario válido y revisar los mensajes de validación.',author:'Equipo Demo',date:'2026-01-15',category:categories[0]._id,urlImage:''},
        {_id:'670000000000000000000002',title:'Leer, comprobar y volver a intentar',text:'Una interfaz debe mostrar carga, vacío y error. Esta demo permite recorrer el blog desde una instalación limpia.',author:'Equipo Demo',date:'2026-01-16',category:categories[1]._id,urlImage:''},
        {_id:'670000000000000000000003',title:'Datos propios para una demo reproducible',text:'El seed se puede repetir sin borrar publicaciones ni comentarios existentes. Las identidades de este ejemplo son sintéticas.',author:'Equipo Demo',date:'2026-01-17',category:categories[1]._id,urlImage:''},
    ];
    for(const post of posts)await Post.updateOne({_id:post._id},{$setOnInsert:{...post,comments:[],status:true}},{upsert:true});
    await mongoose.connection.transaction(async session=>{
        const post=await Post.findOneAndUpdate({_id:posts[0]._id,status:true},{$inc:{commentVersion:1}},{session,new:true});
        if(!post)return;
        const commentId='680000000000000000000001';
        await Comments.updateOne({_id:commentId},{$setOnInsert:{_id:commentId,author:'Lector Demo',text:'Este comentario también es ficticio.',post:post._id}},{upsert:true,session});
        await Post.updateOne({_id:post._id},{$addToSet:{comments:commentId}},{session});
    });
    return {categories:categories.length,posts:posts.map(post=>post._id)};
}
