import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";
import { useParams } from "react-router";
import { render } from "@testing-library/react";
import Four from "./Four";
const regex = /(<([^>]+)>)/gi;

const Comic = () => {
  let { id } = useParams();
  const [Id, setId] = useState(id);
  const [comicData, setComicData] = useState(undefined);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let { data } = await axios.get(
          `http://localhost:3001/api/comics/${Id}`
        );
        setComicData(data);
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
      <h2 className="label">Title:</h2>
      {comicData && <h2>{comicData.title.replace(regex)}</h2>}
      {comicData && (
        <img
          className="images"
          src={`${comicData.thumbnail.path}/standard_amazing.${comicData.thumbnail.extension}`}
          alt="no Img"
        />
      )}

      {comicData && <h2>{comicData.resourceURI}</h2>}
      <br />
      <br />
      <br />
      <h2 className="label">Related Variant List If Any:</h2>
      <ul>
        {comicData &&
          comicData.variants &&
          comicData.variants &&
          comicData.variants.map((variant) => {
            let name = variant.name;
            let holder = variant.resourceURI.split("/");
            return (
              <li
                key={"cc" + variant.resourceURI}
                id={variant.name}
              >
                {name.replace(regex)}
              </li>
            );
          })}
      </ul>

      <br />
      <br />
      <h2 className="label">Related Stories List If Any:</h2>
      <ul>
        {comicData &&
          comicData.stories &&
          comicData.stories.items &&
          comicData.stories.items.map((story) => {
            let name = story.name;
            let holder = story.resourceURI.split("/");
            return (
              <li
                key={"cc" + story.resourceURI}
                id={story.name}
              >
                <Link
                  className="comicslink"
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

export default Comic;
