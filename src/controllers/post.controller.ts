import {Response, Request, NextFunction} from "express"
import PostService from "../services/post.service"
import { PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

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

export default class PostController{
    public postService = new PostService();
    public constructPost = async (req:Request, res:Response)=>{
        try{
            // console.log(req.body)
            const imageName = req.file.originalname
            const imagePath = "post/2022-12/"+imageName
            const params = {
                Bucket:bucketName,
                Key:imagePath,
                Body:req.file.buffer,
                ContentType:req.file.mimetype
            }
            const command = new PutObjectCommand(params)
            await s3.send(command)
            await this.postService.createPost({
                category:req.body.category,
                title: req.body.title,
                content: req.body.content,
                image:imagePath
            })
            res.status(201).json({ "Response": "Post Created Successfully" });
        }catch(error){
            console.log(error)
        }
    }
    public getAllPost = async (req:Request, res:Response, next:NextFunction)=>{
        try{
            const post = await this.postService.getAllPost()
            console.log(post)
            res.status(200).json({"Data":post})
        }catch(error){
            next(error)
        }
        // res.send({Message:"Hello World"})
    }
    public getOnePost  = async (req:Request, res:Response, next: NextFunction)=>{
        const postId = req.params.id
        try{
            const onePost = await this.postService.getOnePost(postId);
            console.log(onePost)
            res.status(200).json({"Post":onePost})
        }catch(err) {
            next(err)
        }        
    }

    public filterPost  = async (req:Request, res:Response, next: NextFunction)=>{
        const category = req.query.category;
        const title = req.query.title
        try{
            const allPost = await this.postService.filterPost(category,title);
            console.log(allPost)
            res.status(200).json({"Data":allPost})
        }catch(err) {
            next(err)
        }        
    }

    public deleteOnePost = async (req:Request, res:Response, next:NextFunction)=>{
        const postId = req.params.id
        try{
            const deleteUser = await this.postService.deleteOnePost(postId);
            res.status(201).json({"Response":"Post Has Been Deleted"})
        }catch(err){
            next(err)
        }
    }

    public updateOnePost = async (req:Request, res:Response, next:NextFunction)=>{
        const postId = req.params.id
        try{
            await this.postService.updateOnePost(
                postId,
                {
                    category:req.body.category,
                    title:req.body.title,
                    content:req.body.content,
                    image:req.body.image
                }
            )
            res.send("Update Successfuly!")
        }catch(error){
            next(error)
        }
    }
}