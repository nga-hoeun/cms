import dynamoose from "dynamoose";
import { getDynamoExpression } from "../../utils/dynamoose.util";
import {
  ExpressionAttributeNameMap,
  ExpressionAttributeValueMap,
  UpdateItemInput,
} from "aws-sdk/clients/dynamodb";
import cmsModel from "../models/cms.model";
import { HttpException } from "../../utils/error.utils";
import { v4 as uuidv4 } from "uuid";
import { Post } from "../interfaces/posts.interface";

const PostModel = cmsModel[0]

const ddb = new dynamoose.aws.sdk.DynamoDB({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set(ddb);
const ddbClient = dynamoose.aws.ddb();
export default class PostService {
  public async createPost(post:Post){
    const postId = uuidv4();
    PostModel.create({
      id: postId,
      pk: `POST#All`,
      sk: `POST#${postId}`,
      Payload: {
        title:post.title,
        content:post.content
      },
    });
  }
  public async getAllPost() {
    return PostModel.query("pk").eq("POST#All").sort("descending").exec();
  }

  public async getOnePost(id: string) {
    const userFound = PostModel.query(
      {
        "pk":"POST#All",
        "sk":`POST#${id}`
      }
    ).exec();
    if ((await userFound).count == 0) {
      throw new HttpException(404, "Post doesn't exist");
    }
    return userFound;
  }

  public async updateOnePost(id: string, post: Post) {
    const exp = getDynamoExpression({
      Payload: {
        title: {
          $value: post.title,
        },
        content: {
          $value: post.content,
        },
      },
    });
    console.log(exp);
    const params: UpdateItemInput = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        pk: { S: `POST#ALL` },
        sk: { S: `POST#${id}` },
      },
      ExpressionAttributeNames:
        exp.ExpressionAttributeNames as ExpressionAttributeNameMap,
      UpdateExpression: exp.UpdateExpression as string,
      ExpressionAttributeValues:
        exp.ExpressionAttributeValues as ExpressionAttributeValueMap,
    };
    console.log(params);
    try {
      const data = await ddbClient.updateItem(params).promise();
      console.log("Success - item added or updated", data);
      return data;
    } catch (err) {
      console.log("Error", err);
    }
  }

  public async deleteOnePost(id: string) {
    console.log(id)
    const postFound = await PostModel.query(
      {
        "pk":"POST#All",
        "sk":`POST#${id}`
      }
    ).exec();
    console.log(postFound)
    if (postFound.count == 0) {
      throw new HttpException(404, "Post doesn't exist");
    }
    await PostModel.delete({ pk: `POST#All`, sk: `POST#${id}` });
  }
}
