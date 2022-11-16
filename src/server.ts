import {App} from "./app"
import PostRoutes from "./routes/post.route";
import UserRoutes from "./routes/user.route";
export const app = new App([new UserRoutes(), new PostRoutes()])

app.listen();