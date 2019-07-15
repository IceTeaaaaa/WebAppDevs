const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

function find_title(results){
    let result_arr = new Array();
    let flag = 0; //if new title
    let old_title = "", current_title = "";

    for(result of results){
        current_title = `${result.url}`;
        if(current_title === "" || current_title !== old_title){
            flag = 1;
        }
        if(flag === 1){
            // let sub_array = new Array(){
            //
            // }
        }
    }

    // if(`${results.url}`)

}

async function onViewIndex(req, res) {


    // let urls = req.collection.find({}, {_id: 0, url:1, sub_url: 1});
    // let urls = req.collection.


    // const query = {url_array: 'url_array'};
    // const u_arr = await req.collection.findOne(query);
    // console.log("11111111"+u_arr);

    let a = await req.collection.findOne({type:'title'}).url_array;
    await console.log("123" + a);

    const placeholders = {
        title_0: "123"
    };
    res.render('index', placeholders);
}
router.get('/', onViewIndex);


module.exports = router;
