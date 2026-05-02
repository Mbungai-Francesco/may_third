import type { Wish } from "./Wish";

export interface User {
	id: string;
	names: string;
	email: string;
	password: string;
  jwt?: string;
	phone?: string;
	role: UserRole;
	pic?: string;
	receivedWishes: Wish[];
	authoredWishes: Wish[];

  town ?:string
}

export interface UserCreateDTO {
	names: string;
	email: string;
	password: string;
	town?: string;
}

export interface LoginDTO{
  email: string
  password: string
}

export interface UserUpdateDTO{
  names?: string
  email?: string
  phone?: string
  town?: string
}

export enum UserRole{
  ADMIN = 'ADMIN',
  USER = 'USER',
  CELEBRANT = 'CELEBRANT'
} 