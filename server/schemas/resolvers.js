const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async (context) => {
            if (context.user) {
              return User.findOne({ _id: context.user._id }).populate('books');
            }
            throw new AuthenticationError('Please login');
          },
    },
    Mutation: {
        addUser: async ({ username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
          },
          login: async ({ email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
              throw new AuthenticationError('Cannot find a user with this email');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Password not correct');
            }
      
            const token = signToken(user);
      
            return { token, user };
          },
          saveBook: async (context) => {
            if (context.user) {
            const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: newBook }},
                { new: true }

          );
              return updatedUser;
            }
            throw new AuthenticationError('You are not logged in');
          },
          removeBook: async (context) => {
            if (context.user) {
              const updatedUser = await User.findOneAndUpdate(
                {_id: context.user._id},
                {$pull: {savedBooks:{bookId}}},
                {new: true}
              );
              return updatedUser;
            }
            throw new AuthenticationError('You are not logged in');
          },
        },
    };

    module.exports = resolvers;
