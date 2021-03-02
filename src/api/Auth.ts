import { HttpClient } from "./HttpClient";

export const Login = (username: string, password: string) => (
  HttpClient<UserType>(
    "public/login",
    {
      body: { "username": username, "password": password }
    }
  )
);

export const Register = (
  username: string,
  email: string,
  password: string
) => (
  HttpClient<ResponseObject>(
    "public/signup",
    {
      body: {
        "username": username,
        "email": email,
        "password": password
      }
    }
  )
);

export const ConfirmRegistration = (id: number, hash: string) => (
  HttpClient<ResponseObject>(`public/signup/confirm/${id}/${hash}`)
);

export const RecoverAccount = (username: string, email: string) => (
  HttpClient<ResponseObject>(
    "public/recover",
    {
      body: { "username": username, "email": email }
    }
  )
);

export const RecoverAccountConfirm = (id: number, hash: string) => (
  HttpClient<ResponseObject>(`public/recover/confirm/${id}/${hash}`)
);

export const Logout = () => HttpClient<ResponseObject>("public/logout");