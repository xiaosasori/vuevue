const {ApolloServer, AuthenticationError} = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config({path: 'variables.env'})
const User = require('./models/User')
const Post = require('./models/Post')

// Import typeDefs & resolvers
const resolvers = require('./resolvers')
const path = require('path')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const filePath = path.join(__dirname, 'typeDefs.gql')
const typeDefs = fs.readFileSync(filePath, 'utf-8')
// Connect to mlab database
const { ObjectId } = mongoose.Types;
ObjectId.prototype.valueOf = function () {
  return this.toString();
};
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true,  useCreateIndex: true })
    .then(()=>console.log(`DB connected`))
    .catch(err => console.log('Connect MongoDB error:',err))
// Verify JWT token passed from client
const getUser = async token => {
  if(token){
    try {
      return await jwt.verify(token, process.env.SECRET)
    } catch(err){
      throw new AuthenticationError('Your session has ended. Please sign in again.')
    }
  }
}
// Create graphql server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: error => ({
      name: error.name,
      message: error.message.replace("Context creation failed:", "")
    }),
    context: async ({req}) => {
      const token = req.headers['authorization']
      return { User, Post, currentUser: await getUser(token) }
    },
    introspection: true,
    playground: true
})
// Run
server.listen({port: process.env.PORT || 4000}).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});