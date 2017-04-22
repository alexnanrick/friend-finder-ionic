export class User {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  
  constructor(username: string) {
    this.username = username;
  }
}