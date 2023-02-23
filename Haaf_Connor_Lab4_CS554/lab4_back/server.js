const express = require("express");
const app = express();
const redis = require("redis");
const client = redis.createClient();
const axios = require("axios");
const md5 = require("blueimp-md5");
const { json } = require("express");
const publickey = "4806397555e757ebedeff852c00e2e8f";
const privatekey = "cd705a29544cd5018e0e7635f7f2e170cc982d20";
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public";
const url = "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;

const cors = require("cors");
app.use(cors());

app.get("/api/characters/history", async (req, res) => {
  let hist = await client.lRange("history", 0, 19);
  if (!hist) {
    res.send("history doesn't exist");
    return;
  } else {
    let holder = hist.map((x) => JSON.parse(x));
    res.json(holder);
  }
});

// new function needs testing still --------------------------------------
// new function needs testing still --------------------------------------
app.get("/api/characters/page/:pagenum", async (req, res) => {
  if (
    !req.params.pagenum ||
    typeof req.params.pagenum != "string" ||
    isNaN(req.params.pagenum)
  ) {
    res.status(404).json({ error: "no page provided" });
    return;
  }
  let characterPageExists = await client.get("cp" + req.params.pagenum);
  if (characterPageExists) {
    res.send(JSON.parse(characterPageExists));
    return;
  } else {
    let characterPage;
    try {
      characterPage = await axios.get(
        baseUrl +
          "/characters" +
          url +
          "&limit=" +
          "20" +
          "&offset=" +
          req.params.pagenum * 20
      );
      if (
        Math.ceil(
          parseInt(characterPage.data.data.total) /
            parseInt(characterPage.data.data.limit)
        ) < parseInt(req.params.pagenum)
      ) {
        throw "bad id";
      }
    } catch (e) {
      res.status(404).json("bad id");
      return;
    }
    characterPage = characterPage.data.data.results;
    if (characterPage.length == 0) {
      res.status(404).json("bad id");
      return;
    }
    let hashing = JSON.stringify(characterPage);
    console.log("made it here");
    await client.set("cp" + req.params.pagenum, hashing);
    res.json(characterPage);
    return;
  }
});
// new function needs testing still --------------------------------------
// new function needs testing still --------------------------------------

app.get("/api/characters/:id", async (req, res) => {
  if (!req.params.id || typeof req.params.id != "string") {
    res.status(404).json({ error: "no id provided" });
    return;
  }
  let characterExist = await client.get(req.params.id);
  if (characterExist) {
    await client.lPush("history", characterExist);
    res.send(JSON.parse(characterExist));
    return;
  } else {
    let character;
    try {
      character = await axios.get(
        baseUrl + "/characters/" + req.params.id + url
      );
    } catch (e) {
      res.status(404).json("bad id");
      return;
    }
    character = character.data.data.results[0];
    character = JSON.stringify(character);
    await client.set(req.params.id, character);
    await client.lPush("history", character);
    res.send(JSON.parse(character));
    return;
  }
});

// new function needs testing still --------------------------------------
// new function needs testing still --------------------------------------
app.get("/api/comics/page/:pagenum", async (req, res) => {
  if (
    !req.params.pagenum ||
    typeof req.params.pagenum != "string" ||
    isNaN(req.params.pagenum)
  ) {
    res.status(404).json({ error: "no page provided" });
    return;
  }
  let comicPageExists = await client.get("comp" + req.params.pagenum);
  if (comicPageExists) {
    res.send(JSON.parse(comicPageExists));
    return;
  } else {
    let comicPage;
    try {
      comicPage = await axios.get(
        baseUrl +
          "/comics" +
          url +
          "&limit=" +
          "20" +
          "&offset=" +
          req.params.pagenum * 20
      );
      if (
        Math.ceil(
          parseInt(comicPage.data.data.total) /
            parseInt(comicPage.data.data.limit)
        ) < parseInt(req.params.pagenum)
      ) {
        throw "bad id";
      }
    } catch (e) {
      res.status(404).json("bad id");
      return;
    }
    comicPage = comicPage.data.data.results;
    let hashing = JSON.stringify(comicPage);
    console.log("made it here");
    await client.set("comp" + req.params.pagenum, hashing);
    res.json(comicPage);
    return;
  }
});
// new function needs testing still --------------------------------------
// new function needs testing still --------------------------------------
app.get("/api/comics/:id", async (req, res) => {
  if (!req.params.id || typeof req.params.id != "string") {
    res.status(404).json({ error: "no id provided" });
    return;
  }
  let comicExist = await client.get("c" + req.params.id);
  if (comicExist) {
    res.send(JSON.parse(comicExist));
    return;
  } else {
    let comic;
    try {
      comic = await axios.get(baseUrl + "/comics/" + req.params.id + url);
    } catch (e) {
      res.status(404).json("bad id");
      return;
    }
    comic = comic.data.data.results[0];
    comic = JSON.stringify(comic);
    await client.set("c" + req.params.id, comic);
    res.send(JSON.parse(comic));
    return;
  }
});

