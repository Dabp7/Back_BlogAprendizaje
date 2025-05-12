import { Schema, model} from "mongoose";

const commentsSchema = Schema({
    text:{
        type: String,
        required: [true, "text is required"],
        maxLength: [255, "Máximo de caracteres permitidos 255"]
    },
    author: {
        type: String,
        required: [true, "author is required"]
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'post',
        required: true
    }
},
{
    versionKey: false,
    timestamps: true
})


export default model("Comments", commentsSchema)