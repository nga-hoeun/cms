import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import PostController from "../controllers/post.controller";
import authMiddleware from "../middlewares/auth.middleware";

export default class PostRoutes implements Routes {
  public path = "/post";
  public router = Router();
  public postController = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/`,
      authMiddleware,
      this.postController.constructPost
    );
    this.router.get(
      `${this.path}/all/`,
      authMiddleware,
      this.postController.getAllPost
    );
    this.router.get(
      `${this.path}/:id`,
      authMiddleware,
      this.postController.getOnePost
    );
    this.router.get(
      `${this.path}/`,
      authMiddleware,
      this.postController.filterPost
    );
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      this.postController.updateOnePost
    );
    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      this.postController.deleteOnePost
    );
  }
}
