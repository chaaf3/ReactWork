const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const uuid = require("uuid"); //for generating _id's
const axios = require("axios");
const express = require("express");
const redis = require("redis");
const app = express();
const client = redis.createClient();

const cors = require("cors");

app.use(cors());

const schema = buildSchema(`
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

const root = {
  //goes to pg.58
  getpokemon: async (args) => {
    let poke = [];
    let answer;
    if (args.pageNum == 0) {
      //do nothing
    } else if (!args.pageNum) {
      res.status(404).json("bad inputs");
      return;
    }

    try {
      if (await client.exists("page" + JSON.stringify(args.pageNum))) {
        return JSON.parse(
          await client.get("page" + JSON.stringify(args.pageNum))
        );
      }

      poke = await axios.get(
        `https://pokeapi.co/api/v2/pokemon?offset=${args.pageNum * 20}`
      );
      if (poke.data.results == []) {
        res.status(404).json("bad inputs");
        return;
      }
      answer = poke.data.results.map((x) => {
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
      res.status(404).json("bad inputs");
      return;
    }
    await client.set(
      "page" + JSON.stringify(args.pageNum),
      JSON.stringify(answer)
    );
    return answer;
  },

  getPokemon: async (args) => {
    let Poke;
    if (!args.id) {
      res.status(404).json("bad inputs");
      return;
    }
    try {
      if (await client.exists(JSON.stringify(args.id))) {
        return JSON.parse(await client.get(JSON.stringify(args.id)));
      }
      Poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${args.id}`);
      if (!Poke.data.name) {
        res.status(404).json("bad inputs");
        return;
      }
      let types = Poke.data.types.map((x) => {
        return x.type.name;
      });
      await client.set(
        JSON.stringify(args.id),
        JSON.stringify({
          name: Poke.data.name,
          id: Poke.data.id,
          type: types,
          img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${Poke.data.id}.png`,
        })
      );

      return {
        name: Poke.data.name,
        id: Poke.data.id,
        type: types,
        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${Poke.data.id}.png`,
      };
    } catch (e) {}
    res.status(404).json("bad inputs");
    return;
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

app.listen(4000, async () => {
  await client.connect();
  console.log("connected to graphQL");
});
