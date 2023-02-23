import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";
import { useParams } from "react-router";
import { render } from "@testing-library/react";
import Four from "./Four";
const regex = /(<([^>]+)>)/gi;

const Character = () => {
  let { id } = useParams();
  const [Id, setId] = useState(id);
  const [characterData, setCharacterData] = useState(undefined);
  const [image, setImage] = useState(undefined);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let { data } = await axios.get(
          `http://localhost:3001/api/characters/${Id}`
        );

        let imageData = `${data.thumbnail.path}/standard_amazing.${data.thumbnail.extension}`;

        setImage(imageData);
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
      <h2 className="name">Character Name:</h2>
      {characterData && <h2>{characterData.name.replace(regex)}</h2>}
      <img className="images" key={Id} src={image} alt="no img" />

      <br />
      <br />
      <h2 className="label">Related Comic List:</h2>
      <ul>
        {characterData &&
          characterData.comics &&
          characterData.comics.items &&
          characterData.comics.items.map((comics) => {
            let name = comics.name;
            let holder = comics.resourceURI.split("/");
            return (
              <li key={"cc" + comics.resourceURI} id={comics.name}>
                <Link
                  className="comicslink"
                  to={`/comics/${holder[holder.length - 1]}`}
                >
                  {name.replace(regex)}
                </Link>
              </li>
            );
          })}
      </ul>

      <br />
      <br />
      <h2 className="label">Related Stories List:</h2>
      <ul>
        {characterData &&
          characterData.stories &&
          characterData.stories.items &&
          characterData.stories.items.map((stories) => {
            let name = stories.name;
            let holder = stories.resourceURI.split("/");
            return (
              <li key={"cc" + stories.resourceURI} id={stories.name}>
                <Link
                  className="storieslink"
                  to={`/stories/${holder[holder.length - 1]}`}
                >
                  {name.replace(regex)}
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Character;
