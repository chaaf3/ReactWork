const { ApolloServer, gql } = require("apollo-server");
const uuid = require("uuid"); //for generating _id's
const axios = require("axios");
const express = require("express");
const app = express();
const redis = require("redis");
const client = redis.createClient();
var pattern = new RegExp("^[1-9]\\d*$");
const accessKey = "dNT5rbnDhj9nCZW2UidvwUU2aLbdp_WM-myjK9oJgVQ";
const secretKey = "OQBZjC8RWSYbyZdy0XiX7DCzR-Sf-QcUcbul0QosxLw";
const urlEnd = "&client_id=dNT5rbnDhj9nCZW2UidvwUU2aLbdp_WM-myjK9oJgVQ";
const urlStart = "https://api.unsplash.com/photos/?page=";

const typeDefs = gql`
  type Query {
    unsplashImages(pageNum: Int): [ImagePost]
    binnedImages: [ImagePost]
    userPostedImages: [ImagePost]
  }
  type ImagePost {
    id: ID!
    url: String!
    posterName: String!
    description: String
    userPosted: Boolean!
    binned: Boolean!
  }
  type Mutation {
    uploadImage(
      url: String!
      description: String
      posterName: String!
    ): ImagePost
    updateImage(
      id: ID!
      url: String
      posterName: String
      description: String
      userPosted: Boolean
      binned: Boolean
    ): ImagePost
    deleteImage(id: ID!): ImagePost
  }
`;

const resolvers = {
  Query: {
    unsplashImages: async (_, args) => {
      let page = 1;
      let splash = [];
      let answer;
      if (args.pageNum) {
        page = args.pageNum;
      }
      try {
        splash = await axios.get(`${urlStart}${page}${urlEnd}`);
        answer = splash.data.map(async (x) => {
          let binnedAlready = await client.exists(x.id);
          return {
            id: x.id,
            url: x.urls.small,
            posterName: x.user.username,
            description: x.description,
            userPosted: false,
            binned: binnedAlready,
          };
        });
      } catch (e) {
        console.log(e);
      }
      return answer;
    },
    binnedImages: async (_, args) => {
      let binned = await client.keys("*");
      if (!binned) {
        res.send("userPosts empty");
        return [];
      } else {
        let holder = [];
        for (let x = 0; x < binned.length; x++) {
          let temp = JSON.parse(await client.get(binned[x]));
          if (temp.binned) {
            holder.push(temp);
          }
        }
        return holder;
      }
    },

    userPostedImages: async (_, args) => {
      let userPosted = await client.keys("*");
      if (!userPosted) {
        return [];
      } else {
        let holder = [];
        for (let x = 0; x < userPosted.length; x++) {
          let temp = JSON.parse(await client.get(userPosted[x]));
          if (temp.userPosted) {
            holder.push(temp);
          }
        }
        return holder;
      }
    },
  },

  Mutation: {
    uploadImage: async (_, args) => {
      //(url: String!, description: String, posterName: String)
      if (typeof args.posterName != "string") {
        throw "include a poster";
      }
      if (typeof args.url != "string") {
        throw "include a url";
      }
      if (typeof args.binned != "boolean") {
        args.binned = false;
      }
      const newImagePost = {
        binned: args.binned,
        userPosted: true,
        id: uuid.v4(),
        url: args.url,
        description: args.description,
        posterName: args.posterName,
      };
      let hashing = JSON.stringify(newImagePost);
      await client.set(newImagePost.id, hashing);
      if (await client.get(newImagePost.id)) {
        return newImagePost;
      }
      return { error };
    },

    deleteImage: async (_, args) => {
      let ogPost = JSON.parse(await client.get(args.id));
      let post = JSON.parse(await client.del(args.id));
      if (post != 1) {
        throw `Could not delete user with _id of ${args.id}`;
      }
      return ogPost;
    },

    updateImage: async (_, args) => {
      let newImage = JSON.parse(await client.get(args.id));
      if (newImage) {
        if (args.url) {
          newImage.url = args.url;
        }
        if (args.posterName && typeof args.posterName != "string") {
          newImage.posterName = args.posterName;
        }
        if (args.description) {
          newImage.description = args.description;
        }
        // it's currently binned or cached so remove it to reinsert
        if (newImage.binned || newImage.userPosted) {
          await client.del(newImage.id);
        }
        if (typeof args.userPosted === "boolean") {
          newImage.userPosted = args.userPosted;
        }
        if (typeof args.binned === "boolean") {
          newImage.binned = args.binned;
        }
        // if there is some reason to bin it, bin it
        if (newImage.binned || newImage.userPosted) {
          client.set(newImage.id, JSON.stringify(newImage));
        }
      } else {
        if (!args.id || typeof args.url != "string") {
          throw "inputs are bad";
        }
        newImage = {
          id: args.id,
          url: args.url,
          posterName: args.posterName,
          description: args.description,
          userPosted: false,
          binned: true,
        };
        client.set(newImage.id, JSON.stringify(newImage));
      }
      return newImage;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(async ({ url }) => {
  await client.connect();
  console.log(`🚀 Server ready at ${url} 🚀`);
});
