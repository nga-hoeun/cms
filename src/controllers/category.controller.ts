import {Response, Request, NextFunction} from "express"
import CategoryService from "../services/category.service"
import { PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import AWS from "aws-sdk";


const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const secretAccessKey = process.env.SECRET_ACCESS_KEY

const s3 = new S3Client({
    credentials:{
        accessKeyId:accessKey,
        secretAccessKey:secretAccessKey
    },
    region:bucketRegion
})

export default class CategoryController{
    public categoryService = new CategoryService();
    public createCategory = async (req:Request, res:Response)=>{
        try{
            console.log(req.body)
            console.log(req.file)
            const imageName = req.file.originalname
            const imagePath = "category/"+imageName
            const params = {
                Bucket:bucketName,
                Key:imagePath,
                Body:req.file.buffer,
                ContentType:req.file.mimetype
            }
            const command = new PutObjectCommand(params)
            await s3.send(command)
            await this.categoryService.createCategory({
                name:req.body.name,
                icon:imagePath   
            })
            res.status(201).json({ "Response": "Category Created Successfully" });
        }catch(error){
            console.log(error)
        }
    }
    public getAllCategory = async (req:Request, res:Response, next:NextFunction)=>{
        try{
            const categories = await this.categoryService.getAllCategory()
            for(const category of categories){
                const s3 = new AWS.S3();
                const params = {Bucket: bucketName, Key: category.Payload.icon}
                const response = await s3.getObject(params).promise()
                const fileContent = response.Body.toString('utf-8');
                console.log(fileContent)
                category.Payload.icon = fileContent
            }
            console.log(categories)
            res.status(200).json({"Data":categories})
        }catch(error){
            next(error)
        }
    }
    public getOneCategory  = async (req:Request, res:Response, next: NextFunction)=>{
        const category= req.params.category
        try{
            const oneCategory = await this.categoryService.getOneCategory(category);
            // for(const category of oneCategory){
            //     const getObjectParams = {
            //         Bucket:bucketName,
            //         Key:category.Payload.icon
            //     }
            //     const command = new GetObjectCommand(getObjectParams);
            //     const url = await getSignedUrl(s3, command);
            //     category.Payload.icon = url
            // }
            res.status(200).json({"Category":oneCategory})
        }catch(err) {
            next(err)
        }        
    }

    public deleteOneCategory = async (req:Request, res:Response, next:NextFunction)=>{
        const categoryId = req.params.id
        try{
            const deleteCategory = await this.categoryService.deleteOneCategory(categoryId);
            res.status(201).json({"Response":"Category Has Been Deleted"})
        }catch(err){
            next(err)
        }
    }

    public updateOneCategory = async (req:Request, res:Response, next:NextFunction)=>{
        const categoryId = req.params.id
        try{
            await this.categoryService.updateOneCategory(
                categoryId,
                {
                    name:req.body.name,
                    icon:req.body.icon
                }
            )
            res.send("Update Successfuly!")
        }catch(error){
            next(error)
        }
    }
}