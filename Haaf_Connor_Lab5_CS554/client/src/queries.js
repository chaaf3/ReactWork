import { gql } from "@apollo/client";

const GetUserPostedImages = gql`
  query {
    userPostedImages {
      description
      binned
      userPosted
      url
      id
      posterName
    }
  }
`;

const GetUnsplashImages = gql`
  query UnsplashImages($pageNum: Int) {
    unsplashImages(pageNum: $pageNum) {
      id
      url
      description
      posterName
      userPosted
      binned
    }
  }
`;

const GetBinnedImages = gql`
  query {
    binnedImages {
      id
      url
      description
      posterName
      userPosted
      binned
    }
  }
`;
const UploadImages = gql`
  mutation UploadImage(
    $url: String!
    $description: String
    $posterName: String!
  ) {
    uploadImage(url: $url, description: $description, posterName: $posterName) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;
const UpdateImages = gql`
  mutation UpdateImage(
    $updateImageId: ID!
    $url: String
    $posterName: String
    $description: String
    $userPosted: Boolean
    $binned: Boolean
  ) {
    updateImage(
      id: $updateImageId
      url: $url
      posterName: $posterName
      description: $description
      userPosted: $userPosted
      binned: $binned
    ) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;
const DeleteImages = gql`
  mutation DeleteImage($deleteImageId: ID!) {
    deleteImage(id: $deleteImageId) {
      id
      url
      posterName
      description
      userPosted
      binned
    }
  }
`;

export default {
  GetBinnedImages,
  GetUnsplashImages,
  GetUserPostedImages,
  DeleteImages,
  UpdateImages,
  UploadImages,
};
