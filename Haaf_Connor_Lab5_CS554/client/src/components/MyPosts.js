import React, { useEffect, useState } from "react";
import "./App.css";
import AddModal from "./modals/AddModal";
import DeleteModal from "./modals/DeleteModal";
import { useQuery, useMutation } from "@apollo/client";
import queries from "../queries";
import { Mutation } from "@apollo/react-components";

function MyPosts() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [scrolled, setScrolled] = useState(null);

  const [unBin] = useMutation(queries.UpdateImages, {
    update(cache, { data: { unBin } }) {
      const { binned } = cache.readQuery({
        query: queries.GetBinnedImages,
      });
      cache.writeQuery({
        query: queries.GetBinnedImages,
        data: {
          binned: binned,
        },
      });
    },
  });

  const { loading, error, data, refetch } = useQuery(
    queries.GetUserPostedImages,
    {
      fetchPolicy: "cache-and-network",
      variables: {},
    }
  );

  const [deletePost] = useMutation(queries.DeleteImages, {
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
        data: { userPostedImages: imagesTmp },
      });
    },
    refetchQueries: [{ query: queries.GetUserPostedImages }],
  });

  const [binPost] = useMutation(queries.UpdateImages);

  //const [deletePost] = useMutation(queries.DeleteImages);
  if (data) {
    console.log(data);

    let temp = data.userPostedImages.map((image) => {
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
                  await binPost({
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
                Remove from Bin
              </button>
            )}
            {image && (
              <button
                className="removeFromBin"
                onClick={async () => {
                  await deletePost({
                    variables: {
                      deleteImageId: image.id,
                    },
                  });
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      );
    });
    return (
      <div>
        {temp}
        <AddModal />
        <br />
      </div>
    );
  } else if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>{error.message}</div>;
  }
}

export default MyPosts;
