
import type {} from "multer"

export interface IStorageProvider{
    uploadFile(file: Express.Multer.File, folder: string)
    :Promise<string>;
    deleteFile(fileUrl:string): Promise<void>;
    getPresignedUrl(fileUrl: string): Promise<string | null>;
}