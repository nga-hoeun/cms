import dynamoose from "dynamoose";
import { getDynamoExpression } from "../utils/dynamoose.util";
import {
  ExpressionAttributeNameMap,
  ExpressionAttributeValueMap,
  UpdateItemInput,
} from "aws-sdk/clients/dynamodb";
import { HttpException } from "../utils/error.utils";
import { v4 as uuidv4 } from "uuid";
import { Category } from "../interfaces/categories.interface";
import { CategoryModel } from "@/models/cms.model";
import { ParsedQs } from "qs";
const ddb = new dynamoose.aws.sdk.DynamoDB({
  // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // region: process.env.AWS_REGION,
});
// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set(ddb);
const ddbClient = dynamoose.aws.ddb();
export default class CategoryService {
  public async createCategory(category: Category) {
    const categoryId = uuidv4();
    await CategoryModel.create({
      id: categoryId,
      pk: `CATEGORY#ALL`,
      sk: `CATEGORY#${categoryId}`,
      Payload: {
        name: category.name,
        icon: category.icon,
      },
    });
  }
  public async getAllCategory() {
    const categories = await CategoryModel.query("pk")
      .eq("CATEGORY#ALL")
      .exec();
    console.log(categories);
    if (categories) {
      return categories;
    } else {
      throw new HttpException(404, "There are no categories here.");
    }
  }

  public async getOneCategory(category: string) {
    const categoryFound = CategoryModel.query(
      new dynamoose.Condition()
        .where("pk")
        .eq("CATEGORY#ALL")
        .where("Payload.name")
        .eq(category)
    ).exec();
    if ((await categoryFound).count == 0) {
      throw new HttpException(404, "Category doesn't exist");
    }
    return categoryFound;
  }

  public async updateOneCategory(id: string, category: Category) {
    const exp = getDynamoExpression({
      Payload: {
        name: {
          $value: category.name,
        },
        icon: {
          $value: category.icon,
        },
      },
    });
    console.log(exp);
    const params: UpdateItemInput = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        pk: { S: `CATEGORY#ALL` },
        sk: { S: `CATEGORY#${id}` },
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
      return data;
    } catch (err) {
      console.log("Error", err);
    }
  }

  public async deleteOneCategory(id: string) {
    console.log(id);
    const categoryFound = await CategoryModel.query({
      pk: "CATEGORY#ALL",
      sk: `CATEGORY#${id}`,
    }).exec();
    console.log(categoryFound);
    if (categoryFound.count == 0) {
      throw new HttpException(404, "Category doesn't exist");
    }
    await CategoryModel.delete({ pk: `CATEGORY#ALL`, sk: `CATEGORY#${id}` });
  }
}
