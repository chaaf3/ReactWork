import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";
import { useParams } from "react-router";
import Four from "./Four";
const regex = /(<([^>]+)>)/gi;

const StoryList = () => {
  let { pageNum } = useParams();
  const [storiesData, setStoriesData] = useState([]);
  const [next, setNext] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {
        let { data } = await axios.get(
          `http://localhost:3001/api/stories/page/${pageNum - 1}`
        );
        setStoriesData(data);
      } catch (e) {
        setError(true);
      }
      try {
        let holder = await axios.get(
          `http://localhost:3001/api/stories/page/${parseInt(pageNum)}`
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
      {pageNum > 1 && (
        <Link
          className="previousPage"
          to={`/stories/page/${Number(pageNum) - 1}`}
        >
          <button>PreviousPage</button>
        </Link>
      )}
      {next && (
        <Link className="nextPage" to={`/stories/page/${Number(pageNum) + 1}`}>
          <button>NextPage</button>
        </Link>
      )}
      <br />
      <ul>
        {storiesData &&
          storiesData.map((story) => {
            let temp = "/stories/" + story.id;
            return (
              <li key={"s" + story.id} id={story.id}>
                <Link className="storylink" to={temp}>
                  {story.title.replace(regex)}
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default StoryList;
