// lib/auth.ts
import { AuthConfig } from "@auth/core";
import CredentialsProvider from "@auth/core/providers/credentials";
import NextAuth from "next-auth"; // Add this for handlers
import { cookies, headers } from "next/headers";

const users = [
  {
    id: "1",
    email: "admin@voicesync.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "2",
    email: "director@voicesync.com",
    password: "director123",
    role: "director",
  },
];

// lib/auth.ts (updated snippet)
export const authOptions: AuthConfig = {
  secret: process.env.NEXTAUTH_SECRET || "bEx%.Wa6ezkRv<&Uj5B/YAK@Hf8yw[!S",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Credentials received:", credentials);
        if (!credentials?.email || !credentials?.password) return null;
        const user = users.find((u) => u.email === credentials.email);
        if (!user || user.password !== credentials.password) return null;
        console.log("User found:", user);
        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token", // Match what’s actually set
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      console.log("JWT callback - token:", token, "user:", user);
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.email = token.email;
      }
      console.log("Session callback - session:", session, "token:", token);
      return session;
    },
  },
  debug: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
