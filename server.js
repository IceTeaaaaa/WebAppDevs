// Required packages.
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const exphbs  = require('express-handlebars');
var path = require('path');
const index = require('./routes/index.js');
const readDB = require('./routes/readDB.js');
const api = require('./routes/api');

let web_array = new Array();
let web_array_str = "";
let User_doc = null;

fs.readFile('data_test.txt', (err, data) => {
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
    app.use(express.static(__dirname + '/public/'));


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
      app.use(setCollection);
      app.use(readDB);
      app.use(index);
      app.use(api);

      //默认游客
        // ["http://baidu.com"]
      // add("default","default", web_card_url_array, right_side_bar_array);
      //登录

        await app.listen(3000);
      console.log('Listening on port 3000');
    }
    startServer();



    // Mongo Database related CRUD operations. (create, read, update, delete)//
    /////////////////////////////////////////////////////////////////////
    async function removeElemDB(req, res) {
        const removeFrom = req.body.which;
        const value = req.body.val;

        // let db = await collection.find().toArray();
        // db = db[0];
        let removeArray = User_doc[removeFrom];
        let id = User_doc._id;

        let filtered = removeArray.filter((elem) => {
            return elem !== value;
        });

        await collection.update({_id: id}, {$set: {[removeFrom]: filtered}});
        res.json({ success: true });  // must have this line, otherwise, this function won't return anything to caller
                                                                                // await waits forever.
    }
    app.post('/db/array/remove', jsonParser, removeElemDB);

    async function addElemDB(req, res) {
        const addTo = req.body.which;
        const value = req.body.val;

        // let db = await collection.find().toArray();
        // db = db[0];
        let addToArray = User_doc[addTo];
        addToArray.push(value);
        let id = User_doc._id;

        await collection.update({_id: id}, {$set: {[addTo]: addToArray}});
        res.json({ success: true });  // must have this line, otherwise, this function won't return anything to caller
                                                                            // await waits forever.
    }
    app.post('/db/array/add', jsonParser, addElemDB);

    function add(usr,pass,url1, url2){
        collection.findOne({'username':usr},function(err, doc) {
            if(doc) {
                if(usr === "default"){
                    User_doc = doc;
                }
            } else {
                collection.insert({'username':usr, 'password': pass, url_array: url1, right_side_url: url2},function () {
                });
            }
        });
    }


    // app.post('/login/ID',jsonParser, (req, res) => {
    //
    //     var UserName = req.body.username;
    //     var UserPsw = req.body.password;
    //     collection.findOne({'username':UserName, 'password': UserPsw},function(err, doc){
    //         User_doc = doc;
    //     });
    //
    // });


});


