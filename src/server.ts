import {App} from "./app"
import PostRoutes from "./routes/post.route";
import UserRoutes from "./routes/user.route";
import CategoryRoutes from "./routes/category.route"
import UploadRoutes from "./routes/upload.route";
export const app = new App([new UserRoutes(), new PostRoutes(),new CategoryRoutes(), new UploadRoutes])

app.listen();