import React, { useState } from "react";

import "../App.css";
import ReactModal from "react-modal";
import { useQuery, useMutation } from "@apollo/client";
//Import the file where my query constants are defined
import queries from "../../queries";

//For react-modal
ReactModal.setAppElement("#root");
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    border: "1px solid #28547a",
    borderRadius: "4px",
  },
};

function AddModal() {
  const [addImage] = useMutation(queries.UploadImages, {
    update(cache, { data: { uploadImage } }) {
      let imagesTmp = [];

      try {
        let { userPostedImages } = cache.readQuery({
          query: queries.GetUserPostedImages,
        });
        imagesTmp = userPostedImages;
      } catch {
        imagesTmp = [];
      }
      cache.writeQuery({
        query: queries.GetUserPostedImages,
        data: { userPostedImages: imagesTmp.concat([uploadImage]) },
      });
    },
    refetchQueries: [{ query: queries.GetUserPostedImages }],
  });
  let url;
  let description;
  let posterName;
  let body = (
    <form
      className="form"
      id="add-employee"
      onSubmit={(e) => {
        e.preventDefault();
        addImage({
          variables: {
            url: url.value,
            description: description.value,
            posterName: posterName.value,
          },
        });
        url.value = "";
        description.value = "";
        posterName.value = "";
      }}
    >
      <div className="form-group">
        <label>
          url:
          <br />
          <input
            ref={(node) => {
              url = node;
            }}
            required
            autoFocus={true}
          />
        </label>
      </div>
      <br />
      <div className="form-group">
        <label>
          description:
          <br />
          <input
            ref={(node) => {
              description = node;
            }}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          posterName:
          <br />
          <input
            ref={(node) => {
              posterName = node;
            }}
            required
            autoFocus={true}
          />
        </label>
      </div>
      <br />
      <button className="addPost" type="submit">
        makePost
      </button>
    </form>
  );
  return body;
}

export default AddModal;
