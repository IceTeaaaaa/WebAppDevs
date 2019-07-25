// Required packages.
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
var cookieParser = require('cookie-parser');
const MongoClient = require('mongodb').MongoClient;
const exphbs  = require('express-handlebars');
var path = require('path');
const index = require('./routes/index.js');
const readDB = require('./routes/readDB.js');
const api = require('./routes/api');

var session = require('express-session');
var RedisStore = require('connect-redis')(session);

let web_array = new Array();
let web_array_str = "";

fs.readFile('data.txt', (err, data) => {
    if (err) throw err;
    web_array_str = data.toString();
    web_array = web_array_str.split(",");

    let web_card_url_array = web_array.slice(0,6);
    let right_side_bar_array = web_array.slice(6);

    // Server setup
    const app = express();
    const hbs = exphbs.create({
      layoutsDir: path.join(__dirname, "views"),
      defaultLayout: '',
      extname: 'handlebars'
    });

    app.engine('handlebars', hbs.engine);
    app.set('view engine', 'handlebars');

    app.use(express.static('public'));


    // Database setup
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

      let hour = 3600000;
      app.use(session({
          name: "hailong",
          secret: "news aggregator by people in HaiLong Mansion",
          cookies: {expires: new Date(Date.now() + hour*336)},
          resave: false,
          saveUninitialized: true,
          store: new RedisStore({
              host: '127.0.0.1',
              port: 6379,
              db: 0,
          })
      }));
      // session must be declared before any routers! otherwise, it won't get registered to routers, would be undefined
      app.use(setCollection);
      app.use(cookieParser());
      app.use(readDB);
      app.use(index);
      app.use(api);


      collection.remove({});
      collection.insert({type: "title", url_array: web_card_url_array, right_side_url: right_side_bar_array});
      await app.listen(3000);
      console.log('Listening on port 3000');
    }
    startServer();




    // Mongo Database related CRUD operations. (create, read, update, delete)//
    /////////////////////////////////////////////////////////////////////
    async function removeElemDB(req, res) {
        const removeFrom = req.body.which;
        const value = req.body.val;

        let db = await collection.find().toArray();
        db = db[0];
        let removeArray = db[removeFrom];
        let id = db._id;

        let filtered = removeArray.filter((elem) => {
            return elem !== value;
        })

        await collection.update({_id: id}, {$set: {[removeFrom]: filtered}});
        res.json({ success: true });  // must have this line, otherwise, this function won't return anything to caller
                                                                                // await waits forever.
    }
    app.post('/db/array/remove', jsonParser, removeElemDB);

    async function addElemDB(req, res) {
        const addTo = req.body.which;
        const value = req.body.val;

        let db = await collection.find().toArray();
        db = db[0];
        let addToArray = db[addTo];
        addToArray.push(value);
        let id = db._id;


        await collection.update({_id: id}, {$set: {[addTo]: addToArray}});
        // console.log(req.headers.cookie);
        res.cookie('test',1)
        res.json({ success: true });  // must have this line, otherwise, this function won't return anything to caller
                                                                            // await waits forever.
    }
    app.post('/db/array/add', jsonParser, addElemDB);


    async function removeElemCookies(req, res) {

    }
    app.post('/cookies/array/remove', jsonParser, removeElemCookies);

    async function addElemCookies(req, res) {

    }
    app.post('/cookies/array/add', jsonParser, addElemCookies);


});