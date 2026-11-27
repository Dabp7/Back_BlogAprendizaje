import {body,param} from 'express-validator';
import {validarCampos} from './validate-fields.js';
const fieldRules = (optional=false) => [
    (optional?body('title').optional():body('title')).isString().bail().trim().isLength({min:3,max:60}),
    (optional?body('text').optional():body('text')).isString().bail().trim().isLength({min:3,max:255}),
    (optional?body('author').optional():body('author')).isString().bail().trim().isLength({min:2,max:80}),
    (optional?body('date').optional():body('date')).isString().bail().isISO8601({strict:true}),
    (optional?body('category').optional():body('category')).isString().bail().isMongoId(),
    body('urlImage').optional().isString().bail().custom(value => value === '' || /^https:\/\//.test(value)).withMessage('La imagen debe usar HTTPS'),
];
export const createPostValidator=[...fieldRules(),validarCampos];
export const updatePostValidator=[param('idPost').isMongoId(),...fieldRules(true),validarCampos];
export const deletePostValidator=[param('idPost').isMongoId(),validarCampos];
