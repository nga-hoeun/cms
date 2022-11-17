import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import PostController from "../controllers/post.controller";
import authMiddleware from "../middlewares/auth.middleware";

export default class PostRoutes implements Routes{
    public path = "/post";
    public router = Router();
    public postController = new PostController;

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post(`${this.path}/`, this.postController.constructPost);
        this.router.get(`${this.path}/`, this.postController.getAllPost);
        this.router.get(`${this.path}/:id`, this.postController.getOnePost);
        this.router.put(`${this.path}/:id`, this.postController.updateOnePost);
        this.router.delete(`${this.path}/:id`, this.postController.deleteOnePost);
    }
}