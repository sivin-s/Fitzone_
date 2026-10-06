import { randomUUID } from "crypto";
import {
   S3Client, // connects to Amazon S3
   PutObjectCommand, // upload an object/file
   DeleteObjectCommand,  // delete an object
   GetObjectCommand    // download/read an object
} from '@aws-sdk/client-s3'
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"
import type { IStorageProvider } from "../interfaces/IStorageProvider.interface";
import { env } from "../../config/env.config";


export class S3StorageProvider implements IStorageProvider{
    private _s3Client: S3Client;
    constructor(){
        this._s3Client  = new S3Client({
            region: env.AWS_REGION,
            credentials:{
                accessKeyId: env.AWS_ACCESS_KEY_ID,
                secretAccessKey: env.AWS_SECRET_ACCESS_KEY
            }
        })
    }

    async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
        const fileKey = `${folder}/${randomUUID()}-${file.originalname}`;
        const command = new PutObjectCommand({
            Bucket: env.AWS_S3_BUCKET,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype
        })
        try{
            await this._s3Client.send(command);
            return `https://${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${fileKey.split("/").map(encodeURIComponent).join('/')}`
        } catch (retryError: unknown) {
         console.error(
          `S3 Upload failed: ${retryError instanceof Error ? retryError.message : String(retryError)}`
        );
        if (env.NODE_ENV !== "production") {
             // logger is missing
          console.info("Falling back to Base64 Data URI for local development");
          const base64Data = file.buffer.toString("base64");
          return `data:${file.mimetype};base64,${base64Data}`;
        }
        throw new Error("Failed to upload file to S3");
        
      }
    }

  private getOwnedKey(reference: string): string | null {
      try{
        const url = new URL(reference);
        const allowedHosts = [
            `${env.AWS_S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com`,
            `${env.AWS_S3_BUCKET}.s3.amazonaws.com`
        ]
        if(url.protocol !== "https:" || !allowedHosts.includes(url.hostname)){
            return null;
        }
        return decodeURIComponent(url.pathname.slice(1)) || null;
      }catch(_error){
        return null;
      }
  }

  async deleteFile(fileUrl: string): Promise<void> {
      const fileKey  = this.getOwnedKey(fileUrl);

      if(!fileKey) return;

      const command = new DeleteObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: fileKey
      });

      try{
        await this._s3Client.send(command);
      }catch(error: unknown){
         // logger is missing
         console.error({error}, "S3 delete failed");
         throw error 
      }
  }

    async getPresignedUrl(fileUrl: string): Promise<string | null> {
        try{
            const fileKey = this.getOwnedKey(fileUrl)!;
            const command = new GetObjectCommand({
                Bucket: env.AWS_S3_BUCKET,
                Key: fileKey 
            })
            return await getSignedUrl(this._s3Client,command,{
                expiresIn: env.AWS_S3_PRESIGNED_URL_EXPIRES_IN_SECONDS
            });
        }catch(error: unknown){
            // logger is missing
            console.error(
                        `Failed to generate presigned URL: ${error instanceof Error ? error.message : String(error)}`
            )
            return null;
        }
    }

}















