export interface User{
  id : string
  names: string
  email: string
  password: string
  phone?: string
  role: UserRole
  pic ?: string
  town ?: string
}

export interface UserCreateDTO{
  names: string
  email: string
  password: string
}

export interface LoginDTO{
  email: string
  password: string
}

export interface UserUpdateDTO{
  names: string
  email: string
  phone?: string
  town ?: string
}

export enum UserRole{
  ADMIN = 'ADMIN',
  USER = 'USER',
  CELEBRANT = 'CELEBRANT'
} 