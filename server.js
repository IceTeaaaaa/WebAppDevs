const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const MongoClient = require('mongodb').MongoClient;
const exphbs  = require('express-handlebars');
var path = require('path');
const type = require('./routes/type.js');
const index = require('./routes/index.js');
const api = require('./routes/api.js');
let urls = "";
let urls_array = new Array();

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

  db = await MongoClient.connect(MONGO_URL);

  collection = db.collection('webapp');

  function setCollection(req, res, next) {
    req.collection = collection;
    next();
  }

  app.use(setCollection);
  app.use(api);
  app.use(type);
  app.use(index);
    // const a = await collection.find().toArray();
    // for(let b of a){
    //     urls = `${b.url_array}`;
    // }
    // urls_array = urls.split(",");
    // if(urls_array){
    //     collection.remove({});
    //     console.log(123);
    // }
    collection.remove({}, {});
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




async function removeCard(req, res) {
    const removeUrl = req.body.url;

    cardsList =  await collection.find().toArray();
    urls_array = cardsList[0].url_array;

    let filtered = urls_array.filter((value) => {
        return value !== removeUrl;
    });

    console.log(removeUrl);

    const query = { type: "title" };
    const newEntry = { type: "title", url_array: filtered };
    const params = { upsert: true };
    const response = await collection.update(query, newEntry, params);
    res.json({ success: true });
}
app.post('/removeCard/a', jsonParser, removeCard);