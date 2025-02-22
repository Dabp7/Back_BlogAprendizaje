import Category from "./category.model.js";

/**
 * @swagger
 * /category/default:
 *   get:
 *     summary: Crear categoría predeterminada
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: Categoría predeterminada creada o ya existente
 *       500:
 *         description: Error al crear la categoría predeterminada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear la categoria General
 *                 error:
 *                   type: string
 *                   example: Error message
 */
export const defaulCategoryCreated = async () =>{
    try {

        const defaultCategory = await Category.findOne({ name: "General" });

        if(!defaultCategory){
            const newCategory = new Category({
                name: "General",
                description: "Categoría predeterminada para publicaciones."
            })
    
            await newCategory.save();

        }

        
    }catch (err){
        return res.status(500).json({
            message: "Error al crear la categoria General",
            error: err.message
        });
    }
};

/**
 * @swagger
 * /category:
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
export const addCategory = async (req, res) => {
    try {
        const data = req.body;

        const category = new Category({
            ...data,
        });

        await category.save();

        res.status(200).json({
            success: true,
            category
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la categoria',
            error: err.message
        });
    }
}

/**
 * @swagger
 * /category/{idCategory}:
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
export const updateCategory = async (req, res) =>{
    try{
        const { idCategory } = req.params;
        const data = req.body;

        const updateCategory = await Category.findByIdAndUpdate(idCategory, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Categoria actualizada',
            category: updateCategory,
        });
    }catch(err){
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar la categoria',
            error: err.message
        });
    }
};
