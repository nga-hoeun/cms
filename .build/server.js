"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const app_1 = require("./app");
const post_route_1 = __importDefault(require("./src/routes/post.route"));
const user_route_1 = __importDefault(require("./src/routes/user.route"));
exports.app = new app_1.App([new user_route_1.default(), new post_route_1.default()]);
exports.app.listen();
//# sourceMappingURL=server.js.map