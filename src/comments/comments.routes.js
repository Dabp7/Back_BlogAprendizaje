import {Router} from 'express';
import {addComment,getCommentsByPost} from './comments.controller.js';
import {createCommentValidator,commentPostValidator} from '../middlewares/comments-validators.js';
const router=Router();
router.post('/addComment',createCommentValidator,addComment);
router.get('/getCommentsByPost/:idPost',commentPostValidator,getCommentsByPost);
export default router;
