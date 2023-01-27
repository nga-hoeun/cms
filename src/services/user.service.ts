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
import Generator from "generate-password";
import { v4 as uuidv4 } from "uuid";
import { getDynamoExpression } from "../utils/dynamoose.util";
import { UserModel } from "@/models/cms.model";
import MailController from "../ mail/registerEmail";
import { ParsedQs } from "qs";

const ddb = new dynamoose.aws.sdk.DynamoDB({
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
      const userRole = userInfo.role;
      const userId = userToFind[0].id;
      const validPassword = await bcrypt.compare(password, userInfo.password);
      if (validPassword) {
        const tokenData = this.createToken(userToFind[0]);
        return { tokenData, userId, userRole };
      } else {
        throw new HttpException(403, "Wrong Password!!");
      }
    } else {
      throw new HttpException(403, "Wrong Email Address!!");
    }
  }

  public createToken(user: AnyDocument): TokenData {
    const dataStoredInToken: DataStoredInToken = {
      id: user.id,
      role: user.Payload.role,
    };
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
    if (userToFind.count != 0) {
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
      const hashedPass = await new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function(err, hash) {
          if (err) reject(err)
          resolve(hash)
        });
      })
      this.MailController.sendPassword(user.email, password, user.username);
      try {
        await UserModel.create({
          id: userId,
          pk: `USER#ALL`,
          sk: `USER#${userId}`,
          Payload: {
            role: user.role,
            username: user.username,
            email: user.email,
            gender: user.gender,
            password: hashedPass,
            age: user.age,
            image: user.image,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  }


  public async updateUser(id: string, user: User) {
    const exp = getDynamoExpression({
      Payload: {
        email: {
          $value: user.email,
        },
        role: {
          $value: user.role,
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
        image: {
          $value: user.image,
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
      throw new HttpException(404, "User doesn't exist");
    }
    return userFound;
  }
  public async filterUser(
    id: string,
    gender: string | ParsedQs | string[] | ParsedQs[],
    name: string | ParsedQs | string[] | ParsedQs[],
    age: string | ParsedQs | string[] | ParsedQs[]
  ) {
    var userFound = [];
    const listUser = await this.getListUser(id);
    console.log(listUser);
    console.log({ gender: gender, name: name, age: age });

    if (gender == "" && (age == "null" || age == "") && name == "") {
      userFound = listUser;
      console.log("ALL");
    } else if (gender == "" && (age == "null" || age == "")) {
      listUser.forEach((user) => {
        if (user.Payload.username == name) {
          userFound.push(user);
        }
      });
      console.log("Name");
    } else if (gender == "" && name == "") {
      listUser.forEach((user) => {
        if (user.Payload.age == age) {
          userFound.push(user);
        }
      });
      console.log("Age");
    } else if (name == "" && (age == "null" || age == "")) {
      listUser.forEach((user) => {
        if (user.Payload.gender == gender) {
          userFound.push(user);
        }
      });
      console.log("Gender");
    } else if (gender == "") {
      listUser.forEach((user) => {
        if (user.Payload.age == age && user.Payload.username == name) {
          userFound.push(user);
        }
      });
      console.log("Age and Name");
    } else if (age == "null" || age == "") {
      listUser.forEach((user) => {
        if (user.Payload.gender == age && user.Payload.username == name) {
          userFound.push(user);
        }
      });
      console.log("Gender and Name");
    } else if (name == "") {
      listUser.forEach((user) => {
        if (user.Payload.age == age && user.Payload.gender == gender) {
          userFound.push(user);
        }
      });
      console.log("Age and Gender");
    } else {
      listUser.forEach((user) => {
        if (
          user.Payload.age == age &&
          user.Payload.username == name &&
          user.Payload.gender == gender
        ) {
          userFound.push(user);
        }
      });
      console.log("All category met");
    }
    console.log(userFound);
    return userFound;
  }

  public async getListUser(id: string) {
    console.log(id);
    const usersToFind = [];
    const users = await UserModel.query({
      pk: "USER#ALL",
    }).exec();
    users.toJSON().forEach((user: { id: string }) => {
      if (user.id != id) {
        usersToFind.push(user);
      }
    });
    if (users.count == 0) {
      throw new HttpException(404, "Users not found!");
    }
    return usersToFind;
  }

  public async deleteOneUser(id: string) {
    console.log(id);
    const postFound = await UserModel.query({
      pk: "USER#ALL",
      sk: `USER#${id}`,
    }).exec();
    console.log(postFound);
    if (postFound.count == 0) {
      throw new HttpException(404, "User doesn't exist");
    }
    await UserModel.delete({ pk: `USER#ALL`, sk: `USER#${id}` });
  }
}
