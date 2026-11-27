import {MongoMemoryReplSet} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {seedDemo} from './seed-data.js';
import {initServer} from '../configs/server.js';
const replica=await MongoMemoryReplSet.create({binary:{version:'8.0.16'},instanceOpts:[{launchTimeout:60000,args:['--wiredTigerCacheSizeGB','0.25']}],replSet:{count:1,storageEngine:'wiredTiger'}});
process.env.URI_MONGO=replica.getUri('blog_demo');
process.env.PORT=process.env.PORT||'3000';
process.env.BLOG_ADMIN_KEY=process.env.BLOG_ADMIN_KEY||'synthetic-demo-admin-key-change-before-sharing';
const server=await initServer();
await seedDemo();
console.log('Temporary synthetic blog demo ready; data is discarded on stop');
let closing=false;
async function close(){if(closing)return;closing=true;await new Promise(resolve=>server.close(resolve));await mongoose.disconnect();await replica.stop();}
process.on('SIGINT',()=>{void close();});
process.on('SIGTERM',()=>{void close();});
