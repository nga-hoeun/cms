"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = exports.userSchema = void 0;
const dynamoose = __importStar(require("dynamoose"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: `env/.env.${process.env.ENV}` });
exports.userSchema = new dynamoose.Schema({
    id: String,
    pk: {
        hashKey: true,
        type: String,
    },
    sk: {
        type: String,
        rangeKey: true,
    },
    Payload: {
        type: Object,
        schema: {
            username: String,
            email: String,
            gender: String,
            password: String,
            age: Number
        },
    },
});
exports.postSchema = new dynamoose.Schema({
    id: String,
    pk: {
        hashKey: true,
        type: String,
    },
    sk: {
        type: String,
        rangeKey: true,
    },
    Payload: {
        type: Object,
        schema: {
            title: String,
            content: String
        },
    },
});
const PostModel = dynamoose.model(process.env.DYNAMODB_TABLE, exports.postSchema, {
    throughput: "ON_DEMAND",
    create: false,
    waitForActive: false,
});
const UserModel = dynamoose.model(process.env.DYNAMODB_TABLE, exports.userSchema, {
    throughput: "ON_DEMAND",
    create: false,
    waitForActive: false,
});
exports.default = [PostModel, UserModel];
//# sourceMappingURL=cms.model.js.map