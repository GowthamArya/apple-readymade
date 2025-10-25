// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";  
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import { sendVerificationRequest } from "./sendVerificationRequest";
import { supabase } from "./supabaseServer";

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string; // Add id field
      role?: string | null;
      role_name: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}

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
    signOut: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      try {
        const { data, error } = await supabase
          .from("user")
          .select("*, role(*)")
          .eq("email", token.email)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
          return {
            ...session,
            user: {
              ...session.user,
              id: token.id as string,
              role_name: null,
              role: null,
            },
          };
        }

        return {
          ...session,
          user: {
            ...session.user,
            id: (token.id || data?.id) as string,
            role_name: data?.role?.name || null,
            role: data?.role_id || null,
          },
        };
      } catch (err) {
        console.error("Session callback error:", err);
        return session;
      }
    },

    async signIn({ account, user, profile }) {
      try {
        const { data: existingUser } = await supabase
          .from("user")
          .select("id, email")
          .eq("email", user.email)
          .single();

        if (!existingUser) {
          const { error: insertError } = await supabase
            .from("user")
            .insert({
              email: user.email,
              name: user.name,
              image: user.image,
              email_verified: new Date().toISOString(),
            });

          if (insertError) {
            console.error("Error creating user:", insertError);
            return false;
          }
        } else {
          await supabase
            .from("user")
            .update({
              email_verified: new Date().toISOString(),
              name: user.name,
              image: user.image,
            })
            .eq("email", user.email);
        }

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};
