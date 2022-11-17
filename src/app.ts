import express from "express";
import { Routes } from "./interfaces/routes.interface";
import errorMiddleware from "./middlewares/error.middleware";
import * as dotenv from "dotenv";
import * as dynamoose from "dynamoose";
import bodyParser from "body-parser";
import cors from "cors"

/**
 * App
 */
export class App{
    public app: express.Application;
    public port: number;

    constructor(routes: Routes[]) {
        dotenv.config({ path: `env/.env.${process.env.ENV}` });
        this.app = express();
        this.app.use(cors())
        this.port = 4000;
        this.bodyParser();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
        this.initDynamoose();
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach((route) => {
          this.app.use(route.router);
        });
      }
    
      public listen() {
        this.app.listen(this.port, () => {
          console.log("This app runs on port" + this.port);
        });
      }
    
      private initializeErrorHandling() {
        this.app.use(errorMiddleware);
      }

      private bodyParser(){
        this.app.use(bodyParser.json())
      }
    
      public initDynamoose() {
        // Create new DynamoDB instance
        const ddb = new dynamoose.aws.sdk.DynamoDB({
          // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          // region: process.env.AWS_REGION,
        });
    
        // Set DynamoDB instance to the Dynamoose DDB instance
        dynamoose.aws.ddb.set(ddb);
      }
}