import {
    S3Client,
    PutObjectCommandInput,
    PutObjectCommand,
    DeleteObjectCommandInput,
    DeleteObjectCommand,
  } from "@aws-sdk/client-s3";
  const bucketName = process.env.BUCKET_NAME;
  const bucketRegion = process.env.BUCKET_REGION;
  const accessKey = process.env.ACCESS_KEY;
  const secretAccessKey = process.env.SECRET_ACCESS_KEY;
  
  const s3 = new S3Client({
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretAccessKey,
    },
    region: bucketRegion,
  });
  export default class UploadService {
    public async uploadImage(imagePath: string, body: Buffer, contentType: string) {
        try{
            const params: PutObjectCommandInput = {
                ACL: "public-read",
                Body: body,
                Bucket: bucketName,
                Key: imagePath,
                ContentType: contentType,
                ContentEncoding: "64",
              };
              const command = new PutObjectCommand(params);
              await s3.send(command);
        }catch(error){
            console.log(error)
        }
    }
    public async deleteImage(imagePath: string) {
      try{
          const params: DeleteObjectCommandInput = {
              Bucket: bucketName,
              Key: imagePath,
            };
            const command = new DeleteObjectCommand(params);
            await s3.send(command);
      }catch(error){
          console.log(error)
      }
  }
}
  

