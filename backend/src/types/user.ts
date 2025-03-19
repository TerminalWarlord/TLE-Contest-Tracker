import { Request } from "express"

export interface CustomRequest extends Request {
    userId?: string
}

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN',
  }