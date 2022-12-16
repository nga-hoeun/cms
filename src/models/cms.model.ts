import * as dynamoose from "dynamoose";
import * as dotenv from "dotenv";
dotenv.config({ path: `env/.env.${process.env.ENV}` });
console.log(process.env);

const ddb = new dynamoose.aws.sdk.DynamoDB({
  // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set(ddb);

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
      age: Number,
      role: String,
      image: String,
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
      category: String,
      title: String,
      content: String,
      image: String,
    },
  },
});

export const categorySchema = new dynamoose.Schema({
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
      name: String,
      icon: String,
    },
  },
});

export const PostModel = dynamoose.model(
  process.env.DYNAMODB_TABLE,
  postSchema,
  {
    throughput: "ON_DEMAND",
    create: false,
    waitForActive: false,
  }
);

export const UserModel = dynamoose.model(
  process.env.DYNAMODB_TABLE,
  userSchema,
  {
    throughput: "ON_DEMAND",
    create: false,
    waitForActive: false,
  }
);

export const CategoryModel = dynamoose.model(
  process.env.DYNAMODB_TABLE,
  categorySchema,
  {
    throughput: "ON_DEMAND",
    create: false,
    waitForActive: false,
  }
);
