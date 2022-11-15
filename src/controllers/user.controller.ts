import { NextFunction, Request, Response } from "express";
import { UserLogin } from "../interfaces/userLogin.interface";
import UserService from "../services/user.service";

export default class UserController {
    public userService = new UserService();
    public signUp = async (req: Request, res: Response, next: NextFunction) => {
      try {
        await this.userService.createUser({
          email: req.body.email,
          username: req.body.username,
          gender: req.body.gender,
          age:req.body.age
        });
        res.status(201).json({ Response: "User Created Successfully" });
      } catch (error) {
        next(error);
      }
    };
    public logIn = async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log(req.body)
        const { tokenData } = await this.userService.logIn(
          req.body.email,
          req.body.password
        );
        res.status(200).json({ data: tokenData, message: "login" });
      } catch (error) {
        next(error);
      }
    };
}