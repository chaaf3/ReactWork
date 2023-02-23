import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";
import { useParams } from "react-router";
import Four from "./Four";
const regex = /(<([^>]+)>)/gi;

const CharacterList = () => {
  let { pageNum } = useParams();
  const [charactersData, setCharactersData] = useState([]);
  const [next, setNext] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        let { data } = await axios.get(
          `http://localhost:3001/api/characters/page/${pageNum - 1}`
        );
        setCharactersData(data);
        setLoading(false);
      } catch (e) {
        setError(true);
        setError(true);
      }
      try {
        let holder = await axios.get(
          `http://localhost:3001/api/characters/page/${parseInt(pageNum) + 1}`
        );
        setNext(true);
      } catch (e) {
        setError(true);
        setNext(false);
      }
    }
    fetchData();
  }, [pageNum]);

  if (error) {
    return <Four />;
  }

  return (
    <div>
      {loading && <p>loading</p>}
      {pageNum > 1 && (
        <Link
          className="previousPage"
          to={`/characters/page/${Number(pageNum) - 1}`}
        >
          <button>PreviousPage</button>
        </Link>
      )}
      {next && (
        <Link
          className="nextPage"
          to={`/characters/page/${Number(pageNum) + 1}`}
        >
          <button>NextPage</button>
        </Link>
      )}
      <br />
      <ul>
        {charactersData &&
          charactersData.map((character) => {
            let temp = "/characters/" + character.id;
            return (
              <li key={"c" + character.id} id={character.id}>
                <Link className="characterlink" to={temp}>
                  {character.name.replace(regex)}
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default CharacterList;
