import {before,after,beforeEach,test} from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';
import {MongoMemoryReplSet} from 'mongodb-memory-server';
import {createApp} from '../configs/server.js';
import Category from '../src/category/category.model.js';
import Post from '../src/post/post.model.js';
import Comments from '../src/comments/comments.model.js';
import {seedDemo} from '../scripts/seed-data.js';
let replica,app,post,category;
process.env.BLOG_ADMIN_KEY='synthetic-test-admin-key-at-least-32-characters';
const admin={'X-Admin-Key':process.env.BLOG_ADMIN_KEY};
before(async()=>{
    replica=await MongoMemoryReplSet.create({binary:{version:'8.0.16'},instanceOpts:[{launchTimeout:60000,args:['--wiredTigerCacheSizeGB','0.25']}],replSet:{count:1,storageEngine:'wiredTiger'}});
    await mongoose.connect(replica.getUri('blog_demo'));
    await Promise.all(Object.values(mongoose.models).map(model=>model.init()));
    app=createApp({rateLimitEnabled:false});
});
after(async()=>{await mongoose.disconnect();if(replica)await replica.stop();});
beforeEach(async()=>{
    await Promise.all([Comments.deleteMany({}),Post.deleteMany({}),Category.deleteMany({})]);
    category=await Category.create({name:'Demo',description:'Synthetic'});
    post=await Post.create({title:'Publicación demo',text:'Contenido de ejemplo sintético',author:'Equipo Demo',date:'2026-01-15',category:category.id});
});
const add=(body={})=>request(app).post('/kinaloop/v1/comment/addComment').send({author:'Lector Demo',text:'Un comentario válido',post:post.id,...body});
test('frontend contract creates a trimmed comment and links it atomically',async()=>{
    const result=await add({author:'  Demo  ',text:'  Texto válido  ',createdAt:'2000-01-01',status:false});
    assert.equal(result.status,201);
    assert.equal(result.body.comment.author,'Demo');assert.equal(result.body.comment.text,'Texto válido');
    assert.equal(result.body.comment.status,undefined);
    assert.notEqual(result.body.comment.createdAt.slice(0,4),'2000');
    const linked=await Post.findById(post.id);
    assert.deepEqual(linked.comments.map(String),[result.body.comment._id]);
    const list=await request(app).get('/kinaloop/v1/comment/getCommentsByPost/'+post.id);
    assert.equal(list.status,200);assert.equal(list.body.comments.length,1);assert.equal(list.body.total,1);
});
test('comment boundaries are accepted and invalid values never persist',async()=>{
    for(const body of [{author:'A'},{author:'A'.repeat(81)},{author:3},{author:'  '},{text:'ab'},{text:'A'.repeat(1001)},{text:{}},{text:'   '},{post:'bad-id'}]){
        const response=await add(body);assert.equal(response.status,400,JSON.stringify(body));assert.equal(typeof response.body.message,'string');
    }
    assert.equal(await Comments.countDocuments(),0);
    assert.equal((await add({author:'AB',text:'ABC'})).status,201);
    assert.equal((await add({author:'A'.repeat(80),text:'B'.repeat(1000)})).status,201);
});
test('nonexistent, invalid and inactive posts have consistent read/write errors',async()=>{
    const absent=new mongoose.Types.ObjectId().toString();
    assert.equal((await add({post:absent})).status,404);
    assert.equal((await request(app).get('/kinaloop/v1/comment/getCommentsByPost/'+absent)).status,404);
    assert.equal((await request(app).get('/kinaloop/v1/comment/getCommentsByPost/bad')).status,400);
    post.status=false;await post.save();
    assert.equal((await add()).status,404);
    assert.equal((await request(app).get('/kinaloop/v1/comment/getCommentsByPost/'+post.id)).status,404);
    assert.equal(await Comments.countDocuments(),0);
});
test('empty list and stable pagination preserve the response shape',async()=>{
    const empty=await request(app).get('/kinaloop/v1/comment/getCommentsByPost/'+post.id);
    assert.deepEqual(empty.body.comments,[]);
    const at=new Date('2026-01-01T00:00:00Z');
    const comments=await Comments.create([1,2,3].map(i=>({_id:new mongoose.Types.ObjectId('69000000000000000000000'+i),author:'Demo',text:'Comentario '+i,post:post.id,createdAt:at})));
    const response=await request(app).get('/kinaloop/v1/comment/getCommentsByPost/'+post.id).query({limit:'1',offset:'1'});
    assert.equal(response.status,200);assert.equal(response.body.total,3);assert.equal(response.body.comments[0]._id,comments[1].id);
    for(const query of [{limit:'0'},{limit:'101'},{offset:'-1'},{limit:{$gt:'0'}}]){
        assert.equal((await request(app).get('/kinaloop/v1/comment/getCommentsByPost/'+post.id).query(query)).status,400);
    }
});
test('ten concurrent comments keep every association exactly once',async()=>{
    const responses=await Promise.all(Array.from({length:10},(_,i)=>add({text:'Comentario concurrente '+i})));
    assert(responses.every(response=>response.status===201));
    const saved=await Post.findById(post.id);
    assert.equal(saved.comments.length,10);assert.equal(new Set(saved.comments.map(String)).size,10);
    assert.equal(await Comments.countDocuments({post:post.id}),10);
});
test('deleting a post while comments arrive never leaves orphan comments',async()=>{
    const responses=await Promise.all([
        ...Array.from({length:5},(_,i)=>add({text:'Comentario en carrera '+i})),
        request(app).delete('/kinaloop/v1/post/deletePost/'+post.id).set(admin),
    ]);
    assert.equal(responses.at(-1).status,200);
    assert(responses.slice(0,-1).every(response=>[201,404].includes(response.status)));
    const saved=await Post.findById(post.id);assert.equal(saved.status,false);assert.equal(saved.comments.length,0);
    assert.equal(await Comments.countDocuments({post:post.id}),0);
});
test('post administration requires a server key and ignores protected fields',async()=>{
    const url='/kinaloop/v1/post/editPost/'+post.id;
    assert.equal((await request(app).put(url).send({title:'Changed'})).status,401);
    assert.equal((await request(app).delete('/kinaloop/v1/post/deletePost/'+post.id).set({'X-Admin-Key':'wrong'})).status,401);
    const update=await request(app).put(url).set(admin).send({title:'Título editado',comments:[new mongoose.Types.ObjectId()],status:false});
    assert.equal(update.status,200);assert.equal(update.body.post.status,true);assert.equal(update.body.post.comments.length,0);
    const invalid=await request(app).put(url).set(admin).send({text:'X'.repeat(256)});
    assert.equal(invalid.status,400);
    assert.equal((await request(app).get('/kinaloop/v1/post/')).body.posts[0].category.name,'Demo');
});
test('seed can be repeated and does not erase reader comments',async()=>{
    await seedDemo();await seedDemo();
    assert.equal(await Category.countDocuments(),3);
    assert.equal(await Post.countDocuments(),4);
    const id='670000000000000000000001';
    await add({post:id,text:'Comentario después del seed'});
    await seedDemo();
    assert.equal(await Comments.countDocuments({post:id}),2);
    assert.equal((await Post.findById(id)).comments.length,2);
});
test('malformed JSON, oversized body and unknown routes have safe JSON errors',async()=>{
    const malformed=await request(app).post('/kinaloop/v1/comment/addComment').type('json').send('{');
    assert.equal(malformed.status,400);assert.equal(typeof malformed.body.message,'string');
    const oversized=await add({text:'X'.repeat(40000)});
    assert.equal(oversized.status,413);
    assert.equal((await request(app).get('/missing')).status,404);
    assert.equal((await request(app).get('/openapi.json')).body.paths['/comment/addComment'].post.requestBody.required,true);
});
test('the public comment rate limit returns a retryable JSON response',async()=>{
    const limited=createApp();
    let last;
    for(let i=0;i<31;i++)last=await request(limited).post('/kinaloop/v1/comment/addComment').send({author:'x'});
    assert.equal(last.status,429);
    assert.equal(typeof last.body.message,'string');
    assert(last.headers['ratelimit-policy']);
});
