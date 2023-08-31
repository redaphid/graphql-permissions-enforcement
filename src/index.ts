import {readFileSync} from 'fs';
import {gql} from 'graphql-tag';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from "@apollo/subgraph";
import Resolvers from './resolvers';

const main = async () => {
  const typeDefs = buildSubgraphSchema(gql(readFileSync('./schema.graphql', 'utf-8')))

  const server = new ApolloServer({
    resolvers: Resolvers,
    typeDefs,
  });

  const { url } = await startStandaloneServer(server, {});
  console.log(`🚀 Server listening at: ${url}`);
}
main();

