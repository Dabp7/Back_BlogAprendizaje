import 'dotenv/config';
import mongoose from 'mongoose';
import {initServer} from './configs/server.js';
initServer().catch(async()=>{await mongoose.disconnect();console.error('No se pudo iniciar: revisar configuración y replica set de demo');process.exitCode=1;});
