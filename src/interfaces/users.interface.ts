export interface User {
    email: string;
    username:String;
    gender:String;
    age:Number;
    profile:String
}
export interface DataStoredInToken {
    id: number;
  }
  
  export interface TokenData {
    token: string;
    expiresIn: number;
  }