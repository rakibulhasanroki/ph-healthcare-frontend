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

export interface IRegisterResponse {
  success: boolean;
  message?: string;
  patientData?: {
    id: string;
    name: string;
    email: string;
    contactNumber: string | null;
    address: string | null;
    profilePhoto: string | null;
    isDeleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
  };
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    status: string;
    emailVerified: boolean;
    needsPasswordChange: boolean;
    image?: string | null;
    isDeleted: boolean;
    deletedAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
  };
}
