import {body, param} from 'express-validator';
import {validarCampos} from './validate-fields.js';
export const createCommentValidator = [
    body('author').isString().bail().trim().isLength({min:2,max:80}).withMessage('El autor debe tener entre 2 y 80 caracteres'),
    body('text').isString().bail().trim().isLength({min:3,max:1000}).withMessage('El comentario debe tener entre 3 y 1000 caracteres'),
    body('post').isString().bail().isMongoId().withMessage('La publicación debe ser un ID válido'),
    validarCampos,
];
export const commentPostValidator = [param('idPost').isMongoId().withMessage('La publicación debe ser un ID válido'), validarCampos];
