export interface User {
    role: String;
    email: string;
    username:String;
    gender:String;
    age:Number;
    image:String
}
export interface DataStoredInToken {
    id: number;
    role:string
  }
  
  export interface TokenData {
    token: string;
    expiresIn: number;
  }