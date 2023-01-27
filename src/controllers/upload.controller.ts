import { NextFunction, Request, Response } from "express";
import UploadService from "../services/upload.service";
import UserService from "@/services/user.service";
import CategoryService from "@/services/category.service";
import PostService from "@/services/post.service";

export default class UploadController {
  public uploadService = new UploadService();
  public userService = new UserService();
  public categoryService = new CategoryService();
  public postService = new PostService();
  public uploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const imageName = req.file.originalname;
    var imagePath = req.params.path + "/" + imageName;
    if (req.query.time != undefined) {
      imagePath = req.params.path + "/" + req.query.time + "/" + imageName;
    }
    const body = req.file.buffer;
    const contentType = req.file.mimetype;
    console.log(req.body);
    try {
      await this.uploadService.uploadImage(imagePath, body, contentType);
      res.status(201).json({ Response: "Image upload successfully" });
    } catch (error) {
      next(error);
    }
    console.log(req.file);
    // res.send("Successfully uploaded to "+ req.file.location +" location")
  };

  public deleteImage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id
    const type = req.query.type
    var item = ''
    if(type == "user"){
      const user = await this.userService.getOneUser(id)
      item=user[0].Payload.image
    }else if(type == "post"){
      const post = await this.postService.getOnePost(id)
      item=post[0].Payload.image
    }else{
      const category = await this.categoryService.showCategory(id)
      item=category[0].Payload.image
    }
    try {
      console.log(item)
      await this.uploadService.deleteImage(item);
      res.status(201).json({ Response: "Image deleted sucessfully" });
    } catch (error) {
      next(error);
    }
  };
}
