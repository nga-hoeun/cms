import { Response, Request, NextFunction, response } from "express";
import CategoryService from "../services/category.service";

export default class CategoryController {
  public categoryService = new CategoryService();
  public createCategory = async (req: Request, res: Response) => {
    try {
      const imagePath = "category/"+req.body.icon
      await this.categoryService.createCategory({
        name: req.body.name,
        icon: imagePath,
      });
      res.status(201).json({ Response: "Category Created Successfully" });
    } catch (error) {
      console.log(error);
    }
  };
  public getAllCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const categories = await this.categoryService.getAllCategory();
      console.log(categories);
      res.status(200).json({ Data: categories });
    } catch (error) {
      next(error);
    }
  };
  public getOneCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const category = req.params.category;
    try {
      const oneCategory = await this.categoryService.getOneCategory(category);
      res.status(200).json({ Category: oneCategory });
    } catch (err) {
      next(err);
    }
  };

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
            res.status(201).json({"Response":"Category Has Been Updated Successfully"})
        }catch(error){
            console.log(error.message)
        }
    }
  };
