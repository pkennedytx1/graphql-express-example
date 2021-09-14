const express = require('express');
const express_graphql = require('express-graphql').graphqlHTTP
const { buildSchema } = require('graphql');

// GraphQL schema
const schema = buildSchema(`
    type Query {
        roaster(id: Int!): Roaster
        roastersByLocation(location: String): [Roaster]
    },
    type Mutation {
        createRoaster(input: CreateRoasterInput): Roaster
    },
    type Roaster {
        id: Int
        name: String
        location: String
        url: String
    },
    input CreateRoasterInput {
        id: Int!,
        name: String!,
        location: String!,
        url: String!,
    }
`);

// Mock data base data
const roasterData = [
    {
        id: 1,
        name: 'Merit Coffee Co.',
        location: 'San Antonio, Texas',
        url: 'https://meritcoffee.com/'
    },
    {
        id: 2,
        name: 'Oak Cliff Coffee Roasters',
        location: 'Dallas, Texas',
        url: 'https://www.oakcliffcoffee.com/'
    },
    {
        id: 3,
        name: 'Austin Roasting Company',
        location: 'Austin, Texas',
        url: 'https://austinroastingcompany.com/'
    },
    {
        id: 4,
        name: 'Wild Gift Coffee',
        location: 'Austin, Texas',
        url: 'https://wildgiftcoffee.com/'
    }
];

// Service (this is what would access the db and do the correct query)
const getRoaster = function(args) { 
    var id = args.id;
    return roasterData.filter(roaster => {
        return roaster.id === id;
    })[0];
};

const getRoasters = function(args) {
    if (args.location) {
        var location = args.location;
        return roasterData.filter(roaster => roaster.location === location);
    } else {
        return roasterData;
    }
};

const createRoaster = function(input) {
    const { id, name, location, url } = input.input;
    roasterData.push({ id, name, location, url})
    console.log(roasterData)
    return roasterData.filter(roaster => {
        return roaster.id === id;
    })[0];
}

// attaching the schema
const root = {
    roaster: getRoaster,
    roastersByLocation: getRoasters,
    createRoaster: createRoaster,
};

// Create an express server and a GraphQL endpoint
const app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));