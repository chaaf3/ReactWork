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
let hasNext;
// new function needs testing still --------------------------------------
// new function needs testing still --------------------------------------
app.get("/api/characters/page/:pagenum", async (req, res) => {
  if (
    !req.params.pagenum ||
    typeof req.params.pagenum != "string" ||
    !/^\d+$/.test(req.params.pagenum)
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

      hasNext =
        parseInt(characterPage.data.data.total) -
          parseInt(characterPage.data.data.limit) *
            (parseInt(req.params.pagenum) + 1) >
        0;
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
    characterPage = { characterPage, hasNext };

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
      hasNext =
        parseInt(comicPage.data.data.total) -
          parseInt(comicPage.data.data.limit) *
            (parseInt(req.params.pagenum) + 1) >
        0;
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
    comicPage = { comicPage, hasNext };
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
      hasNext =
        parseInt(storyPage.data.data.total) -
          parseInt(storyPage.data.data.limit) *
            (parseInt(req.params.pagenum) + 1) >
        0;
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
    storyPage = { storyPage, hasNext };
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
