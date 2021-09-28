const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const axios = require("axios");


class Account {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3000' // json-server
    })
  }

  list() {
    return this.api.get('/accounts').then(res => res.data)
  }
  uno(id) {
    return this.api.get('/accounts/'+id).then(res => res.data)
  }

  // mutation
  create(data) {
    return this.api.post('/accounts', data).then(res => res.data)
  }
  update(id, data) {
    return this.api.patch(`/accounts/${id}`, data).then(res => res.data)
  }
  delete(id) {
    return this.api.delete(`/accounts/${id}`).then(() => ({ id }))
  }
}
var accounts = new Account();

const typeDefs = gql`
  extend type Query {
    account(id:ID!): Account
    accounts: [Account]
  }

  type Account @key(fields: "id") {
    id: ID!
    customerId: String
    alias: String
    balance:Float
    active:Boolean
  }

  extend type Customer @key(fields: "id") {
    id: ID! @external
    accounts:[Account]
  }

  type Mutation {
    createAccount(input: CreateAccountInput!): Account
    updateAccount(id: Int!, input: CreateAccountInput!): Account
    deleteAccount(id: String!): Account
  }
  input CreateAccountInput {
    id: ID!
    customerId: String
    alias: String
    balance:Float
    active:Boolean
  }
`;

const resolvers = {
  Account: {
    __resolveReference(reference) {
      return fetchAccountById(reference.id);
    }
  },
  Query: {
    accounts() {
      return accounts.list();
    },
    account(_,{id}){
      return accounts.uno(id);
    }
  },
  Account: {
    customer(account){
      return {__typeName:customer, id:account.customerId};
    }
  },
  Customer:{
     async accounts(customer){
       const acc = await accounts.list();
      return acc.filter(ac=>ac.customerId === customer.id);
    }
  },
  Mutation: { // mutation
    createAccount(source, args) {
      return accounts.create(args.input)
    },
    updateAccount(source, args) {
      return accounts.update(args.id, args.input)
    },
    deleteAccount(source, args) {
      return accounts.delete(args.id)
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Accounts service Server ready at ${url}`);
});
