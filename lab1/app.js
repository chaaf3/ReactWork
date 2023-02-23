const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
app.use(express.urlencoded({extended: true}))
const data = require('./data/sweets');


app.use(express.json());

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
}))


// app.use('/sweets/:id', async (req, res, next) => {

//   if ((req.method == 'PUT' || req.method == 'PATCH') && !req.session.userId) {
//     res.status(403).json({error: "log in please"});
//   }
//   else {
//     if (!req.params.id) {
//       res.status(403).json({error:"post Id needed"});
//     }
//     let shouldBe = await data.getSweetById(req.params.id);
//     shouldBeId = shouldBe.userThatPosted._id;
//     if (shouldBeId != req.session.userId) {
//       res.status(403).json({error:"wrong user"});
//     }
//     else {
//       next();
//     }
//   }
// });
// app.use('/sweets/:id', (req, res, next) => {

//   if (!req.session.userId) {
//     res.status(403).json({error: "log in please"});
//   }
//   else {
//     next();
//   }
// });
// app.use('/sweets/:id/replies', (req, res, next) => {

//   if (!req.session.userId) {
//     res.status(403).json({error: "log in please"});
//   }
//   else {
//     next();
//   }
// });

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});