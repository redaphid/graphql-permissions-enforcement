import { readFileSync } from 'fs';
import { gql } from 'graphql-tag';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from "@apollo/subgraph";
import Resolvers from './resolvers';
import {PublicDirectiveTransformer} from './directives/public';
import { makeExecutableSchema } from '@graphql-tools/schema';
import {readdir, readFile} from 'fs/promises';

const buildPublicAndPrivateServers = async (dir: string) => {
  const fileNames = await readdir(dir)
  const schemaFiles = fileNames.filter(fileName => fileName.endsWith('.graphql'))
  for(const f of schemaFiles) {
    const schemaString = await readFile(f, 'utf-8')
    const typeDefs = await buildSubgraphSchema(gql(schemaString))
    const privateSchema = makeExecutableSchema({ typeDefs, resolvers: Resolvers });
    const publicSchema = PublicDirectiveTransformer(privateSchema);
    const privateServer = new ApolloServer({schema: privateSchema});
    const publicServer = new ApolloServer({schema: publicSchema});
    const priv = await startStandaloneServer(privateServer,{listen: {port: 4000}});
    console.log(`Private server ready at ${priv.url}`);
    const pub = await startStandaloneServer(publicServer, {listen: {port: 4001}});
    console.log(`Public server ready at ${pub.url}`);
  }
}

const main = async (isPublic: Boolean) => {
  const typeDefs = buildSubgraphSchema(gql(readFileSync('./schema.graphql', 'utf-8')))

  let schema = makeExecutableSchema({ typeDefs, resolvers: Resolvers });
  if(isPublic) {
    schema = PublicDirectiveTransformer(schema);
  }

  const servers = await buildPublicAndPrivateServers('.');
}
// get the first argument passed to the script. pass to main wether the argument is 'public' or not
const arg = process.argv[2];
console.log(arg);
main(arg === '--public');

