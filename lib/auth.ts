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
      id?: string;
      role?: string | null;
      role_name?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string | null;
    role_id?: string | null;
    role_name?: string | null;
    email?: string | null;
  }
}

const USERS_TABLE = "user";

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.APPLE_DB_SUPABASE_URL!,
    secret: process.env.APPLE_DB_SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      from: process.env.EMAIL_FROM!,
      sendVerificationRequest,
    }),
  ],
  pages: {
    signIn: "/auth",
    verifyRequest: "/verify-request",
    signOut: "/auth",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user?.email) {
          const { data, error } = await supabase
            .from(USERS_TABLE)
            .select(
              `
              id,
              role_id,
              role:role_id (
                name
              )
            `
            )
            .eq("email", user.email)
            .single();


          if (!error && data) {
            const role = data.role as any;
            const roleName = role?.name ?? (Array.isArray(role) ? role[0]?.name : null);
            token.role_name = roleName;
            token.role_id = data?.role_id ?? null;
            token.userId = data?.id ?? null;
            token.email = user.email;
          } else {
            token.email = user.email;
            token.userId = token.userId ?? null;
            token.role_id = token.role_id ?? null;
            token.role_name = token.role_name ?? null;
            if (error) console.error("Supabase lookup failed in jwt callback");
          }
        }
      } catch (err) {
        console.error("JWT callback error");
      }
      return token;
    },

    async session({ session, token }) {
      try {
        return {
          ...session,
          user: {
            ...session.user,
            id: (token.userId as string) ?? session.user?.id,
            role_name: (token.role_name as string) ?? null,
            role: (token.role_id as string) ?? null,
          },
        };
      } catch (err) {
        console.error("Session mapping error");
        return session;
      }
    },

    async signIn({ account, user, profile }) {
      if (!user?.email) return false;
      try {
        const { data: existingUser, error: selectError } = await supabase
          .from(USERS_TABLE)
          .select("id, email, name, image, role_id, role(name)")
          .eq("email", user.email)
          .maybeSingle();

        if (selectError) {
          console.error("Error checking existing user", { selectError });
          return false;
        }

        if (!existingUser) {
          const insertPayload: Record<string, any> = {
            email: user.email,
            name: user.name || null,
            image: user.image || null
          };

          const { error: insertError } = await supabase
            .from(USERS_TABLE)
            .insert(insertPayload);

          if (insertError) {
            console.error("Error creating user record", insertError);
            return false;
          }
        } else {
          const updates: Record<string, any> = {};
          if (user.name && user.name !== existingUser.name) updates.name = user.name;
          if (user.image && user.image !== existingUser.image) updates.image = user.image;

          if (Object.keys(updates).length > 0) {
            const { error: updateError } = await supabase
              .from(USERS_TABLE)
              .update(updates)
              .eq("email", user.email);

            if (updateError) {
              console.error("Error updating user record");
            }
          }
        }

        return true;
      } catch (err) {
        console.error("SignIn callback error");
        return false;
      }
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        const dest = new URL(url);
        if (dest.origin === baseUrl) return url;
      } catch (e) {
        console.error("Redirect callback URL error:", e);
        return baseUrl;
      }
      return baseUrl;
    },
  },
};
