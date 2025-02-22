import { Router } from "express";
import { addCategory, updateCategory } from "./category.controller.js";
import { createCategoryValidator, updateCategoryValidator } from "../middlewares/category-validators.js";

const router = Router();

/**
 * @swagger
 * /category/addCategory:
 *   post:
 *     summary: Agregar una nueva categoría
 *     tags: [Category]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría
 *               description:
 *                 type: string
 *                 description: Descripción de la categoría
 *             required:
 *               - name
 *     responses:
 *       200:
 *         description: Categoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 category:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Tecnología
 *                     description:
 *                       type: string
 *                       example: Categoría relacionada con tecnología
 *       500:
 *         description: Error al crear la categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Error al crear la categoria
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.post("/addCategory", createCategoryValidator, addCategory);

/**
 * @swagger
 * /category/editCategory/{idCategory}:
 *   put:
 *     summary: Actualizar una categoría existente
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: idCategory
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la categoría a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre de la categoría
 *               description:
 *                 type: string
 *                 description: Descripción de la categoría
 *     responses:
 *       200:
 *         description: Categoría actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: Categoria actualizada
 *                 category:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Tecnología
 *                     description:
 *                       type: string
 *                       example: Categoría relacionada con tecnología
 *       500:
 *         description: Error al actualizar la categoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 msg:
 *                   type: string
 *                   example: Error al actualizar la categoria
 *                 error:
 *                   type: string
 *                   example: Error message
 */
router.put("/editCategory/:idCategory", updateCategoryValidator, updateCategory);

export default router;