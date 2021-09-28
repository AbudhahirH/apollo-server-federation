const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const axios = require("axios");


class Transaction {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:3000' // json-server
    })
  }

  list() {
    return this.api.get('/transactions').then(res => res.data)
  }
  uno(id) {
    return this.api.get('/transactions/'+id).then(res => res.data)
  }
}
var transactions = new Transaction();

const typeDefs = gql`
  extend type Query {
    transaction(id:ID!): Transaction
    transactions: [Transaction]
  }

  type Transaction @key(fields: "id") {
    id: ID!
    accountId: String
    type: String
    amount:Float
  }

  extend type Account @key(fields: "id") {
    id: ID! @external
    transactions:[Transaction]
  }
`;

const resolvers = {
  Transaction: {
    __resolveReference(reference) {
      return fetchTransactionById(reference.id);
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
  Transaction: {
    account(transaction){
      return {__typeName:account, id:transaction.accountId};
    }
  },
  Account:{
     async transactions(account){
       const tx = await transactions.list();
      return tx.filter(t=>t.accountId === account.id);
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

server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`🚀 Transactions service Server ready at ${url}`);
});
