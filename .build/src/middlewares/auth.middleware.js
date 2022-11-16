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
const jsonwebtoken_1 = require("jsonwebtoken");
const cms_model_1 = __importDefault(require("../models/cms.model"));
const error_utils_1 = require("../../utils/error.utils");
const UserModel = cms_model_1.default[1];
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Authorization = (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
        // console.log(Authorization)
        if (Authorization) {
            const secretKey = process.env.AWS_ACCESS_KEY_ID;
            const verificationResponse = (0, jsonwebtoken_1.verify)(Authorization, secretKey);
            const userId = verificationResponse.id;
            // console.log(userId)
            const findUser = yield UserModel.query({
                pk: "USER#ALL",
                sk: `USER#${userId}`
            }).exec();
            // console.log(findUser)
            if (findUser) {
                next();
            }
            else {
                next(new error_utils_1.HttpException(401, 'Wrong authentication token'));
            }
        }
        else {
            next(new error_utils_1.HttpException(404, 'Authentication token missing'));
        }
    }
    catch (error) {
        next(new error_utils_1.HttpException(401, 'Wrong authentication token'));
    }
});
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map