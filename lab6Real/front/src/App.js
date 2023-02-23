import "./App.css";
import GetPokemon from "./queries";
import React from "react";
import { Mutation } from "@apollo/react-components";
import ReactDOM from "react-dom/client";
import axios from "axios";
import { Routes } from "react-router-dom";
import { NavLink, BrowserRouter as Router, Route } from "react-router-dom";
import Pokemon from "./components/Pokemon";
import { useQuery } from "react-query";
import { GraphQLClient, gql } from "graphql-request";
import Pokemons from "./components/Pokemons";
import { QueryClient, QueryClientProvider } from "react-query";
import Trainer from "./components/Trainer";
import Home from "./components/Home";
import Four from "./components/Four";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div>
          <header className="App-header">
            <h1 className="App-title">Pokemon Client Server</h1>
            <nav>
              <NavLink className="navlink" to="/pokemon/page/0">
                pokemonList
              </NavLink>
              <br />
              <br />
              <NavLink className="navlink" to="/trainers">
                Trainers
              </NavLink>
              <br />
              <br />
              <NavLink className="navlink" to="/">
                Home
              </NavLink>
            </nav>
          </header>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/pokemon/:id" element={<Pokemon />} />
            <Route exact path="/pokemon/page/:pagenum" element={<Pokemons />} />
            <Route exact path="/trainers" element={<Trainer />} />
            <Route path="*" element={<Four />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
