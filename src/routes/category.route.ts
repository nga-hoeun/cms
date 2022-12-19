import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import CategoryController from "../controllers/category.controller";
import authMiddleware from "../middlewares/auth.middleware";
import upload from "../middlewares/multer.middleware";

export default class CategoryRoutes implements Routes {
  public path = "/category";
  public router = Router();
  public categoryController = new CategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/`,
      upload.single("icon"),
      this.categoryController.createCategory
    );
    this.router.get(
      `${this.path}/:category`,
      this.categoryController.getOneCategory
    );
    this.router.get(`${this.path}/`, this.categoryController.getAllCategory);
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      this.categoryController.updateOneCategory
    );
    this.router.delete(
      `${this.path}/:id`,
      this.categoryController.deleteOneCategory
    );
  }
}
