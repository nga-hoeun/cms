import serverless from "serverless-http"
import {app} from './server'

export const routesHandlers = serverless(app.app);