// new function needs testing still --------------------------------------
// new function needs testing still --------------------------------------
app.get("/api/stories/page/:pagenum", async (req, res) => {
  if (
    !req.params.pagenum ||
    typeof req.params.pagenum != "string" ||
    isNaN(req.params.pagenum)
  ) {
    res.status(404).json({ error: "no page provided" });
    return;
  }
  let storyPageExists = await client.get("sp" + req.params.pagenum);
  if (storyPageExists) {
    res.send(JSON.parse(storyPageExists));
    return;
  } else {
    let storyPage;
    try {
      storyPage = await axios.get(
        baseUrl +
          "/stories" +
          url +
          "&limit=" +
          "20" +
          "&offset=" +
          req.params.pagenum * 20
      );
      if (
        Math.ceil(
          parseInt(storyPage.data.data.total) /
            parseInt(storyPage.data.data.limit)
        ) < parseInt(req.params.pagenum)
      ) {
        throw "bad id";
      }
    } catch (e) {
      res.status(404).json("bad id");
      return;
    }
    storyPage = storyPage.data.data.results;
    let hashing = JSON.stringify(storyPage);
    console.log("made it here");
    await client.set("sp" + req.params.pagenum, hashing);
    res.json(storyPage);
    return;
  }
});
// new function needs testing still --------------------------------------
// new function needs testing still --------------------------------------

app.get("/api/stories/:id", async (req, res) => {
  if (!req.params.id || typeof req.params.id != "string") {
    res.status(404).json({ error: "no id provided" });
    return;
  }
  let storyExist = await client.get("s" + req.params.id);
  if (storyExist) {
    res.send(JSON.parse(storyExist));
    return;
  } else {
    let story;
    try {
      story = await axios.get(baseUrl + "/stories/" + req.params.id + url);
    } catch (e) {
      res.status(404).json("bad id");
      return;
    }
    story = story.data.data.results[0];
    story = JSON.stringify(story);
    await client.set("s" + req.params.id, story);
    res.send(JSON.parse(story));
    return;
  }
});

app.get("/*", async (req, res) => {
  res.send({ error: "not a valid route" });
});
app.listen(3001, async () => {
  await client.connect();
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3001");
});






































const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
import { checkAuth } from "../middleware/token.middleware";
import express, { Request, Response, Router } from "express";
import { User, UserDislikeItem, UserLikeItem, SocialMediaItem } from "../data/interfaces";
let data = require("../data/users");

export const usersRouter: Router = express.Router();

function isAUserDislikeItem(obj: any): obj is UserDislikeItem {
    return 'id' in obj && 'name' in obj;
  }
  function isAUserLikeItem(obj: any): obj is UserLikeItem {
    return 'id' in obj && 'name' in obj;
  }
  function isASocialMediaItem(obj: any): obj is SocialMediaItem {
    return 'profileURL' in obj && 'id' in obj;
  }
usersRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, firstName, lastName, firebaseUid } = req.body;
    const response = await data.createUser(
      username,
      email,
      firstName,
      lastName,
      firebaseUid
    );
    res.json(response);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

usersRouter.get(
  "/profile/:firebaseUid",
  async (req: Request, res: Response) => {
    const firebaseUid = req.params.firebaseUid;
    try {
      let users = await data.getOneUser(firebaseUid);
      res.json(users);
    } catch (e) {
      res.status(404).json({ error: e });
    }
  }
);

// No plans for this
// usersRouter.delete("/profile/:id", async (req: Request, res: Response) => {
//   let id = req.params.id;
//   console.log("getUser route");
//   try {
//     let users = await data.deleteOneUser(id);
//     res.json(users);
//   } catch (e) {
//     res.status(404).json({ error: e });
//   }
// });

usersRouter.get(
  "/favorited/:firebaseUid",
  checkAuth,
  async (req: Request, res: Response) => {
    let firebaseUid = req.params.firebaseUid;
    let favorites;
    try {
      favorites = await data.getFavoritedUsers(firebaseUid);
      res.json(favorites);
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: e });
    }
  }
);

