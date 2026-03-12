export interface ILoginResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: {
    needsPasswordChange: boolean;
    email: string;
    name: string;
    role: string;
    status: string;
    isDeleted: boolean;
    emailVerified: string;
    image: string;
  };
}
