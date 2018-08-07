'use strict';

const { PubSub } = require('apollo-server');
const { Message } = require('../models');
require('dotenv').config();
const MESSAGE_ADDED = 'MESSAGE_ADDED';

const pubsub = new PubSub();


// Define resolvers
const resolvers = {
    Query: {
        // Fetch all messages
        async allMessages() {
            return await Message.all();
        },
  
        // Get a message by ID
        async fetchMessage(_, { id }) {
            return await Message.findById(id);
        },
    },
    Mutation: {
        // Create new message
        async createMessage(_, { text }) {
            pubsub.publish(MESSAGE_ADDED, { messageAdded: 'ok' });
            return await Message.create({
                text
            });
        },
        // Update a particular message
        async updateMessage(_, { id, text}) {
            // fetch the user by it ID
            const message = await Message.findById(id);
            // Update the user
            await message.update({
                text
            });
            return message;
        },
    },
    Subscription: {
        messageAdded: {
          // Additional event labels can be passed to asyncIterator creation
          subscribe: () => pubsub.asyncIterator([MESSAGE_ADDED]),
        },
    },
    
}


/*

*/
module.exports = resolvers;