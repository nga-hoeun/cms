import {App} from "./app"
import PostRoutes from "./routes/post.route";
import UserRoutes from "./routes/user.route";
import CategoryRoutes from "./routes/category.route"
export const app = new App([new UserRoutes(), new PostRoutes(),new CategoryRoutes()])

app.listen();