import multer from "multer";
import mime from "mime";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let destinationFolder; 
        switch(file.fieldname) {
            case "profile": 
                destinationFolder = "./src/uploads/profiles";
                break; 
            case "products": 
                destinationFolder = "./src/uploads/products";
                break; 
            case "document": 
                destinationFolder = "./src/uploads/documents"
        }
        cb(null, destinationFolder); 
    }, 
    filename: (req, file, cb) => {
        const { uid } = req.params;
        let name;
        switch(file.fieldname) {
            case "profile": 
                name = `${uid}.${mime.getExtension(file.mimetype)}`;
                break; 
            case "products": 
                name = file.originalname;
                break; 
            case "document": 
                name = file.originalname
        }
        cb(null, name); 
    }
})

const upload = multer({storage:storage}); 

export default upload