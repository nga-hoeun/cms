export interface User {
    email: string;
    username:String;
    gender:String;
    age:Number;
}
export interface DataStoredInToken {
    id: number;
  }
  
  export interface TokenData {
    token: string;
    expiresIn: number;
  }