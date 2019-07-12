const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const exphbs  = require('express-handlebars');
var path = require('path');
const type = require('./routes/type.js');
const index = require('./routes/index.js');
const api = require('./routes/api.js');

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

const DATABASE_NAME = 'webapp';
const MONGO_URL = `mongodb://localhost:27017/${DATABASE_NAME}`;

let db = null;
let collection = null;

async function startServer() {


  // function(err,db){
  //   if(err) throw err;
  //   console.log("dbs created");
  //   var dbase = db.db("web-app");
  //   dbase.createCollection('site', function (err, res){
  //     if(err) throw err;
  //     console.log("collection created");
  //   })
  //   db.close();
  // }
  // Set the db and collection variables before starting the server.


  db = await MongoClient.connect(MONGO_URL);
  console.log(1);

  collection = db.collection('webapp');

  collection.insert({"url": "http://www.qinghua.com"});

  function setCollection(req, res, next) {
    req.collection = collection;
    next();
  }
  app.use(setCollection);
  app.use(api);
  app.use(type);
  app.use(index);


  // Now every route can safely use the db and collection objects.
  await app.listen(3000);
  console.log('Listening on port 3000');



}
startServer();