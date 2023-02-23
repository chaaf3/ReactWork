const capture = (id) => ({
  type: "CATCH",
  payload: {
    id: id,
  },
});

const release = (id) => ({
  type: "RELEASE",
  payload: {
    id: id,
  },
});
const add = (trainerName) => ({
  type: "CREATE_TRAINER",
  payload: { trainerName: trainerName },
});

const del = (id) => ({
  type: "DELETE_TRAINER",
  payload: {
    trainerId: id,
  },
});
const select = (id) => ({
  type: "SELECT_TRAINER",
  payload: {
    trainerId: id,
  },
});

const deSelect = (id) => ({
  type: "DESELECT_TRAINER",
  payload: {
    trainerId: id,
  },
});

module.exports = {
  capture,
  release,
  add,
  del,
  select,
  deSelect,
};
