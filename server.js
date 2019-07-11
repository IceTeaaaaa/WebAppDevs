const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const exphbs  = require('express-handlebars');
var path = require('path');
const index = require('./routes/index.js');
const views = require('./routes/views.js');

const app = express();
const hbs = exphbs.create({
  layoutsDir: path.join(__dirname, "views"),
  defaultLayout: '',
  extname: 'handlebars'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// app.set('views', path.join(__dirname, 'views'));

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
  app.use(index);
  app.use(views);

  // Now every route can safely use the db and collection objects.
  await app.listen(3000);
  console.log('Listening on port 3000');
}
startServer();