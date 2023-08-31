import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from "@apollo/subgraph";
import gql from "graphql-tag";
import Resolvers from './resolvers';
import {readFileSync} from 'fs';

const main = async () => {
  const server = new ApolloServer({
    resolvers: Resolvers,
    typeDefs: buildSubgraphSchema(gql(readFileSync('./schema.graphql', 'utf-8'))),
  });

  const { url } = await startStandaloneServer(server, {
    // Note: This example uses the `req` argument to access headers,
    // but the arguments received by `context` vary by integration.
    // This means they vary for Express, Fastify, Lambda, etc.

    // For `startStandaloneServer`, the `req` and `res` objects are
    // `http.IncomingMessage` and `http.ServerResponse` types.
    context: async ({ req, res }) => {
      // Get the user token from the headers.
      const token = req.headers.authorization || '';

      // Try to retrieve a user with the token
      // const user = await getUser(token);

      // Add the user to the context
      return { user: 'whatever' };
    },
  });
  console.log(`🚀 Server listening at: ${url}`);
}
main();

