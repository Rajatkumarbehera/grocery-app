"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

type ProviderProps = {
  children: React.ReactNode;
};

export default function SessionProvider({ children }: ProviderProps) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
