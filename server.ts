import {App} from "./app"
import PostRoutes from "./src/routes/post.route";
import UserRoutes from "./src/routes/user.route";
export const app = new App([new UserRoutes(), new PostRoutes()])

app.listen();