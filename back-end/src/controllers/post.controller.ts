import {Response, Request, NextFunction} from "express"
import PostService from "../services/post.service"
export default class PostController{
    public postService = new PostService();
    public constructPost = async (req:Request, res:Response)=>{
        try{
            // console.log(req.body)
            await this.postService.createPost({
                title: req.body.title,
                content: req.body.content,
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
                    title:req.body.title,
                    content:req.body.content
                }
            )
            res.send("Update Successfuly!")
        }catch(error){
            next(error)
        }
    }
}