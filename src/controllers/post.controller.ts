import {Response, Request, NextFunction} from "express"
import PostService from "../services/post.service"
export default class PostController{
    public postService = new PostService();
    public constructPost = async (req:Request, res:Response)=>{
        try{
            const imagePath = "post/2022-12/"+req.body.image
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
            await this.postService.deleteOnePost(postId);
            res.status(201).json({"Response":"Post Has Been Deleted"})
        }catch(err){
            next(err)
        }
    }

    public updateOnePost = async (req:Request, res:Response, next:NextFunction)=>{
        const postId = req.params.id
        const imagePath = "post/2022-12/"+req.body.image
        console.log(req.body)
        try{
            await this.postService.updateOnePost(
                postId,
                {
                    category:req.body.category,
                    title:req.body.title,
                    content:req.body.content,
                    image:imagePath
                }
            )
            res.status(201).json({ Response: "Post Updated Successfully" });
        }catch(error){
            next(error)
        }
    }
}