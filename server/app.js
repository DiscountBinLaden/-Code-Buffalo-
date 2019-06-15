const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const { ApolloServer, gql } = require('apollo-server');

const app = express();

mongoose.connect("mongodb+srv://dbUser:dbuserpass@database-pkdd1.azure.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });
mongoose.connection.once("open", () => {
    console.log("Connected to MongoDB");
})

const typeDefs = gql`
  type Event {
    activity: String!
    accessibility: Float!
    type: String!
    participants: Int!
    price: Float!
    key: Int!
  }

  type Query {
    event(price: Float!): Event
    events: [Event]
  }
`;

const resolvers = {
    Query: {
        event: (root, { price }, { dataSources }) =>
            dataSources.BoredAPI.getEventP(price),
        events: (root, args, { dataSources }) => dataSources.BoredAPI.getRandomEvent(),
    }
};

app.use('/graphql', graphqlHTTP({
    typeDefs,
    resolvers,
    schema,
    graphiql: true,
    dataSources: () => ({
        BoredAPI: new BoredAPI(),
    })
}));

app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});
