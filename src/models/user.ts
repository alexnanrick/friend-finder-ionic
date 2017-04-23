import { Geometry } from './geometry';

export class User {
  private _username: string;
  private _email: string;
  private _firstname: string;
  private _lastname: string;
  private _geometry: Geometry;


  constructor(username: string, email: string, firstname: string, lastname: string, geometry: Geometry) {
    this._username = username;
    this._email = email;
    this._firstname = firstname;
    this._lastname = lastname;
    this._geometry = geometry;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get firstname(): string {
    return this._firstname;
  }

  set firstname(value: string) {
    this._firstname = value;
  }

  get lastname(): string {
    return this._lastname;
  }

  set lastname(value: string) {
    this._lastname = value;
  }

  get geometry(): Geometry {
    return this._geometry;
  }

  set geometry(value: Geometry) {
    this._geometry = value;
  }
}
