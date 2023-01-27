import { Router } from "express";
import { Routes } from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";
import UploadController from "@/controllers/upload.controller";
import upload from "../middlewares/multer.middleware";

export default class UploadRoutes implements Routes {
  public path = "/image";
  public router = Router();
  public uploadController = new UploadController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/:path`,
      upload.single("image"),
      authMiddleware,
      this.uploadController.uploadImage
    );
    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      this.uploadController.deleteImage
    );
  }
  
}
