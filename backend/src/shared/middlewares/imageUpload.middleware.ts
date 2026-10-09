import multer from "multer";
import { BadRequestError } from "../errors/BadRequestError.error";


const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits:{
        fileSize: MAX_IMAGE_SIZE_BYTES
    },
    fileFilter: (_req,file,cb)=>{
        if(!file.mimetype.startsWith("image/")){
            cb(new BadRequestError("Only  image files are allowed"));
            return;
        }
        cb(null, true)
    }
})















