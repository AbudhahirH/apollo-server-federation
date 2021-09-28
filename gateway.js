// const { ApolloServer } = require("apollo-server");
// const { ApolloGateway } = require("@apollo/gateway");

// const gateway = new ApolloGateway({
//   // This entire `serviceList` is optional when running in managed federation
//   // mode, using Apollo Graph Manager as the source of truth.  In production,
//   // using a single source of truth to compose a schema is recommended and
//   // prevents composition failures at runtime using schema validation using
//   // real usage-based metrics.
//   serviceList: [
//     { name: "transactions", url: "http://localhost:4003/graphql" },
//     { name: "accounts", url: "http://localhost:4001/graphql" },
//     { name: "customers", url: "http://localhost:4002/graphql" }
//   ],

//   // Experimental: Enabling this enables the query plan view in Playground.
//   __exposeQueryPlanExperimental: false,
// });

// (async () => {
//   const server = new ApolloServer({
//     gateway,

//     // Apollo Graph Manager (previously known as Apollo Engine)
//     // When enabled and an `ENGINE_API_KEY` is set in the environment,
//     // provides metrics, schema management and trace reporting.
//     engine: false,

//     // Subscriptions are unsupported but planned for a future Gateway version.
//     subscriptions: false,
//   });

//   server.listen().then(({ url }) => {
//     console.log(`🚀 Server ready at ${url}`);
//   });
// })();


const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');
const { readFileSync } = require('fs');

const supergraphSdl = readFileSync('./supergraph.graphql').toString();

const gateway = new ApolloGateway({
  supergraphSdl
});

const server = new ApolloServer({
  gateway,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Gateway ready at ${url}`);
}).catch(err => {console.error(err)});
