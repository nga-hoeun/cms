import { ResolverQueryLogConfigStatus } from "aws-sdk/clients/route53resolver";
import { NextFunction, Request, Response } from "express";
import UserService from "../services/user.service";

export default class UserController {
    public userService = new UserService();
    public signUp = async (req: Request, res: Response, next: NextFunction) => {
      try {
        await this.userService.createUser({
          email: req.body.email,
          username: req.body.username,
          role:req.body.role,
          gender: req.body.gender,
          age:req.body.age,
          image:req.body.image
        });
        res.status(201).json({ Response: "User Created Successfully" });
      } catch (error) {
        next(error);
      }
    };
    public logIn = async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log(req.body)
        const { tokenData, userId, userRole } = await this.userService.logIn(
          req.body.email,
          req.body.password
        );
        res.status(200).json({ data: tokenData, message: "login", id:userId, role:userRole });
      } catch (error) {
        res.status(401).json({"Message":error.message})
      }
    };

    public updateOneUser = async (req:Request, res:Response, next:NextFunction)=>{
      const userId = req.params.id
      const imagePath = "user/"+req.body.image
      console.log(req.body)
      try{
          await this.userService.updateUser(
              userId,
              {
                username:req.body.username,
                email:req.body.email,
                role:req.body.role,
                gender:req.body.gender,
                age:req.body.age,
                image:imagePath
              }
          )
          res.send("Update Successfuly!")
      }catch(error){
          console.log(error)
      }
    }
    public filterUser = async (req:Request, res:Response, next:NextFunction)=>{
      const id = req.params.id
      const gender = req.query.gender;
      const name = req.query.username;
      const age = req.query.age;
      console.log({gender:gender, name:name, age:age})
      try{
        const users = await this.userService.filterUser(id,gender, name, age);
        res.status(200).json({users})
      }catch(err){
        next(err)
      }
    }

    public getOneUser  = async (req:Request, res:Response, next: NextFunction)=>{
      const userId = req.params.id
      try{
          const oneUser = await this.userService.getOneUser(userId);
          console.log(oneUser)
          res.status(200).json({"User":oneUser})
      }catch(err) {
          next(err)
      }        
  }
  public getListUser = async (req:Request, res:Response, next: NextFunction)=>{
    const userId = req.params.id
    try{
        const users = await this.userService.getListUser(userId);
        res.status(200).json({"User":users})
    }catch(err) {
        next(err)
    }        
  }

  public deleteOneUser = async (req:Request, res:Response, next:NextFunction)=>{
    const userId = req.params.id
    try{
        const deleteUser = await this.userService.deleteOneUser(userId);
        res.status(201).json({"Response":"User Has Been Deleted"})
    }catch(err){
        next(err)
    }
}

}