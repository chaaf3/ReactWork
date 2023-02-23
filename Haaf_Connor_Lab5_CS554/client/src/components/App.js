import React from "react";
import "./App.css";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { Routes } from "react-router-dom";
import { NavLink, BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import MyBin from "./MyBin";
import AddModal from "./modals/AddModal";
import MyPosts from "./MyPosts";
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div>
          <header className="App-header">
            <h1 className="App-title">GraphQL With Apollo Client Server</h1>
            <nav>
              <NavLink className="navlink" to="/">
                Home
              </NavLink>
              <NavLink className="navlink" to="/my-Bin">
                MyBin
              </NavLink>
              <NavLink className="navlink" to="/my-posts">
                userPosts
              </NavLink>
              <NavLink className="navlink" to="/new-post">
                new Post
              </NavLink>
            </nav>
          </header>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/my-bin" element={<MyBin />} />
            <Route exact path="/my-posts" element={<MyPosts />} />
            <Route exact path="/new-post" element={<AddModal />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
