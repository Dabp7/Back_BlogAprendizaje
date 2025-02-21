import { Router } from "express";
import { addCategory, updateCategory } from "./category.controller.js";
import { createCategoryValidator, updateCategoryValidator } from "../middlewares/category-validators.js";

const router = Router();

router.post("/addCategory", createCategoryValidator, addCategory);

router.put("/editCategory/:idCategory", updateCategoryValidator, updateCategory);


export default router;