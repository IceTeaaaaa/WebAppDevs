const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const exphbs  = require('express-handlebars');

const api = require('./routes/api.js');

const app = express();
const hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static('public'));



// app.use(express.static('public'));

const DATABASE_NAME = 'eng-dict2';
const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;

let db = null;
let collection = null;


async function startServer() {

  // Set the db and collection variables before starting the server.
  db = await MongoClient.connect(MONGO_URL);
  collection = db.collection('words');
  console.log(1);

  function setCollection(req, res, next) {
    req.collection = collection;
    next();
  }
  app.use(setCollection);
  app.use(api);


  // Now every route can safely use the db and collection objects.
  await app.listen(3000);
  console.log('Listening on port 3000');
}
startServer();




// const express = require('express');
// const bodyParser = require('body-parser');
// const MongoClient = require('mongodb').MongoClient;
//
// const app = express();
// const jsonParser = bodyParser.json();
//
// app.use(express.static('public'));
//
// const DATABASE_NAME = 'eng-dict2';
// const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;
//
// let db = null;
// let collection = null;
//
// async function startServer() {
//   // Set the db and collection variables before starting the server.
//   db = await MongoClient.connect(MONGO_URL);
//   collection = db.collection('words');
//   // Now every route can safely use the db and collection objects.
//   await app.listen(3000);
//   console.log('Listening on port 3000');
// }
// startServer();
//
// ////////////////////////////////////////////////////////////////////////////////
//
// async function onLookupWord(req, res) {
//   const routeParams = req.params;
//   const word = routeParams.word;
//
//   const query = { word: word.toLowerCase() };
//   const result = await collection.findOne(query);
//
//   const response = {
//     word: word,
//     definition: result ? result.definition : ''
//   };
//   res.json(response);
// }
// app.get('/lookup/:word', onLookupWord);
//
// async function onSetWord(req, res) {
//   const routeParams = req.params;
//   const word = routeParams.word.toLowerCase();
//   const definition = req.body.definition;
//
//   const query = { word: word };
//   const newEntry = { word: word, definition: definition };
//   const params = { upsert: true };
//   const response =
//       await collection.update(query, newEntry, params);
//
//   res.json({ success: true });
// }
//
// app.post('/set/:word', jsonParser, onSetWord);