usersRouter.post(
  "/:firebaseUid/editUser",
  checkAuth,
  async (req: Request, res: Response) => {
    try {
      let firebaseUid = req.params.firebaseUid;

      //console.log(username, email, password);
      let userObj = {} as User;

      if (req.body.username) {
        if (typeof req.body.username != "string" || !req.body.username) {
          return res
            .status(400)
            .json({ error: "Updated username must be a valid string" });
        } else {
          userObj.username = req.body.username;
        }
      }
      if (req.body.firstName) {
        if (typeof req.body.firstName != "string" || !req.body.firstName) {
          return res
            .status(400)
            .json({ error: "Updated first name must be a valid string" });
        } else {
          userObj.firstName = req.body.firstName;
        }
      }
      if (req.body.lastName) {
        if (typeof req.body.lastName != "string" || !req.body.lastName) {
          return res
            .status(400)
            .json({ error: "Updated last name must be a valid string" });
        } else {
          userObj.lastName = req.body.lastName;
        }
      }
      if (req.body.profileImage) {
        if (
          typeof req.body.profileImage != "string" ||
          !req.body.profileImage
        ) {
          return res
            .status(400)
            .json({ error: "Updated profile image must be a valid string" });
        } else {
          userObj.profileImage = req.body.profileImage;
        }
      }
      if (req.body.contactInfo) {
        let contactFields = [
          "phoneNumber",
          "email",
          "website",
          "occupation",
        ];

        for (const [k, v] of Object.entries(req.body.contactInfo)) {
          if (!contactFields.includes(k)) {
            return res.status(400).json({
              error:
                "Contact Field must be either phone number, email, website, or occupation",
            });
          }
          if (typeof v != "string") {
            return res
              .status(400)
              .json({ error: "Contact Info must be string" });
          }
        }
        userObj.contactInfo = req.body.contactInfo;
      }
      if (req.body.socialMedia) {
        if (!Array.isArray(req.body.socialMedia)) {
          return res
            .status(400)
            .json({ error: "Updated social medias must be a valid array" });
        } else {
          console.log("EDSD")
            for(let i = 0; i<req.body.socialMedia.length; i++){
              console.log("SDF")
                if(!isASocialMediaItem(req.body.socialMedia[i])){
                    return res
                    .status(400)
                    .json({ error: "Social medias in array must be valid type" });                    }
                }
                userObj.socialMedia = req.body.socialMedia;  
        }
      }
      if (req.body.likes) {
        if (!Array.isArray(req.body.likes)) {
          return res
            .status(400)
            .json({ error: "Updated Likes must be a valid array" });
        } else {
            for(let i = 0; i<req.body.likes.length; i++){
                if(!isAUserLikeItem(req.body.likes[i])){
                    return res
                    .status(400)
                    .json({ error: "Likes in array must be valid type" });                    }
                }
                userObj.likes = req.body.likes;  
        }
      }
      if (req.body.dislikes) {
        if (!Array.isArray(req.body.dislikes)) {
          return res
            .status(400)
            .json({ error: "Updated dislikes must be a valid array" });
        } else {
            for(let i = 0; i<req.body.dislikes.length; i++){
                if(!isAUserDislikeItem(req.body.dislikes[i])){
                    return res
                    .status(400)
                    .json({ error: "Dislikes in array must be valid type" });                    }
                }
                userObj.dislikes = req.body.dislikes;  
        }
      }
      let answer = await data.patchUser(userObj, firebaseUid);
  
      return res.json(answer);
    } catch (e) {
      return res.status(404).json({ error: e });
    }
  }
);

usersRouter.get("/", async (req: Request, res: Response) => {
  try {
    let users = await data.getAllUsers();
    return res.json(users);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

/* 

/auth/register -> createa user:

{
	_id: "507f1f77bcf86cd799439011",
	username: “mikeydellWooHoo”,
	password: ################, ← hashed value
	firstName: “Mike”,
	lastName: “Dell”,
	profileImage:  
	contactInfo: {
				phoneNumber: “201-204-2482”,
				email: “blahblah@gmail.com”,
				personalWebsite: “hoboken.com”
				currentRole: “Senior CS Major”
            }, 
	socialMedia: [
        {
            _id: “12497c4c-b923-422f-98bb-801f8bd737ba”, 
            profileURL: “https://twitter.com/CityofHoboken”
        }
    ],
    likes: [
        {
            _id: “7e13b59d-18b0-439f-ac68-2d6bfed7ee72”, 
            like: “Swimming”
        },
        {
            _id: “7e13b59d-18b0-439f-ac68-2d6bfed7ee71”, 
            like: Running
        }, 
    ],
    dislikes: [
        {
            _id: "5349b4ddd2781d08c09890f3",
            dislike: “Running”
        }, 
    ],
    favortiedUsers: [“507f1f77bcf86cd799439011”] 
}


*/
