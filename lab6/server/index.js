var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");
const axios = require("axios");
const express = require("express");
const app = express();
const redis = require("redis");
const client = redis.createClient();

var schema = buildSchema(`
  type Query {
    getpokemon(pageNum: Int): [pokemon]
    getPokemon(id: Int): Pokemon
  }
  type pokemon {
    id: Int
    name: String
    url: String
    img: String
  }
  type Pokemon {
    name: String
    id: Int
    type: [String]
    img: String
  }
`);

var root = {
  getpokemon: async (pageNum) => {
    console.log("is this running?");
    let page = 0;
    let poke = [];
    let answer;
    if (!pageNum || typeof parseInt(pageNum) != "number" || pageNum < 0) {
      throw "bad inputs";
    }
    if (pageNum) {
      page = pageNum - 1;
    }
    try {
      // if ((answer = JSON.parse(client.get("page" + args.page))).length != 0) {
      //   return answer;
      // }
      poke = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?offset=${page}`
      );
      if (poke.data.results == []) {
        return res.err(404);
      }
      answer = poke.data.results.map(async (x) => {
        let id = x.url.split("/");
        if (id[id.length - 2] == "pokemon") {
          id = id[id.length - 1];
        } else {
          id = id[id.length - 2];
        }
        return {
          id: id,
          name: x.name,
          url: x.url,
          img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        };
      });
    } catch (e) {
      console.log(e);
    }
    // client.set("page" + args.page, JSON.stringify(answer));
    return answer;
  },

  getPokemon: async (args) => {
    let Poke;
    if (!args.id) {
      throw err(404);
    }
    try {
      Poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${args.id}`);
      if (!Poke.data.name) {
        return res.err(404);
      }
      let types = Poke.data.types.map((x) => {
        console.log(x);
        return x.type.name;
      });

      return {
        name: Poke.data.name,
        id: Poke.data.id,
        type: types,
        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${Poke.data.id}.png`,
      };
    } catch (e) {
      console.log(e);
    }
    return err(404);
  },
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000);
// client.connect();
console.log(`🚀  Server ready at http://localhost:4000/graphql 🚀`);
