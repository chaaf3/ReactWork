import { combineReducers } from "redux";
import pokemonReducer from "./pokemonReducer";
import trainerReducer from "./trainerReducer";
const rootReducer = combineReducers({
  trainer: trainerReducer,
});

export default rootReducer;
