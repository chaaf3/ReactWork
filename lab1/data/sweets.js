const mongoCollections = require("../mongoCollections");
const sweets = mongoCollections.sweets;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const moods = [
  "Happy",
  "Sad",
  "Angry",
  "Excited",
  "Surprised",
  "Loved",
  "Blesses",
  "Greatful",
  "Blissful",
  "Silly",
  "Chill",
  "Motivated",
  "Emotional",
  "Annoyed",
  "Lucky",
  "Determined",
  "Bored",
  "Hungry",
  "Disappointed",
  "Worried",
];
const bcrypt = require("bcrypt");
const { json } = require("express");
const saltRounds = 16;

function check(username) {
  if (typeof username != "string")
    throw new error("enter correct input values");
  for (let i in username) {
    if (username[i] == " ") {
      throw "enter good inputs";
    }
  }
  if (username.length < 4) {
    throw "enter good inputs";
  }
  return true;
}

function checkPassword(password) {
  if (typeof password != "string") {
    throw "enter good inputs";
  }
  for (let i in password) {
    if (password[i] == " ") {
      throw "enter good inputs";
    }
  }
  if (password.length < 6) {
    throw "enter good inputs";
  }
  return true;
}
function checkStringInputs(str) {
  if (typeof str != "string") {
    throw "enter good inputs";
  }
  for (let i in password) {
    if (str[i] == " ") {
      throw "enter good inputs";
    }
  }
}

module.exports = {
  async createUser(userName, password, Name) {
    userName = userName.toLowerCase();
    if (!userName || !password || !Name) {
      throw new error("bad inputs");
    }

    let userCollection = await users();
    const userList = await userCollection
      .find({ username: userName })
      .toArray();
    if (userList.length > 0) {
      throw "that username is already in use";
    }

    let newPassword = await bcrypt.hash(password, saltRounds);
    let newUser = {
      name: Name,
      username: userName,
      password: newPassword,
    };

    let newInsertInformation = await userCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount == 0) {
      throw new error("this didn't work");
    } else {
      return newUser;
    }
  },
  async updateSweet(userId, sweetId, sweetText, sweetMood) {
    let hold = await this.getSweetById(sweetId);
    if (userId != hold.userThatPosted._id) {
      throw "only the user that posted can edit this";
    }
    const sweetCollection = await sweets();
    if (sweetText != null) {
      hold.sweetText = sweetText;
    }
    if (sweetMood != null) {
      hold.sweetMood = sweetMood;
    }
    let answer = await sweetCollection.replaceOne(
      { _id: ObjectId(sweetId) },
      hold
    );
    return hold;
  },
  async createSweet(sweetText, sweetMood, userId, userName) {
    if (!sweetText || !sweetMood || !userId || !userName) {
      throw "Include all fields";
    }
    if (typeof sweetText != "string" || sweetText.length == 0) {
      throw "Include a message";
    }
    if (!moods.includes(sweetMood)) {
      throw "the mood needs to be one of the listed";
    }
    let newSweet = {
      sweetText: sweetText,
      sweetMood: sweetMood,
      userThatPosted: { _id: userId, username: userName },
      replies: [],
      likes: [],
    };
    const sweetCollection = await sweets();
    let info = await sweetCollection.insertOne(newSweet);
    if (!info.acknowledged) {
      throw new error("this didn't work");
    } else {
      let answer = await this.getSweetById(info.insertedId.toString());
      return answer;
    }
  },

  async getSweets(page) {
    const sweetCollection = await sweets();
    const sweetList = await sweetCollection
      .find({})
      .skip((page - 1) * 50)
      .limit(50)
      .toArray();
    if (!sweetList || sweetList.length == 0) throw "Could not get all sweets";
    return sweetList;
  },
  async getUserById(id) {
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: ObjectId(id) });
    user._id = user._id.toString();
    // console.log(user)
    // console.log("here66")
    if (!user) throw "user not found";
    return user;
  },

  async reply(userId, text, sweetId) {
    // console.log("now in reply function")
    if (!userId || !text || !sweetId) {
      throw "include all fields";
    }
    //    console.log(userId);
    //    console.log("Did I error");
    let user = await this.getUserById(userId);
    //    console.log("why in gods name don't you work")
    let addTo = {
      _id: new ObjectId(),
      userThatPostedReply: { _id: userId, username: user.username },
      reply: text,
    };
    //   console.log("1")
    let sweetCollection = await sweets();
    //   console.log("2")
    let newSweet = await this.getSweetById(sweetId);
    //   console.log("3")
    let newreply = newSweet.replies;
    newreply.push(addTo);
    //   console.log("4")
    let info = await sweetCollection.updateOne(
      { _id: ObjectId(sweetId) },
      { $set: { replies: newreply } }
    );
    //   console.log("testing");
    if (!info) {
      throw new error("this didn't work");
    } else {
      let answer = await this.getSweetById(sweetId);
      return answer;
    }
  },

  async deleteReply(replyId, sweetId, userId) {
    if (!replyId || !sweetId || !userId) {
      throw "include all fields";
    }
    const sweetCollection = await sweets();
    let sweet = await this.getSweetById(sweetId);
    let reply = sweet.replies;
    let newArray = [];
    for (let i = 0; i < reply.length; i++) {
      if (reply[i]._id != replyId) {
        newArray.push(i);
      }
    }
    sweet.replies = newArray;
    await sweetCollection.updateOne(
      { _id: ObjectId(sweetId) },
      { $set: { replies: newArray } }
    );
    return { success: true };
  },
  async getSweetById(id) {
    const sweetCollection = await sweets();
    const sweet = await sweetCollection.findOne({ _id: ObjectId(id) });
    // console.log(sweet);
    if (!sweet) throw "Post not found";
    return sweet;
  },
  async like(userId, sweetId) {
    const sweetCollection = await sweets();
    let sweet = await this.getSweetById(sweetId);
    if (!sweet) {
      throw "sweet doesn't exist";
    }
    let likes = sweet.likes;
    let newArray = [];
    if (!likes.includes(userId)) {
      newArray = likes;
      likes.push(userId);
    } else {
      for (let i = 0; i < likes.length; i++) {
        if (likes[i] != userId) {
          newArray.push(likes[i]);
        }
      }
    }
    await sweetCollection.updateOne(
      { _id: ObjectId(sweetId) },
      { $set: { likes: newArray } }
    );
    let answer = await this.getSweetById(sweetId);
    return answer;
  },
  async checkUser(username, password) {
    let userName = "";

    if (!username || !password) {
      throw new error("bad inputs");
    }
    if (check(username) && checkPassword(password)) {
      userName = username.toLowerCase();
    }
    // console.log(username, password);
    let userCollection = await users();
    let userList = await userCollection.find({ username: username }).toArray();
    if (userList.length != 1) {
      throw new error("Either the username or password is invalid");
    }
    let comparePasswords = await bcrypt.compare(password, userList[0].password);
    let id = userList[0]._id;
    if (comparePasswords) {
      return { username, id };
    } else {
      throw new error("Either the username or password is invalid");
    }
  },
};
