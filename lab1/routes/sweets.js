const express = require('express');
const router = express.Router();
const mongoCollections = require('../mongoCollections');
const sweets = mongoCollections.sweets;
const users = mongoCollections.users;
const data = require('../data/sweets');
const queryString = require('qs')


async function posts (req, res, next){

  if (!req.session.userId) {
    res.status(403).json({error: "log in please"});
  }
  else {
    next();
  }
};

router.get('/', async (req, res) => {
  let page = req.query.page;
  try {
    console.log(page)
    if (!page ) {
        page = 1;
    }
    if (isNaN(page)) {
        throw "page number needs to be a number"
    }
  } catch (e) {
    return res.status(400).json({error: e});
  }
  try {
    let sweet = await data.getSweets(page);
    res.json(sweet);
  } catch (e) {
    res.status(404).json({error: e});
  }
});


router.post('/signup', async (req, res) => {
  try {
    let {name, username, password} = req.body;
    console.log(name, username, password);
    let answer = await data.createUser(username, password, name);
    console.log(answer)
    res.json(answer);
  }
  catch (e) {
    res.status(404).json({error:e});
  }
})
router.post('/',posts, async (req, res) => {
  try {
    if (!req.session.userId) {
      throw 'sign in';
    }
    else {
      let {sweetText, sweetMood} = req.body;
      let holder = await data.createSweet(sweetText, sweetMood, req.session.userId, req.session.userName);
      res.json(holder);

    }
  }
  catch (e) {
    res.status(404).json({error:e});
  }
})
router.post('/login', async (req, res) => {
  try {
    let {username, password} = req.body;
    let holder = await data.checkUser(username, password);
    if (holder.id && holder.username) {
      req.session.userId = holder.id;
      req.session.userName = holder.username;
      let answer = await data.getUserById(holder.id.toString())
      res.json(answer);
    }
  }
  catch (e) {
    res.status(404).json({error:e});
  }
});
router.get('/:id', async (req, res) => {
  try {
    let sweetId = req.params.id;
    let temp = await data.getSweetById(sweetId);
    res.json(temp);
    }
    catch (e) {
      res.status(404).json({error:e});
    }
});
router.post('/:id/replies',posts, async (req, res) => {
  try {
    let sweetId = req.params.id;
    console.log(sweetId)
    let temp = await data.reply(req.session.userId, req.body.reply, sweetId);
    console.log("something is up");
    res.json(temp);
  }
  catch (e) {
    res.status(500).json({error:e});
  }
});
router.patch('/:id',posts, async (req, res) => {
  try {
    let sweetId = req.params.id;
    let sweetText = req.body.sweetText;
    let sweetMood = req.body.sweetMood;
    if (!sweetText && !sweetMood) {
      throw "please give fields"
    }
    let update = await data.updateSweet(req.session.userId, sweetId, sweetText, sweetMood);
    res.json(update);
  }
  catch (e) {
    res.status(501).json({error:e});
  }
});

router.post('/:id/likes',posts, async (req, res) => {
  let answer;
  try {
    if (!req.session.userId || !req.params.id) {
      throw "please make sure all requirements are met"
    }
    else {
      answer = await data.like(req.session.userId, req.params.id);
      res.json(answer);
    }
  }
  catch(e) {
    res.status(501).json({error:e});
  }
});
router.delete('/:sweetId/:replyId',posts, async (req, res) => {
  let answer;
  try {
    if (!req.session.userId || !req.params.sweetId || !req.params.replyId) {
      throw "please make sure all requirements are met"
    } 
    else {
      answer = await data.deleteReply(req.params.replyId, req.params.sweetId, req.session.userId);
      res.json(answer);
    }
  }
  catch (e) {
    res.status(501).json({error:e});
  }
});
router.post('/logout', async (req, res) => {
  req.session.userId = null;
  req.session.userName = null;
  req.session.destroy();
  res.json({success: true});
})



module.exports = router;