// Run --> node index.js
debugger
require('dotenv').config();
const gql = require('graphql-tag');
const ApolloClient = require('apollo-boost').ApolloClient;
const fetch = require('cross-fetch/polyfill').fetch;
const createHttpLink = require('apollo-link-http').createHttpLink;
const InMemoryCache = require('apollo-cache-inmemory').InMemoryCache;
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
    mutation CreateAccount($input: CreateAccountInput!) { createAccount(input: $input) { id,customerId,alias,balance,active}}
    `,
    variables: {
        "input": {
            "id": "10",
            "customerId": "3",
            "alias": "savings044",
            "balance": 3200,
            "active": true
        }}
}).then(job => {
    console.log(job);
})

// Query
client.query({
    query: gql`
    query {accounts {active}customers {active}transactions {active}}
    `,
}).then(job => {
    console.log(job);
})