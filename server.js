import express from 'express';
import { createServer } from 'http';

import { ApolloServer } from 'apollo-server-express';

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('C:\\Certbot\\live\\dmapi.walztech.com\\privkey.pem', 'utf8');
var certificate = fs.readFileSync('C:\\Certbot\\live\\dmapi.walztech.com\\fullchain.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};


import typeDefs  from './data/schema';
import resolvers from './data/resolvers';

const PORT = process.env.PORT ||  5000;

const app = express();

const apolloServer = new ApolloServer({ typeDefs, resolvers });
apolloServer.applyMiddleware({ app });

const httpsServer = https.createServer(credentials, app);
apolloServer.installSubscriptionHandlers(httpsServer);

httpsServer.listen({ port: PORT }, () =>{
  console.log(`🚀 Server ready at https://localhost:${PORT}${apolloServer.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at wss://localhost:${PORT}${apolloServer.subscriptionsPath}`)
})

// var httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

// httpServer.listen(4080, () => {
  // console.log("HTTP server starting on port : " + 4080)
// });
// httpsServer.listen(4000, () => {
  // console.log("HTTP'S' server starting on port : " + 4000)
// });