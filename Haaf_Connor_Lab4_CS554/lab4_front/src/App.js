import React from "react";
import "./App.css";
import CharacterList from "./components/CharacterList";
import Character from "./components/Character";
import Landing from "./components/Landing";
import StoriesList from "./components/StoriesList";
import Story from "./components/Story";
import History from "./components/History";
import Four from "./components/Four";
import Comic from "./components/Comic";
import ComicList from "./components/ComicList";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
<link rel="stylesheet" type="text/css" href="App.css" />;

const App = () => {
  return (
    <Router>
      <div className="App-header">
        <div className="App-body">
          <h1 className="title">Marvel API Stuff</h1>
          <Link className="showslink" to={"/characters/page/1"}>
            to the Characters Listing
          </Link>
          <br />
          <Link className="comicslink" to="/comics/page/1">
            to the Comics Listing
          </Link>
          <br />
          <Link className="storieslink" to="/stories/page/1">
            to the Stories Listing
          </Link>
          <br />
          <br />
          <br />
          <Routes>
            <Route
              path="/characters/page/:pageNum"
              element={<CharacterList />}
            />
            <Route exact path="/" element={<Landing />} />
            <Route exact path="/characters/history" element={<History />} />
            <Route path="/characters/:id" element={<Character />} />
            <Route
              path="/characters/page/:pageNum"
              element={<CharacterList />}
            />
            <Route path="/comics/:id" element={<Comic />} />
            <Route path="/comics/page/:pageNum" element={<ComicList />} />
            <Route path="/stories/page/:pageNum" element={<StoriesList />} />
            <Route path="/stories/:id" element={<Story />} />
            <Route path="/404" element={<Four />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
