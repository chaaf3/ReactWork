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

function Trainer() {
  const dispatch = useDispatch();
  const all = useSelector((state) => state);
  const [formData, setFormData] = useState({ trainerName: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const add = () => {
    if (!formData || formData.trainerName.length === 0) {
      alert("trainer name can't be empty");
    } else {
      dispatch(actions.add(formData.trainerName));
      document.getElementById("trainerName").value = "";
      setFormData("");
    }
  };

  return (
    <div className="add">
      <div className="input-selection">
        <label>
          Trainer Name:
          <input
            onChange={(e) => handleChange(e)}
            id="trainerName"
            name="trainerName"
            placeholder="Trainer Name"
          />
        </label>
      </div>
      <button onClick={add}>Add Trainer</button>
      <br />
      <br />
      <br />
      {all.trainer.map((team, index) => {
        return (
          <div key={index}>
            <hr />
            {team.selected && (
              <button
                onClick={() => {
                  dispatch(actions.deSelect(team.trainerId));
                }}
              >
                Deselect
              </button>
            )}
            {!team.selected && (
              <button
                onClick={() => {
                  dispatch(actions.select(team.trainerId));
                }}
              >
                Select
              </button>
            )}
            {!team.selected && (
              <button
                onClick={() => {
                  dispatch(actions.del(team.trainerId));
                }}
              >
                Delete Trainer
              </button>
            )}
            <h1>Trainer: {team.trainerName}</h1>
            <br />
            {team.teams.map((poke, index) => {
              return (
                <Link
                  className="previousPage"
                  key={index}
                  to={`/pokemon/${poke}`}
                >
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke}.png`}
                    alt={"Image of pokemon number: " + poke + " not found"}
                    onError={(e) => {
                      e.target.src = "/download-1.jpg";
                    }}
                  />
                </Link>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Trainer;
