import { body } from "express-validator";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";

export const createCommentValidator = [
    body("text").notEmpty().withMessage("El texto es requerido"),
    body("post").notEmpty().withMessage("La publicación es requerida"),
    validarCampos,
    handleErrors
];
