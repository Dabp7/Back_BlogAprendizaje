import { body, param } from "express-validator";
import { validarCampos } from "./validate-fields.js";
import { categoryExists } from "../helpers/db-validators.js";
import { handleErrors } from "./handle-errors.js";


export const updateCategoryValidator = [
    param("idCategory", "No es un ID válido").isMongoId(),
    param("idCategory").custom(categoryExists),
    validarCampos,
    handleErrors
];
