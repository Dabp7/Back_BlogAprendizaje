import { hash, verify } from "argon2";
import User from "./user.model.js";

/**
 * @swagger
 * /users/adminDefault:
 *   get:
 *     summary: Crear administrador predeterminado
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Administrador predeterminado creado o ya existente
 *       500:
 *         description: Error al crear el administrador predeterminado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al crear el administrador general
 *                 error:
 *                   type: string
 *                   example: Error message
 */
export const adminDefaultCreated = async (req, res) => {
    try{

        const defaultAdmin = await User.findOne({ email: "Dabp@gmail.com" });
        const encryptedPassword = await hash("dBerc1an!")

        if(!defaultAdmin){
            const newAdmin = new User({
                fullName: "Diego Bercian",
                username: "Dabpp",
                email: "Dabp@gmail.com",
                password: encryptedPassword,
                phone: "49099817",
                role: "ADMIN_ROLE"
            })
    
            await newAdmin.save();
        }

    }catch(err){
        return res.status(500).json({
            message: "Error al crear el administrador general",
            error: err.message
        });
    }
};

/**
 * @swagger
 * /users/{uid}:
 *   put:
 *     summary: Actualizar un usuario existente
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Nombre completo del usuario
 *               username:
 *                 type: string
 *                 description: Nombre de usuario
 *               email:
 *                 type: string
 *                 description: Correo electrónico del usuario
 *               phone:
 *                 type: string
 *                 description: Teléfono del usuario
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
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
 *                   example: Usuario Actualizado
 *                 user:
 *                   type: object
 *                   properties:
 *                     fullName:
 *                       type: string
 *                       example: John Doe
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     phone:
 *                       type: string
 *                       example: 123456789
 *       403:
 *         description: No tienes permiso para modificar este usuario
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
 *                   example: No tienes permiso para modificar este usuario
 *       404:
 *         description: Usuario no encontrado
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
 *                   example: Usuario no encontrado
 *       500:
 *         description: Error al actualizar usuario
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
 *                   example: Error al actualizar usuario
 *                 error:
 *                   type: string
 *                   example: Error message
 */
export const updateUser = async (req, res) => {
    try{
        const { uid } = req.params;
        const data = req.body;
        const userToken = req.usuario.id;

        if (userToken !== uid) {
            return res.status(403).json({
                success: false,
                msg: 'No tienes permiso para modificar este usuario'
            });
        }

        const user = await User.findByIdAndUpdate(uid, data, { new: true });

        if(!user){
            return res.status(404).json({
                success: false,
                msg: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            msg: 'Usuario Actualizado',
            user
        });


    } catch(err){
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar usuario',
            error: err.message
        });
    }
};

/**
 * @swagger
 * /users/updatePassword/{uid}:
 *   put:
 *     summary: Actualizar la contraseña de un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario cuya contraseña se va a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Contraseña actual del usuario
 *               newPassword:
 *                 type: string
 *                 description: Nueva contraseña del usuario
 *             required:
 *               - oldPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Contraseña actualizada correctamente
 *       403:
 *         description: No tienes permiso para cambiar esta contraseña
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
 *                   example: No tienes permiso para cambiar esta contraseña
 *       404:
 *         description: Usuario no encontrado
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
 *                   example: Usuario no encontrado
 *       400:
 *         description: La contraseña actual es incorrecta o la nueva contraseña es igual a la anterior
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
 *                   example: La contraseña actual es incorrecta o la nueva contraseña es igual a la anterior
 *       500:
 *         description: Error al actualizar la contraseña
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
 *                   example: Error al actualizar la contraseña
 *                 error:
 *                   type: string
 *                   example: Error message
 */
export const updatePassword = async (req, res) => {
    try {
        const { uid } = req.params; 
        const { oldPassword, newPassword } = req.body;
        const userToken = req.usuario.id;
    
        if(userToken !== uid){
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para cambiar esta contraseña"
            });
        }

        const user = await User.findById(uid);

        if(!user){
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        
        const verifyPassword = await verify(user.password, oldPassword);

        if(!verifyPassword){
            return res.status(400).json({
                success: false,
                message: "La contraseña actual es incorrecta"
            });
        }

        const matchOldAndNewPassword = await verify(user.password, newPassword);

        if(matchOldAndNewPassword){
            return res.status(400).json({
                success: false,
                message: "La nueva contraseña no puede ser igual a la anterior"
            });
        }

        const encryptedPassword = await hash(newPassword);


        await User.findByIdAndUpdate(uid, { password: encryptedPassword }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Contraseña actualizada correctamente"
        });


    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la contraseña",
            error: err.message
        });
    }
};
