import { body, param } from "express-validator";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { postExists } from "../helpers/db-validators.js";


export const createPostValidator = [
    body("title").notEmpty().withMessage("El titulo es requerido"),
    body("text").notEmpty().withMessage("El texto es requerido"),
    body("text").isLength({min: 1}).withMessage("El texto debe contener al menos 1 caracter"),
    body("category").notEmpty().withMessage("La categoria es requerida"),
    validarCampos,
    handleErrors
];

export const updatePostValidator = [
    param("idPost", "No es un ID válido").isMongoId(),
    param("idPost").custom(postExists),
    validarCampos,
    handleErrors
];

export const deletePostValidator = [
    param("idPost", "No es un ID válido").isMongoId(),
    param("idPost").custom(postExists),
    validarCampos,
    handleErrors
];