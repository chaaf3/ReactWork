import { useQuery } from "react-query";
import { request, gql } from "graphql-request";

const API_URL = `http://localhost:4000/graphql`;

const GetPokemon = (id) => {
  return useQuery(["getPokemon"], async () => {
    const data = await request(
      API_URL,
      gql`
        query {
          getPokemon(id: ${id}) {
            id
            name
            type
            img
          }
        }
      `
    );
    return data;
  });
};

const Getpokemon = (page) => {
  return useQuery(["getpokemon"], async () => {
    const data = await request(
      API_URL,
      gql`
        {
          getpokemon(pageNum: ${page}) {
            name
            url
            img
            id
          }
        }
      `
    );
    return data;
  });
};

const Getpokemon2 = (page) => {
  return useQuery(["getpokemon2"], async () => {
    const data = await request(
      API_URL,
      gql`
        {
          getpokemon(pageNum: ${page}) {
            name
            url
            img
            id
          }
        }
      `
    );
    return data;
  });
};

let queries = { GetPokemon, Getpokemon, Getpokemon2 };
export default queries;
