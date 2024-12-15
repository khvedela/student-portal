export interface User {
  id?: string;
  username?: string;
  phoneNumber?: string;
  userType: 'admin' | 'student';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
