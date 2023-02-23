import { v4 as uuid } from "uuid";

const initialState = [{ full: false, pokemon: [], trainer: null, id: uuid() }];

let index = 0;
let temp;

const pokemonReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "CATCH":
      if (state.pokemon.length >= 5) {
        temp = true;
      } else {
        temp = false;
      }
      return { full: temp, pokemon: [...state.pokemon, payload.id] };
    case "RELEASE":
      index = state.pokemon.findIndex((x) => x === payload.id);
      state.pokemon.splice(index, 1);
      return { full: false, pokemon: [...state.pokemon] };
    default:
      return state;
  }
};

export default pokemonReducer;
