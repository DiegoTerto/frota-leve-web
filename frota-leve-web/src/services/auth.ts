import api from "@/lib/axios-config";

type SignInRequestType = {
  email: string;
  password: string;
}

type LoginResponseType = {
  token: string;
  tokenExpirationAt: string;
  refreshToken: string;
  refreshTokenExpirationAt: string;
  email: string;
  name: string;
  businessId: string;
  businessName: string;
}

export async function signInRequest(data: SignInRequestType) {
  const response = await api.post('/api/auth', data);

  const {
    token,
    tokenExpirationAt,
    refreshToken,
    refreshTokenExpirationAt,
    email,
    name,
    businessId,
    businessName,
  }: LoginResponseType = response.data;

  return {
    token,
    tokenExpirationAt,
    refreshToken,
    refreshTokenExpirationAt,
    user: {
      email,
      name,
      businessId,
      businessName,
    }
  }
}

export async function getMe() {
  const response = await api.get('/api/user/me');

  const {
    email,
    name,
    businessId,
    businessName,
  }: LoginResponseType = response.data;

  return {
    user: {
      email,
      name,
      businessId,
      businessName,
    }
  }
}