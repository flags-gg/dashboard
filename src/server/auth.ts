import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

import { env } from "~/env";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      access_token?: string;
    } & DefaultSession["user"];
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: ({ token, account }) => {
      // Persist the access_token to the token right after signin
      if (account) {
        token.access_token = account.access_token;
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          access_token: token.access_token,
        },
      };
    },
  },
  providers: [
    KeycloakProvider({
      clientId: env.KEYCLOAK_ID,
      clientSecret: env.KEYCLOAK_SECRET,
      issuer: env.KEYCLOAK_ISSUER,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
