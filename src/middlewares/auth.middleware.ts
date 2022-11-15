import { NextFunction, Response,Request } from 'express';
import { verify } from 'jsonwebtoken';
import cmsModel from '../models/cms.model';
import { DataStoredInToken} from '../interfaces/users.interface';
import { HttpException } from '../../utils/error.utils';

const UserModel = cmsModel[1]

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const Authorization = (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);
    // console.log(Authorization)
    if (Authorization) {
      const secretKey: string = process.env.AWS_ACCESS_KEY_ID;
      const verificationResponse = verify(Authorization, secretKey) as DataStoredInToken;
      const userId = verificationResponse.id;
      // console.log(userId)
      const findUser = await UserModel.query(
        {
          pk: "USER#ALL",
          sk: `USER#${userId}`
        }).exec()
      // console.log(findUser)
      if (findUser) {
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export default authMiddleware;
