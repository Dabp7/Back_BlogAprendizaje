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
    date: {
        type: String,
        required: [true, "date is required"],
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    author: {
        type: String,
        required: [true, "author is required"]
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comments'
    }],
    urlImage: {
        type: String
    },
    status:{
        type: Boolean,
        default: true
    }
},
{
    versionKey: false,
    timestamps: true
})


export default model("Post", postSchema)