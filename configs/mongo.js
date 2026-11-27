import mongoose from 'mongoose';
export function dbConnection() {
    if(!process.env.URI_MONGO)throw new Error('URI_MONGO es requerido');
    return mongoose.connect(process.env.URI_MONGO,{serverSelectionTimeoutMS:5000,maxPoolSize:20});
}
