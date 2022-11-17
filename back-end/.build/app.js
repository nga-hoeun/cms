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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const error_middleware_1 = __importDefault(require("./src/middlewares/error.middleware"));
const dotenv = __importStar(require("dotenv"));
const dynamoose = __importStar(require("dynamoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
/**
 * App
 */
class App {
    constructor(routes) {
        dotenv.config({ path: `env/.env.${process.env.ENV}` });
        this.app = (0, express_1.default)();
        this.app.use((0, cors_1.default)());
        this.port = 4000;
        this.bodyParser();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
        this.initDynamoose();
    }
    initializeRoutes(routes) {
        routes.forEach((route) => {
            this.app.use("/", route.router);
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("This app runs on port" + this.port);
        });
    }
    initializeErrorHandling() {
        this.app.use(error_middleware_1.default);
    }
    bodyParser() {
        this.app.use(body_parser_1.default.json());
    }
    initDynamoose() {
        // Create new DynamoDB instance
        const ddb = new dynamoose.aws.sdk.DynamoDB({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
        });
        // Set DynamoDB instance to the Dynamoose DDB instance
        dynamoose.aws.ddb.set(ddb);
    }
}
exports.App = App;
//# sourceMappingURL=app.js.map