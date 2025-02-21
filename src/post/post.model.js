import { Schema, model} from "mongoose";

const postSchema = Schema({
    title:{
        type: String,
        required: [true, "title is required"],
        maxLength: [60, "El titulo no puede tener más de 60 caracteres"]
    },
    text:{
        type: String,
        required: [true, "text is required"],
        maxLength: [255, "Máximo de caracteres permitidos 255"]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }],
    status:{
        type: Boolean,
        default: true
    }
},
{
    versionKey: false,
    timeStamps: true
})


export default model("Post", postSchema)