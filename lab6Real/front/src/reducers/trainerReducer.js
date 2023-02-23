import { v4 as uuid } from "uuid";

const initialState = [];
let copyState = null;
let index = 0;
let temp;
let activeTrainer;

const trainerReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "CREATE_TRAINER":
      return [
        ...state,
        {
          selected: false,
          full: false,
          teams: [],
          trainerName: payload.trainerName,
          trainerId: uuid(),
        },
      ];

    case "DELETE_TRAINER":
      copyState = [...state];
      index = copyState.findIndex((x) => x.trainerId === payload.trainerId);
      copyState.splice(index, 1);
      return [...copyState];
    case "SELECT_TRAINER":
      copyState = [...state];
      index = copyState.findIndex((x) => x.trainerId === payload.trainerId);
      for (let i = 0; i < copyState.length; i++) {
        copyState[i].selected = false;
      }
      copyState[index].selected = true;
      return [...copyState];
    case "DESELECT_TRAINER":
      copyState = [...state];
      index = copyState.findIndex((x) => x.trainerId === payload.trainerId);
      if (copyState[index].selected) {
        copyState[index].selected = false;
      }
      return [...copyState];
    // after this point is where the teams functionality begins
    case "CATCH":
      copyState = [...state];
      index = copyState.findIndex((x) => x.selected === true);
      if (
        index === -1 ||
        copyState[index].teams.length >= 6 ||
        copyState[index].teams.includes(payload.id)
      ) {
        throw new Error("bad request");
      }
      copyState[index].teams.push(payload.id);
      if (copyState[index].teams.length >= 6) {
        copyState[index].full = true;
      } else {
        copyState[index].full = false;
      }
      return [...copyState];

    case "RELEASE":
      copyState = [...state];
      index = copyState.findIndex((x) => x.selected === true);
      if (index === -1) {
        throw new Error("bad request");
      }
      temp = copyState[index].teams.findIndex((x) => payload.id === x);
      if (temp === -1) {
        throw new Error("bad request");
      }
      copyState[index].teams.splice(temp, 1);
      copyState[index].full = false;
      return [...copyState];
    default:
      return state;
  }
};

export default trainerReducer;
