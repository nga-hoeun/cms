import { Router } from "express";
import UserController from '../controllers/user.controller'
import { Routes } from "../interfaces/routes.interface";

export default class UserRoutes implements Routes{
    public path = "/user";
    public router = Router();
    public userController = new UserController;

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post(`${this.path}/signUp`, this.userController.signUp);
        this.router.post(`${this.path}/logIn`, this.userController.logIn);
        this.router.get(`${this.path}/:id`, this.userController.getOneUser);
        this.router.put(`${this.path}/:id`, this.userController.updateOneUser);

    }
}