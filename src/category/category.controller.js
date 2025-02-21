import Category from "./category.model.js";

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
