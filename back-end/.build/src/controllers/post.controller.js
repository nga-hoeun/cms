"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_service_1 = __importDefault(require("../services/post.service"));
class PostController {
    constructor() {
        this.postService = new post_service_1.default();
        this.constructPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(req.body)
                yield this.postService.createPost({
                    title: req.body.title,
                    content: req.body.content,
                });
                res.status(201).json({ "Response": "Post Created Successfully" });
            }
            catch (error) {
                console.log(error);
            }
        });
        this.getAllPost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this.postService.getAllPost();
                console.log(post);
                res.status(200).json({ "Data": post });
            }
            catch (error) {
                next(error);
            }
        });
        this.getOnePost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.id;
            try {
                const onePost = yield this.postService.getOnePost(postId);
                console.log(onePost);
                res.status(200).json({ "Post": onePost });
            }
            catch (err) {
                next(err);
            }
        });
        this.deleteOnePost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.id;
            try {
                const deleteUser = yield this.postService.deleteOnePost(postId);
                res.status(201).json({ "Response": "Post Has Been Deleted" });
            }
            catch (err) {
                next(err);
            }
        });
        this.updateOnePost = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const postId = req.params.id;
            try {
                yield this.postService.updateOnePost(postId, {
                    title: req.body.title,
                    content: req.body.content
                });
                res.send("Update Successfuly!");
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = PostController;
//# sourceMappingURL=post.controller.js.map