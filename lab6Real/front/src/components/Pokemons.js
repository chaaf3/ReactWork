import queries from "../queries";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mutation } from "@apollo/react-components";
import ReactDOM from "react-dom/client";
import axios from "axios";
import { Routes } from "react-router-dom";
import { NavLink, BrowserRouter as Router, Route } from "react-router-dom";
import Pokemon from "./Pokemon";
import { useQuery } from "react-query";
import { GraphQLClient, gql } from "graphql-request";
import { QueryClient, QueryClientProvider } from "react-query";
import actions from "../actions.js";
import { useParams } from "react-router";
import Four from "./Four";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";

function Pokemons() {
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

  let { pagenum } = useParams();

  let { data, error, isLoading, refetch } = useQuery(
    "getpokemon",
    queries.Getpokemon(pagenum),
    {
      enabled: true,
      retry: false,
    }
  );
  let isNext = useQuery(
    "getpokemon2",
    queries.Getpokemon2(parseInt(pagenum) + 1),
    {
      enabled: true,
      retry: false,
    }
  );
  useEffect(() => {
    refetch();
    isNext.refetch();
  }, [pagenum]);

  let temp;
  if (isLoading) {
    temp = <p>loading...</p>;
  } else if (error) {
    return <Four />;
  } else if (data.getpokemon.length === 0) {
    return <Four />;
  } else {
    temp = data.getpokemon.map((image) => {
      return (
        <div className="card" key={uuid()}>
          <div className="card-body">
            <h1 className="card-title">{image.name}</h1>
            <Link
              className="previousPage"
              key={image.id}
              to={`/pokemon/${image.id}`}
            >
              {image && image.img && (
                <img
                  src={image.img}
                  alt={"Image of pokemon number: " + image.id + " not found"}
                  onError={(e) => {
                    e.target.src = "/download-1.jpg";
                  }}
                ></img>
              )}
            </Link>
            ID: {image.id}
            <br />
            <br />
            url: {image.url}
            <br />
            <br />
            name: {image.name}
            <br />
            {selected && !team.length <= 1 && team.includes(image.id) && (
              <button
                onClick={() => {
                  dispatch(actions.release(image.id));
                }}
              >
                release
              </button>
            )}
            {selected && !full && !team.includes(image.id) && (
              <button
                onClick={() => {
                  dispatch(actions.capture(image.id));
                }}
              >
                capture
              </button>
            )}
            <hr />
            <br />
            <br />
          </div>
        </div>
      );
    });
  }
  return (
    <div>
      {temp}
      <br />
      <br />
      <br />
      <br />
      <br />
      {pagenum && Number(pagenum) > 0 && (
        <button>
          <Link
            className="navlink"
            to={`/pokemon/page/${parseInt(pagenum) - 1}`}
          >
            previous page
          </Link>
        </button>
      )}
      {isNext &&
        isNext.data &&
        isNext.data.getpokemon &&
        isNext.data.getpokemon.length > 0 && (
          <button>
            <Link
              className="navlink"
              to={`/pokemon/page/${parseInt(pagenum) + 1}`}
            >
              next page
            </Link>
          </button>
        )}
      <br />
      <br />
      <br />
    </div>
  );
}

export default Pokemons;
