// Run using node --> node index.js
// Run using html --> open index.html in browser

const dotenv = require('dotenv').config();
const gql = require('graphql-tag');
const ApolloClient = require('apollo-boost').ApolloClient;
const createHttpLink = require('apollo-link-http').createHttpLink;
const fetch = require('cross-fetch/polyfill').fetch;
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;
const ApolloLinkContext = require('apollo-link-context');
const ApolloLink = require('apollo-link');

process.env.API = "http://localhost:4000/graphql";
const client = new ApolloClient({
    link: createHttpLink({
        uri: process.env.API,
        fetch: fetch
    }),
    cache: new InMemoryCache()
});

// Mutation
client.mutate({
    mutation: gql`
    mutation {
        createCustomer(firstName: "Tom", lastName: "Holland") {
          customerId
        }
      }
    `
}).then(res => {
    console.log("mutation response : ", res);
})

// Query
client.query({
    query: gql`
    query{
        customer(customerId: 1) {
          firstName
          lastName
          customerId
          active
        }
      }
    `,
}).then(res => {
    console.log("query response : ", res);
})