export type UserRole = "admin" | "deliveryGuy" | "user";

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface IProduct {
  _id?: string;
  name: string;
  price: number;
  minimalTonnage: number;
  description: string;
  image: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateRoleRequest {
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
}

export interface RegisterResponse {
  message: string;
  id: string;
}

export interface ErrorResponse {
  message: string;
  error?: string;
}

export interface JWTPayload {
  email: string;
  role: UserRole;
}
