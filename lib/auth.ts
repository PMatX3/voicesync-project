import { NextAuthOptions } from "@auth/core";
import { NextAuth } from "next-auth";
import CredentialsProvider from "@auth/core/providers/credentials";

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

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Credentials received:", credentials);
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password");
          return null;
        }

        const user = users.find((user) => user.email === credentials.email);

        if (user && user.password === credentials.password) {
          console.log("User found:", user);
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
        }

        console.log("No user found or password mismatch");
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT callback - token:", token, "user:", user);
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - session:", session, "token:", token);
      if (session.user && token.role) {
        session.user = {
          ...session.user,
          role: token.role as string,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

console.log("NextAuth handlers:", handlers);
