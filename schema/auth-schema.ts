export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials extends LoginCredentials {
  username: string
  confirmPassword: string
}

export interface AuthResponse {
  user: {
    id: string
    email: string
    username: string
  }
  accessToken: string
}
