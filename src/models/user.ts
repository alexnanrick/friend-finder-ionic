import { Geometry } from './geometry';

export class User {
  private username: string;
  private email: string;
  private firstname: string;
  private lastname: string;
  private geometry: Geometry;

  constructor(username: string, email: string, firstname: string, lastname: string, geometry: Geometry) {
    this.setUsername(username);
    this.setEmail(email);
    this.setFirstname(firstname);
    this.setLastname(lastname);
    this.setGeometry(geometry);
  }

  getUsername(): string {
    return this.username;
  }

  setUsername(value: string) {
    this.username = value;
  }

  getEmail(): string {
    return this.email;
  }

  setEmail(value: string) {
    this.email = value;
  }

  getFirstname(): string {
    return this.firstname;
  }

  setFirstname(value: string) {
    this.firstname = value;
  }

  getLastname(): string {
    return this.lastname;
  }

  setLastname(value: string) {
    this.lastname = value;
  }
  
  getGeometry(): Geometry {
    return this.geometry;
  }
  
  setGeometry(value: Geometry) {
    this.geometry = value;
  }
}
