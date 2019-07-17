const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
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

  collection = db.collection('webapp');

  // collection.remove({});
  // collection.insert({"type": "title","url_array": []});


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

async function onApiUrl(req, res) {

    // collection.remove({});
    const urls = req.body.url;
    // collection.insert({"type": "title","url_array": urls});
    const query = { type: "title" };
    const newEntry = { type: "title", url_array: urls };
    const params = { upsert: true };
    const response =
        await collection.update(query, newEntry, params);
    res.json({ success: true });

}
app.post('/api', jsonParser, onApiUrl);


