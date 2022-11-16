"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_controller_1 = __importDefault(require("../controllers/post.controller"));
class PostRoutes {
    constructor() {
        this.path = "/post";
        this.router = (0, express_1.Router)();
        this.postController = new post_controller_1.default;
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.post(`${this.path}`, this.postController.constructPost);
        this.router.get(`${this.path}`, this.postController.getAllPost);
        this.router.get(`${this.path}/:id`, this.postController.getOnePost);
        this.router.put(`${this.path}/:id`, this.postController.updateOnePost);
        this.router.delete(`${this.path}/:id`, this.postController.deleteOnePost);
    }
}
exports.default = PostRoutes;
//# sourceMappingURL=post.route.js.map