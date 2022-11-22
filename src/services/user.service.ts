import { sign } from "jsonwebtoken";
import dynamoose from "dynamoose";
import bcrypt from "bcryptjs";
import {
  DataStoredInToken,
  TokenData,
  User,
} from "../interfaces/users.interface";
import {
  ExpressionAttributeNameMap,
  ExpressionAttributeValueMap,
  UpdateItemInput,
} from "aws-sdk/clients/dynamodb";
import { AnyDocument } from "dynamoose/dist/Document";
import { HttpException } from "../utils/error.utils";
import { isEmpty } from "../utils/create.util";
import Generator from "generate-password";
import { v4 as uuidv4 } from "uuid";
import { getDynamoExpression } from "../utils/dynamoose.util";
import { UserModel } from "@/models/cms.model";
import MailController from "../ mail/registerEmail";

const ddb = new dynamoose.aws.sdk.DynamoDB({
  // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // region: process.env.AWS_REGION,
});
// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set(ddb);
const ddbClient = dynamoose.aws.ddb();

const saltRounds = 10;

export default class UserService {
  public MailController = new MailController();
  public async logIn(email: string, password: string) {
    const userToFind = await UserModel.scan("Payload.email").eq(email).exec();
    if (userToFind.count != 0) {
      const userInfo = userToFind[0].toJSON().Payload;
      const userId = userToFind[0].id;
      const validPassword = await bcrypt.compare(password, userInfo.password);
      if (validPassword) {
        const tokenData = this.createToken(userToFind[0]);
        return { tokenData, userId };
      } else {
        throw new HttpException(403, "Wrong Password!!");
      }
    } else {
      throw new HttpException(403, "Wrong Email Address!!");
    }
  }

  public createToken(user: AnyDocument): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secretKey: string = process.env.AWS_ACCESS_KEY_ID;
    const expiresIn: number = 600 * 600;

    return {
      expiresIn,
      token: sign(dataStoredInToken, secretKey, { expiresIn }),
    };
  }

  public async createUser(user: User) {
    const userId = uuidv4();
    const userToFind = await UserModel.scan("Payload.email")
      .eq(user.email)
      .exec();
    console.log(userToFind);
    if (isEmpty(user)) {
      throw new HttpException(400, "Didn't meet all the required fields");
    } else if (userToFind.count != 0) {
      throw new HttpException(409, `This email ${user.email} already exists.`);
    } else {
      const password = Generator.generate({
        length: 8,
        uppercase: true,
        symbols: true,
        numbers: true,
        lowercase: true,
      });
      console.log(password);
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          // Store hash in your password DB.
          try {
            UserModel.create({
              id: userId,
              pk: `USER#ALL`,
              sk: `USER#${userId}`,
              Payload: {
                username: user.username,
                email: user.email,
                gender: user.gender,
                password: hash,
                age: user.age,
              },
            });
          } catch (error) { 
            console.log(error)
          }
        });
      });
      // this.MailController.sendPassword(user.email, password, user.username);
    }
  }

  public async updateUser(id: string, user: User) {
    const exp = getDynamoExpression({
      Payload: {
        email: {
          $value: user.email,
        },
        username: {
          $value: user.username,
        },
        gender: {
          $value: user.gender,
        },
        age: {
          $value: user.age,
        },
      },
    });
    console.log(exp);
    const params: UpdateItemInput = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        pk: { S: `USER#ALL` },
        sk: { S: `USER#${id}` },
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

  public async getOneUser(id: string) {
    const userFound = UserModel.query({
      pk: "USER#ALL",
      sk: `USER#${id}`,
    }).exec();
    if ((await userFound).count == 0) {
      throw new HttpException(404, "Post doesn't exist");
    }
    return userFound;
  }
}
