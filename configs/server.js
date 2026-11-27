import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {dbConnection} from './mongo.js';
import postRoutes from '../src/post/post.routes.js';
import commentRoutes from '../src/comments/comments.routes.js';
import {swaggerDocs,swaggerUi} from './swagger.js';
export function createApp({rateLimitEnabled=true}={}) {
    const app=express();
    app.use(express.json({limit:'32kb'}),cors(),helmet());
    app.get('/health',(_req,res)=>res.json({status:'ok',mode:'local-demo'}));
    if(rateLimitEnabled)app.use('/kinaloop/v1/comment/addComment',rateLimit({windowMs:60000,limit:30,standardHeaders:'draft-7',legacyHeaders:false,message:{success:false,message:'Demasiados comentarios. Intentá de nuevo en un minuto.'}}));
    app.use('/kinaloop/v1/post',postRoutes);
    app.use('/kinaloop/v1/comment',commentRoutes);
    app.get('/openapi.json',(_req,res)=>res.json(swaggerDocs));
    app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));
    app.use((_req,res)=>res.status(404).json({success:false,message:'Ruta no encontrada'}));
    app.use((error,_req,res,_next)=>{
        const status=error.type==='entity.too.large'?413:error.status===400?400:500;
        res.status(status).json({success:false,message:status===413?'Cuerpo demasiado grande':status===400?'JSON inválido':'Error interno del servidor'});
    });
    return app;
}
export async function initServer() {
    await dbConnection();
    await Promise.all(Object.values(mongoose.models).map(model=>model.init()));
    const port=Number(process.env.PORT||3000);
    return createApp().listen(port,'127.0.0.1',()=>console.log('Blog demo http://127.0.0.1:'+port));
}
