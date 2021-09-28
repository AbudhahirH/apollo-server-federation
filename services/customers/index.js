const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const axios = require("axios");


class Customer {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3000' // json-server
    })
  }

  list() {
    return this.api.get('/customers').then(res => res.data)
  }
  uno(id) {
    return this.api.get('/customers/'+id).then(res => res.data)
  }
}
var customers = new Customer();

const typeDefs = gql`
  extend type Query {
    customer(id:ID!):Customer
    customers: [Customer]
  }

  type Customer @key(fields: "id") {
    id: ID!
    firstName: String
    lastName: String
    active: Boolean
  }

`;

const resolvers = {
  Customer: {
    __resolveReference(reference) {
      return fetchCustomerById(reference.id);
    }
  },
  Query: {
    customers(_, args) {
      return customers.list();
    },
    customer(_,{id}){
      return customers.uno(id);
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

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀 Customers service Server ready at ${url}`);
});
