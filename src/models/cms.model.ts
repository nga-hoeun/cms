import * as dynamoose from "dynamoose";
import * as dotenv from "dotenv";
dotenv.config({ path: `env/.env.${process.env.ENV}` });

export const userSchema = new dynamoose.Schema({
  id: String,
  pk: {
    hashKey: true,
    type: String,
  },
  sk: {
    type: String,
    rangeKey: true,
  },
  Payload: {
    type: Object,
    schema: {
      username: String,
      email: String,
      gender: String,
      password: String,
      age:Number
    },
  },
});
export const postSchema = new dynamoose.Schema({
    id: String,
    pk: {
      hashKey: true,
      type: String,
    },
    sk: {
      type: String,
      rangeKey: true,
    },
    Payload: {
      type: Object,
      schema: {
        title: String,
        content:String
      },
    },
  });

const PostModel = dynamoose.model(process.env.DYNAMODB_TABLE, postSchema,{
  throughput: "ON_DEMAND",
  create: false,
  waitForActive: false,
});

const UserModel = dynamoose.model(process.env.DYNAMODB_TABLE, userSchema,{
  throughput: "ON_DEMAND",
  create: false,
  waitForActive: false,
});

export default [PostModel,UserModel];
