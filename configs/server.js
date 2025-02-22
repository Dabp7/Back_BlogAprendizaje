"use strict"

import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { dbConnection } from "./mongo.js"
import authRoutes from "../src/auth/auth.routes.js"
import userRoutes from "../src/user/user.routes.js"
import categoryRoutes from "../src/category/category.routes.js"
import postRoutes from "../src/post/post.routes.js"
import commentRoutes from "../src/comments/comments.routes.js"
import { adminDefaultCreated } from "../src/user/user.controller.js"
import { defaulCategoryCreated } from "../src/category/category.controller.js"
import { swaggerDocs, swaggerUi } from "./swagger.js";


const middlewares = (app) => {
    app.use(express.json())
    app.use(cors())
    app.use(helmet())
    app.use(morgan("dev"))
}


const routes = (app) =>{
    app.use("/kinaloop/v1/auth", authRoutes);
    app.use("/kinaloop/v1/user", userRoutes);
    app.use("/kinaloop/v1/category", categoryRoutes);
    app.use("/kinaloop/v1/post", postRoutes)
    app.use("/kinaloop/v1/comment", commentRoutes)
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))
}


const conectarDB = async () =>{
    try{
        await dbConnection()
    }catch(err){
        console.log(`Database connection failed: ${err}`)
        process.exit(1)
    }
}


export const initServer = () => {
    const app = express()
    try{
        middlewares(app)
        conectarDB()
        routes(app)
        adminDefaultCreated()
        defaulCategoryCreated()
        app.listen(process.env.PORT)
        console.log(`Server running on port ${process.env.PORT}`)
    }catch(err){
        console.log(`Server init failed: ${err}`)
    }
}

