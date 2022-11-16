import { User } from "../interfaces/users.interface";

 export const isEmpty = (user:User): boolean => {
    if(user.email == null 
    || user.gender == null
    || user.username == null
    || user.age == null){
        return true
    }else{
        return false
    }
  };
  