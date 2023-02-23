import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";
import { useParams } from "react-router";
import { render } from "@testing-library/react";
import Four from "./Four";
const regex = /(<([^>]+)>)/gi;

const History = () => {
  let { id } = useParams();
  const [Id, setId] = useState(id);
  const [characterData, setCharacterData] = useState(undefined);
  const [image, setImage] = useState(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let { data } = await axios.get(
          `http://localhost:3001/api/characters/history`
        );
        setCharacterData(data);
      } catch (e) {
        setError(true);
      }
    };
    fetchData();
  }, [Id]);
  if (error) {
    return <Four />;
  }
  return (
    <div>
      <ul>
        {characterData &&
          characterData.map((character) => {
            let name = character.name;
            return (
              <li>
                <Link
                  className="charactersList"
                  to={`/characters/${character.id}`}
                >
                  {character.name.replace(regex)}
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default History;
