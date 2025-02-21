import { hash, verify } from "argon2";
import User from "./user.model.js";



export const adminDefaultCreated = async (req, res) => {
    try{

        const defaultAdmin = await User.findOne({ email: "Dabp@gmail.com" });

        if(!defaultAdmin){
            const newAdmin = new User({
                fullName: "Diego Berciannn",
                username: "Dabpp",
                email: "Dabp@gmail.com",
                password: "dBerc1an!",
                phone: "49056584",
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
