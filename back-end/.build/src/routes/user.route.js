"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
class UserRoutes {
    constructor() {
        this.path = "/";
        this.router = (0, express_1.Router)();
        this.userController = new user_controller_1.default;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}signUp`, this.userController.signUp);
        this.router.post(`${this.path}logIn`, this.userController.logIn);
    }
}
exports.default = UserRoutes;
//# sourceMappingURL=user.route.js.map