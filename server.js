import express from 'express';
import { createServer } from 'http';

import { ApolloServer } from 'apollo-server-express';

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('C:\\Certbot\\live\\api.dreammakers.ae\\privkey.pem', 'utf8');
var certificate = fs.readFileSync('C:\\Certbot\\live\\api.dreammakers.ae\\fullchain.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};


import typeDefs  from './data/schema';
import resolvers from './data/resolvers';

const PORT = process.env.PORT ||  5000;
const PORT_HTTP = process.env.PORT_HTTP ||  6000;

const app = express();

const apolloServer = new ApolloServer({ typeDefs, resolvers });
apolloServer.applyMiddleware({ app });

const httpsServer = https.createServer(credentials, app);
apolloServer.installSubscriptionHandlers(httpsServer);
//------------------------------------------------------------------------------//
httpsServer.listen({ port: PORT }, () =>{
  console.log(`🚀 Server ready at https://localhost:${PORT}${apolloServer.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at wss://localhost:${PORT}${apolloServer.subscriptionsPath}`)
})
//------------------------------------------------------------------------------//
const httpServer = http.createServer(app);
apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: PORT_HTTP }, () =>{
  console.log(`🚀 Server ready at http://localhost:${PORT_HTTP}${apolloServer.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${PORT_HTTP}${apolloServer.subscriptionsPath}`)
})
