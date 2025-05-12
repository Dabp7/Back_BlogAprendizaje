import Category from "./category.model.js";


export const defaultCategorysCreated = async () => {
    try {
        const defaultCategory = [
            {
                name: "Taller III",
                description: "Pretende implementar proyectos y actividades que enfoquen al alumno a un ambito práctico y profesional."
            },
            {
                name: "Tecnología III",
                description: "Pretende llevarlo por la teoría de cada tema a aplicar durante la clase de taller, siendo la teoría lo primero a entender."
            },
            {
                name: "Práctica Supervisada",
                description: "Pretende conjuntar las areas de Taller III y Tecnología III, dandole un enfoque más externo y cercano a la realidad."
            }
        ];

        for (const category of defaultCategory) {
            const exists = await Category.findOne({ name: category.name });
            if(!exists){
                const newCategory = new Category(category);
                await newCategory.save();
                console.log(`Categoría creada: ${category.name}`);
            }
        }

    }catch(err){
        console.log("Error al crear categorías por defecto:", err.message);
    }
};


