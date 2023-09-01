import { readFileSync } from 'fs';
import { gql } from 'graphql-tag';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from "@apollo/subgraph";
import Resolvers from './resolvers';
import {PublicDirectiveTransformer} from './directives/public';
import { makeExecutableSchema } from '@graphql-tools/schema';

const main = async (isPublic: Boolean) => {
  const typeDefs = buildSubgraphSchema(gql(readFileSync('./schema.graphql', 'utf-8')))

  let schema = makeExecutableSchema({ typeDefs, resolvers: Resolvers });
  if(isPublic) {
    schema = PublicDirectiveTransformer(schema);
  }

  const server = new ApolloServer({schema});

  const { url } = await startStandaloneServer(server, {});
  console.log(`🚀 Server listening at: ${url}`);
}
// get the first argument passed to the script. pass to main wether the argument is 'public' or not
const arg = process.argv[2];
console.log(arg);
main(arg === '--public');

