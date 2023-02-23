import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";
import { useParams } from "react-router";
import { render } from "@testing-library/react";
import Four from "./Four";
import NoImg from "../download-1.jpg";
const regex = /(<([^>]+)>)/gi;

const Story = () => {
  let { id } = useParams();
  const [Id, setId] = useState(id);
  const [storyData, setStoryData] = useState(undefined);
  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let { data } = await axios.get(
          `http://localhost:3001/api/stories/${Id}`
        );
        setStoryData(data);
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
      {storyData && storyData.title && (
        <h2>{storyData.title.replace(regex)}</h2>
      )}
      {storyData && storyData.originalIssue && storyData.originalIssue.name && (
        <p className="where it came from ">
          Origonal Issue: {storyData.originalIssue.name}
        </p>
      )}
      {storyData && storyData.thumbnail && (
        <img
          className="images"
          src={`${storyData.thumbnail.path}/standard_amazing.${storyData.thumbnail.extension}`}
          alt="Not Loading / available"
        />
      )}
      <br />
      {storyData && !storyData.thumbnail && (
        <img src={NoImg} alt="nothing found" />
      )}
      <h2>Story Description:</h2>
      {storyData && storyData.description && (
        <p>{storyData.description.replace(regex)}</p>
      )}
      <br />
      <br />
      <br />
      <h2 className="label">Related Comic List:</h2>
      <ul>
        {storyData &&
          storyData.comics &&
          storyData.comics.items &&
          storyData.comics.items.map((comics) => {
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
      <h2 className="label">Series List:</h2>
      <ul>
        {storyData &&
          storyData.series &&
          storyData.series.items.map((comics) => {
            let name = comics.name;
            return (
              <li key={"cc" + comics.resourceURI} id={comics.name}>
                {name.replace(regex)}
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Story;
