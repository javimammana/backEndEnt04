import { Router } from "express";
import UserController from "../controllers/users.controller.js";



const router = Router();
const userController = new UserController();

router.post("/register", userController.createUser);
router.post("/logout", userController.logout.bind(userController));
router.post("/requestPasswordReset", userController.requestPasswordReset);
router.post("/resetPassword", userController.resetPassword);
router.put("/premium/:uid", userController.cambioRol);

import upload from "../middleware/multer.js";
import mime from "mime";
import { userServices } from "../services/services.js";

router.post("/:uid/documents", upload.fields([{ name: "document" }, { name: "products" }, { name: "profile" }]), async (req, res) => {
    const { uid } = req.params;
    const uploaddedDocuments = req.files;

    try {
        const user = await userServices.getUserById(uid);

        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }

        if (uploaddedDocuments) {
            
            if (uploaddedDocuments.document) {
                user.documents = user.documents.concat(uploaddedDocuments.document.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })));
            }

            if (uploaddedDocuments.products) {
                user.documents = user.documents.concat(uploaddedDocuments.products.map(doc => ({
                    name: doc.originalname,
                    reference: doc.path
                })));
            }

            if (uploaddedDocuments.profile) {

                let aux = uploaddedDocuments.profile.find((img) => img.fieldname === "profile")

                let resultado = user.documents.find((profile) => profile.name === "Profile");

                resultado.reference = `src/uploads/profiles/${uid}.${mime.getExtension(aux.mimetype)}`;
                
                user.documents.splice(user.documents.indexOf(resultado), 1, resultado);



                // if (resultado) {}
            //     user.documents = user.documents.concat(uploaddedDocuments.profile.map(doc => ({
            //         name: "Profile",
            //         reference: `src/uploads/profiles/${uid}.${mime.getExtension(doc.mimetype)}`
            //     }
            // )));
            }

        }

        await userServices.updateUser(uid, {documents: user.documents})

        res.status(200).send("Documentos cargados!")

        
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al cargar Documentos")
    }
})



export default router;