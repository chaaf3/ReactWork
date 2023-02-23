import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";
import { useParams } from "react-router";
import { render } from "@testing-library/react";
const regex = /(<([^>]+)>)/gi;

const Four = () => {
  return (
    <div>
      <br />
      <h1> 404 error </h1>
      <br />
    </div>
  );
};

export default Four;
