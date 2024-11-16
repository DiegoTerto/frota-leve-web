'use client'

import { getMe, signInRequest } from "@/services/auth";
import { createContext, useEffect, useState } from "react";
import { parseCookies, setCookie } from 'nookies';
import { useRouter } from "next/navigation";

export const AuthContext = createContext({} as AuthContextType)

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  signIn: (data: SignInData) => Promise<void>
}

type SignInData = {
  email: string;
  password: string
}

type User = {
  name: string;
  email: string;
  businessId: string;
  businessName: string;
}

export function AuthProvider({ children }: any) {
  const router = useRouter()

  const [ user, setUser ] = useState<User>({
    name: '',
    email: '',
    businessId: '',
    businessName: '',
  })

  const isAuthenticated = !!user;

  useEffect(() => {
    const { token } = parseCookies()

    if (token) {
      getMe().then((respone) => setUser(respone.user))
    } else {
      router.push('/login')
    }
  }, [])

  async function signIn({ email, password }: SignInData) {
    const { token, tokenExpirationAt, user } = await signInRequest({ email, password });

    setCookie(undefined, 'token', token, {
      expires: new Date(tokenExpirationAt)
    })

    setUser(user)

    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider