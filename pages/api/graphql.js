import { gql, ApolloServer } from "apollo-server-micro";
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";

// defined typedefs in graphql schema to communicate with neo4j database.
const typeDefs = gql`
  type Title {
    show_id: String
    Title: String

    release: Release @relationship(type: "Released_in", direction: OUT)
    director: Director @relationship(type: "Directed", direction: IN)
    country: Country @relationship(type: "Made_in", direction: OUT)
  }

  type Release {
    release_year: String
    show_id: String
    title: [Title] @relationship(type: "Released_in", direction: IN)
  }
  type Director {
    director: String
    show_id: String
    title: Title @relationship(type: "Directed", direction: OUT)
  }

  type Country {
    show_id: String
    country: String
    title: [Title] @relationship(type: "Made_in", direction: IN)
  }
`;

// communicate with auraDB using neo4jdriver
const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS)
);

// Neo4jGraphql library will converts neo4j database to graphql database
const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

// apollo server will get neoschema
const apolloServer = new ApolloServer({
  schema: neoSchema.schema,
});

const startServer = apolloServer.start();

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({
    path: "/api/graphql",
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
