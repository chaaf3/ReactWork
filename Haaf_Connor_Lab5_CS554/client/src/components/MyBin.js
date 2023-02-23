import React, { useEffect, useState } from "react";
import "./App.css";
import AddModal from "./modals/AddModal";
import DeleteModal from "./modals/DeleteModal";
import EditModal from "./modals/EditModal";
import { useQuery, useMutation } from "@apollo/client";
import queries from "../queries";
import { Mutation } from "@apollo/react-components";

function MyBin() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [deletePost, setDeletePost] = useState(null);
  const [scrolled, setScrolled] = useState(null);

  const [unBin] = useMutation(queries.UpdateImages, {
    update(cache) {
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
        data: { userPostedImages: imagesTmp },
      });
    },
    refetchQueries: [{ query: queries.GetBinnedImages }],
  });

  const { loading, error, data, refetch } = useQuery(queries.GetBinnedImages, {
    fetchPolicy: "cache-and-network",
    variables: {},
  });

  const [binPost] = useMutation(queries.UpdateImages);

  if (data) {
    console.log(data);

    let temp = data.binnedImages.map((image) => {
      return (
        <div className="card" key={image.id}>
          <div className="card-body">
            <h5 className="card-title">{image.description}</h5>
            <img src={image.url} alt={"noImage"} />
            ID: {image.id}
            <br />
            <br />
            url: {image.url}
            <br />
            <br />
            posterName: {image.posterName} <br />
            <br />
            description: {image.description}
            <br />
            {image && !image.binned && (
              <button
                className="addToBin"
                onClick={async () => {
                  await binPost({
                    variables: {
                      updateImageId: image.id,
                      url: image.url,
                      posterName: image.posterName,
                      description: image.description,
                      binned: true,
                    },
                  });
                }}
              >
                Add to Bin
              </button>
            )}
            {image && image.binned && (
              <button
                className="removeFromBin"
                onClick={async () => {
                  await unBin({
                    variables: {
                      updateImageId: image.id,
                      url: image.url,
                      posterName: image.posterName,
                      description: image.description,
                      binned: false,
                    },
                  });
                }}
              >
                Remove From Bin
              </button>
            )}
          </div>
        </div>
      );
    });
    return (
      <div>
        {temp}
        <br />
      </div>
    );
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}

export default MyBin;
