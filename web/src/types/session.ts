export type AuthMode = "signIn" | "register";

export type Credentials = {
  username: string;
  password: string;
};

export type SessionDto = {
  access_token: string;
  token_type: string;
};
