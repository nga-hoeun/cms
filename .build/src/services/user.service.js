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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const error_utils_1 = require("../../utils/error.utils");
const cms_model_1 = __importDefault(require("../models/cms.model"));
const create_util_1 = require("../../utils/create.util");
const generate_password_1 = __importDefault(require("generate-password"));
const uuid_1 = require("uuid");
const UserModel = cms_model_1.default[1];
const saltRounds = 10;
class UserService {
    logIn(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userToFind = yield UserModel.scan("Payload.email").eq(email).exec();
            const userInfo = userToFind[0].toJSON().Payload;
            const validPassword = yield bcryptjs_1.default.compare(password, userInfo.password);
            if (validPassword) {
                const tokenData = this.createToken(userToFind[0]);
                return { tokenData };
            }
            else {
                throw new error_utils_1.HttpException(401, "Unsucessful login!!");
            }
        });
    }
    createToken(user) {
        const dataStoredInToken = { id: user.id };
        const secretKey = process.env.AWS_ACCESS_KEY_ID;
        const expiresIn = 30 * 30;
        return {
            expiresIn,
            token: (0, jsonwebtoken_1.sign)(dataStoredInToken, secretKey, { expiresIn }),
        };
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = (0, uuid_1.v4)();
            const userToFind = yield UserModel.scan("Payload.email")
                .eq(user.email)
                .exec();
            console.log(userToFind);
            if ((0, create_util_1.isEmpty)(user)) {
                throw new error_utils_1.HttpException(400, "Didn't meet all the required fields");
            }
            else if (userToFind.count != 0) {
                throw new error_utils_1.HttpException(409, `This email ${user.email} already exists.`);
            }
            else {
                const password = generate_password_1.default.generate({
                    length: 8,
                    uppercase: true,
                    symbols: true,
                    numbers: true,
                    lowercase: true,
                });
                console.log(password);
                bcryptjs_1.default.genSalt(saltRounds, (err, salt) => {
                    bcryptjs_1.default.hash(password, salt, (err, hash) => {
                        // Store hash in your password DB.
                        UserModel.create({
                            id: userId,
                            pk: `USER#ALL`,
                            sk: `USER#${userId}`,
                            Payload: {
                                username: user.username,
                                email: user.email,
                                gender: user.gender,
                                password: hash,
                                age: user.age,
                            },
                        });
                    });
                });
            }
        });
    }
}
exports.default = UserService;
//# sourceMappingURL=user.service.js.map