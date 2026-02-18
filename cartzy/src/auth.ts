import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import connectDB from "./lib/db";
import User from "./models/user.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      // Runs when user clicks "Login button" with email/password.
      authorize: async (credentials) => {
        await connectDB();

        const email = credentials.email;
        const password = credentials.password as string;

        const user = await User.findOne({ email });
        
        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  // Runs when user logs in with Google, whether the user is new or existing.
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();

        let DbUser = await User.findOne({ email: user.email });

        if (!DbUser) {
          DbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
          });
        }

        user.id = DbUser._id.toString();
        user.role = DbUser.role;
      }
      return true;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }

      if (trigger === "update") {
        token.role = session.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  // Redirects user to /login instead of default NextAuth UI
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // Session expires after 10 days
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
});

// Email/Password Login
// 1. User submits login form
// 2. authorize() runs
// 3. Password verified via bcrypt
// 4. JWT created
// 5. Session sent to frontend

// Google Login
// 1. Google OAuth success
// 2. signIn() callback runs
// 3. User saved to DB if new
// 4. JWT created
// 5. Session sent to frontend
