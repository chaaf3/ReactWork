import queries from "../queries";
import React, { useEffect, useState } from "react";
import { Mutation } from "@apollo/react-components";
import ReactDOM from "react-dom/client";
import axios from "axios";
import { Routes } from "react-router-dom";
import { NavLink, BrowserRouter as Router, Route } from "react-router-dom";
import { useQuery } from "react-query";
import { GraphQLClient, gql } from "graphql-request";
import { QueryClient, QueryClientProvider } from "react-query";
import actions from "../actions.js";
import Four from "./Four";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";

function Pokemon() {
  let { id } = useParams();
  const [Id, setId] = useState(id);
  const dispatch = useDispatch();
  const all = useSelector((state) => state);
  const selected = useSelector(
    (state) =>
      state.trainer[state.trainer.findIndex((x) => x.selected === true)]
  );
  let team = undefined;
  let full = undefined;
  if (selected) {
    team = selected.teams;
    full = selected.full;
  }
  let { data, error, isLoading, refetch } = useQuery(
    "getPokemon",
    queries.GetPokemon(id),
    {
      enabled: true,
      retry: false,
    }
  );

  useEffect(() => {}, [data]);

  if (isLoading) {
    return <p>loading...</p>;
  } else if (error) {
    return <Four />;
  } else {
    return (
      <div>
        {data && data.getPokemon && data.getPokemon.img && (
          <img
            src={data.getPokemon.img}
            alt={
              "Image of pokemon number: " + data.getPokemon.id + " not found"
            }
            onError={(e) => {
              e.target.src = "/download-1.jpg";
            }}
          />
        )}
        <p>{data && data.getPokemon && data.getPokemon.name}</p>
        {selected &&
          data &&
          data.getPokemon &&
          !team.length <= 1 &&
          team.includes(data.getPokemon.id) && (
            <button
              onClick={() => {
                dispatch(actions.release(data.getPokemon.id));
              }}
            >
              release
            </button>
          )}
        {selected &&
          !full &&
          data &&
          data.getPokemon &&
          !team.includes(data.getPokemon.id) && (
            <button
              onClick={() => {
                dispatch(actions.capture(data.getPokemon.id));
              }}
            >
              capture
            </button>
          )}
        <h1>Types:</h1>
        {data &&
          data.getPokemon &&
          data.getPokemon.type.map((typ) => {
            return <p key={uuid()}> {typ} </p>;
          })}
      </div>
    );
  }
}

export default Pokemon;
