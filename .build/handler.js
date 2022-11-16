"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesHandlers = void 0;
const serverless_http_1 = __importDefault(require("serverless-http"));
const server_1 = require("./server");
exports.routesHandlers = (0, serverless_http_1.default)(server_1.app);
//# sourceMappingURL=handler.js.map