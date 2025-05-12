import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


const options ={
    swaggerDefinition:{
        openapi:"3.0.0",
        info:{
            title: "Gestion Opiniones API",
            version: "1.0.0",
            description: "API para una red social de opiniones",
            contact:{
                name: "Diego Bercian",
                email: "dbercian-2020527@kinal.edugt"
            }
        },
        servers:[
            {
                url: "http://127.0.0.1:3000/kinaloop/v1"
            }
        ]
    },
    apis:[
        "./src/category/*",
        "./src/post/*",
        "./src/comments/*"
    ]
}

const swaggerDocs = swaggerJSDoc(options)

export { swaggerDocs, swaggerUi}