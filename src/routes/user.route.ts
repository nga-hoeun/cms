import { Router } from "express";
import UserController from '../controllers/user.controller'
import { Routes } from "../interfaces/routes.interface";

export default class UserRoutes implements Routes{
    public path = "/";
    public router = Router();
    public userController = new UserController;

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post(`${this.path}signUp`, this.userController.signUp);
        this.router.post(`${this.path}logIn`, this.userController.logIn);
    }
}