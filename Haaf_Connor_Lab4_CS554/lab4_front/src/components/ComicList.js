import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";
import { useParams } from "react-router";
import Four from "./Four";
const regex = /(<([^>]+)>)/gi;

const ComicList = () => {
  let { pageNum } = useParams();
  const [comicsData, setComicsData] = useState([]);
  const [next, setNext] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {
        let { data } = await axios.get(
          `http://localhost:3001/api/comics/page/${pageNum - 1}`
        );
        setComicsData(data);
      } catch (e) {
        setError(true);
      }
      try {
        let holder = await axios.get(
          `http://localhost:3001/api/comics/page/${parseInt(pageNum)}`
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
          to={`/comics/page/${Number(pageNum) - 1}`}
        >
          <button>PreviousPage</button>
        </Link>
      )}
      {next && (
        <Link className="nextPage" to={`/comics/page/${Number(pageNum) + 1}`}>
          <button>NextPage</button>
        </Link>
      )}
      <br />
      <ul>
        {comicsData &&
          comicsData.map((comic) => {
            let temp = "/comics/" + comic.id;
            return (
              <li key={"c" + comic.id} id={comic.id}>
                <Link className="comiclink" to={temp}>
                  {comic.title.replace(regex)}
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default ComicList;
