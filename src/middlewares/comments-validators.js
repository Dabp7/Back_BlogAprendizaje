import { body, param } from "express-validator";
import { validarCampos } from "./validate-fields.js";
import { commentExists } from "../helpers/db-validators.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";

export const createCommentValidator = [
    validateJWT,
    body("text").notEmpty().withMessage("El texto es requerido"),
    body("post").notEmpty().withMessage("La publicación es requerida"),
    validarCampos,
    handleErrors
];

export const updateCommentValidator = [
    validateJWT,
    param("idComment", "No es un ID válido").isMongoId(),
    param("idComment").custom(commentExists),
    validarCampos,
    handleErrors
];

export const deleteCommentValidator = [
    validateJWT,
    param("idComment", "No es un ID válido").isMongoId(),
    param("idComment").custom(commentExists),
    validarCampos,
    handleErrors
];

