import 'dotenv/config';
import mongoose from 'mongoose';
import {dbConnection} from '../configs/mongo.js';
import {seedDemo} from './seed-data.js';
if(!process.env.URI_MONGO||!new URL(process.env.URI_MONGO).pathname.endsWith('/blog_demo'))throw new Error('El seed solo admite una base llamada blog_demo');
await dbConnection();
try{await Promise.all(Object.values(mongoose.models).map(model=>model.init()));console.log(JSON.stringify({message:'Synthetic blog demo ready',...await seedDemo()}));}
finally{await mongoose.disconnect();}
