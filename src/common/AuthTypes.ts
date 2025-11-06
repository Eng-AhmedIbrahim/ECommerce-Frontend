import type { Product } from "./ProductTypes";

export interface LoginResponseDto {
  userId:string;
  message?: string;
  userName: string;
  email: string;
  isEmailConfirmed: boolean;
  token: string;
  tokenExpiresOn: string;
  isAuthenticated: boolean;
  roles?: string[];
}

export interface AuthState {
  user: LoginResponseDto | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

export interface UserWishlist {
  user: LoginResponseDto | null;
  products: Product[] | null;
}

export interface UserRegisterDto {
  fullName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  hasAcceptedTerms: boolean;
  password: string;
  profilePicture?: File | null;
}
