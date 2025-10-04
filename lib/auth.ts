// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";  
import { SupabaseAdapter } from "@next-auth/supabase-adapter"
import { sendVerificationRequest } from "./sendVerificationRequest";


export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.APPLE_DB_SUPABASE_URL!,
    secret: process.env.APPLE_DB_SUPABASE_ANON_KEY!,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST!,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
      },
      from: process.env.EMAIL_FROM!,
      sendVerificationRequest,
    }),
  ],
  pages: {
    signIn: "/auth",
    verifyRequest: "/verify-request",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async signIn({ account, profile }) {
      console.log("user oauth login",account, profile);
      
      if (account?.provider === 'google') {
        return true;
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};