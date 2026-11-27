import {Schema,model} from 'mongoose';
const commentsSchema=new Schema({
    text:{type:String,required:true,trim:true,minLength:3,maxLength:1000},
    author:{type:String,required:true,trim:true,minLength:2,maxLength:80},
    post:{type:Schema.Types.ObjectId,ref:'Post',required:true},
},{versionKey:false,timestamps:true});
commentsSchema.index({post:1,createdAt:-1,_id:-1});
export default model('Comments',commentsSchema);
