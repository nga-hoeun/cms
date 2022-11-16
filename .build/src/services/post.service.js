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
const dynamoose_1 = __importDefault(require("dynamoose"));
const dynamoose_util_1 = require("../../utils/dynamoose.util");
const cms_model_1 = __importDefault(require("../models/cms.model"));
const error_utils_1 = require("../../utils/error.utils");
const uuid_1 = require("uuid");
const PostModel = cms_model_1.default[0];
const ddb = new dynamoose_1.default.aws.sdk.DynamoDB({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose_1.default.aws.ddb.set(ddb);
const ddbClient = dynamoose_1.default.aws.ddb();
class PostService {
    createPost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const postId = (0, uuid_1.v4)();
            PostModel.create({
                id: postId,
                pk: `POST#All`,
                sk: `POST#${postId}`,
                Payload: {
                    title: post.title,
                    content: post.content
                },
            });
        });
    }
    getAllPost() {
        return __awaiter(this, void 0, void 0, function* () {
            return PostModel.query("pk").eq("POST#All").sort("descending").exec();
        });
    }
    getOnePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFound = PostModel.query({
                "pk": "POST#All",
                "sk": `POST#${id}`
            }).exec();
            if ((yield userFound).count == 0) {
                throw new error_utils_1.HttpException(404, "Post doesn't exist");
            }
            return userFound;
        });
    }
    updateOnePost(id, post) {
        return __awaiter(this, void 0, void 0, function* () {
            const exp = (0, dynamoose_util_1.getDynamoExpression)({
                Payload: {
                    title: {
                        $value: post.title,
                    },
                    content: {
                        $value: post.content,
                    },
                },
            });
            console.log(exp);
            const params = {
                TableName: process.env.DYNAMODB_TABLE,
                Key: {
                    pk: { S: `POST#ALL` },
                    sk: { S: `POST#${id}` },
                },
                ExpressionAttributeNames: exp.ExpressionAttributeNames,
                UpdateExpression: exp.UpdateExpression,
                ExpressionAttributeValues: exp.ExpressionAttributeValues,
            };
            console.log(params);
            try {
                const data = yield ddbClient.updateItem(params).promise();
                console.log("Success - item added or updated", data);
                return data;
            }
            catch (err) {
                console.log("Error", err);
            }
        });
    }
    deleteOnePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id);
            const postFound = yield PostModel.query({
                "pk": "POST#All",
                "sk": `POST#${id}`
            }).exec();
            console.log(postFound);
            if (postFound.count == 0) {
                throw new error_utils_1.HttpException(404, "Post doesn't exist");
            }
            yield PostModel.delete({ pk: `POST#All`, sk: `POST#${id}` });
        });
    }
}
exports.default = PostService;
//# sourceMappingURL=post.service.js.map