import "reflect-metadata";

import { allow, and, not, or, rule, shield } from "graphql-shield";

import { ApolloServer } from "apollo-server";
import { PrismaClient } from "@prisma/client";
import { TodoResolver } from "./resolvers/TodoResolver";
import { User } from "./model/User";
import { UserResolver } from "./resolvers/UserResolver";
import { applyMiddleware } from "graphql-middleware";
import { buildSchema } from "type-graphql";
import jwt from "jsonwebtoken";
import { privateKey } from "./constants";

export type Context = {
  prisma: PrismaClient;
  user?: User;
};
const prisma = new PrismaClient();

const getUser = async (authorization?: string) => {
  try {
    if (authorization) {
      const { id }: any = jwt.verify(authorization, privateKey);
      const user = await prisma.user.findOne({ where: { id } });
      return user;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
    return null;
  }
};

const isAuthenticated = rule({ cache: "contextual" })(
  async (_parent, _args, ctx) => {
    if (ctx.user) {
      return true;
    } else {
      return false;
    }
  }
);

const permissions = shield(
  {
    Query: {
      "*": isAuthenticated,
      login: allow,
    },
    Mutation: {
      "*": isAuthenticated,
      register: allow,
    },
  },
  {
    allowExternalErrors: true,
  }
);

async function main() {
  const schema = await buildSchema({
    resolvers: [UserResolver, TodoResolver],
    validate: false,
  });

  applyMiddleware(schema, permissions);

  const server = new ApolloServer({
    schema,
    playground: true,
    context: async ({ req }) => ({
      prisma,
      user: await getUser(req.headers.authorization),
    }),
  });

  const { port } = await server.listen(4000);
  console.log(`GraphQL is listening on ${port}!`);
}

main().catch(console.error);
