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
const user_service_1 = __importDefault(require("../services/user.service"));
class UserController {
    constructor() {
        this.userService = new user_service_1.default();
        this.signUp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.userService.createUser({
                    email: req.body.email,
                    username: req.body.username,
                    gender: req.body.gender,
                    age: req.body.age
                });
                res.status(201).json({ Response: "User Created Successfully" });
            }
            catch (error) {
                next(error);
            }
        });
        this.logIn = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                const { tokenData } = yield this.userService.logIn(req.body.email, req.body.password);
                res.status(200).json({ data: tokenData, message: "login" });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map