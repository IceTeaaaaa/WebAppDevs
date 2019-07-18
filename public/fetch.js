let web_card_number_displayed = 6;
let web_card_index_order_displayed = [0,1,2,3,4,5];
let right_bar_index_order_displayed = [0,1,2,3,4,5];
let web_card_url_array = new Array();
let right_side_bar_array = new Array();
let web_array_mongod = new Array();

readTopNewsDB().then(function (result) {
    if(result[0] !== ""){
        web_card_url_array = result;
        console.log(web_card_url_array);
        web_card_number_displayed = result.length;
        refreshWebPage();
    } else {
        getTopNewsArray().then(function (result2) {
            web_card_url_array = result2;
            refreshWebPage();
        });
    }
    readRightBarDB().then(function (result3) {
        console.log(1);
        if(result[0] !== ""){
            right_side_bar_array = result3;
            console.log(right_side_bar_array);
            refreshWebPage();
        } else {
            console.log(3);
            getRightSideArray().then(function (result4) {
                right_side_bar_array = result4;
                refreshWebPage();
            });
        }
    })

})



// getRightSideArray().then(function (result2) {
//     right_side_bar_array = result2;
//     refreshWebPage();
// });

const delete_news = document.querySelectorAll('.delete_icon');
for(let delete_new of delete_news){
    delete_new.addEventListener('click', onDelete);
    delete_new.addEventListener('click', onApi);
}
const add_news_buttons = document.querySelectorAll(".add-to-top-news")
for(let add_news_button of add_news_buttons){
    add_news_button.addEventListener('click', addTopNews);
    add_news_button.addEventListener('click', onApi);
}

async function onApi(event) {
    event.preventDefault();

    const message = {
        url: web_card_url_array,
        url2: right_side_bar_array
    };
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    };
    await fetch('/api', fetchOptions);
}
const setForm = document.querySelector('.refresh_button');
setForm.addEventListener('click', onApi);

async function onDelete(event) {
    if (web_card_number_displayed > 0) {
        event.preventDefault();

        const deleteNews = event.currentTarget;

        const web_id = deleteNews.parentNode.childNodes[3].childNodes[1].childNodes[0].textContent;

        if(web_id !== ""){
            var filtered = web_card_url_array.filter(function (value) {
                return value !== web_id;
            });
            web_card_url_array = filtered;
            --web_card_number_displayed;
            web_card_index_order_displayed.pop();
        }
    }

    refreshWebPage();
    return null;
}

async function refreshWebPage(){
    // const web_cards = document.querySelectorAll('.web_card');
    // var i = 0;
    // for(web_card of web_cards){
    //     // web_card.childNodes[3].childNodes[1].childNodes[0].textContent = web_card_url_array[web_card_index_order_displayed[i]];
    //     // web_card.childNodes[3].childNodes[1].childNodes[0].href = web_card_url_array[web_card_index_order_displayed[i]];
    //     // web_card.childNodes[3].childNodes[3].childNodes[0].textContent = web_card_url_array[web_card_index_order_displayed[i]];
    //     // web_card.childNodes[3].childNodes[3].childNodes[0].href = web_card_url_array[web_card_index_order_displayed[i++]];
    //     i++;
    // }
    const right_side_bars = document.querySelectorAll('.right-box-grid-title');
    var j = 0;
    for(right_side_bar of right_side_bars){
        right_side_bar.childNodes[1].childNodes[0].textContent = right_side_bar_array[right_bar_index_order_displayed[right_bar_index_order_displayed[j]]];
        right_side_bar.childNodes[1].childNodes[0].href = right_side_bar_array[right_bar_index_order_displayed[right_bar_index_order_displayed[j++]]];
    }
}

async function addTopNews(event) {
    if (web_card_number_displayed < 6){
        event.preventDefault();
        const currentNews = event.currentTarget;
        const web_id = currentNews.parentElement.querySelector(".right-box-grid-title").childNodes[1].childNodes[0].textContent;

        web_card_url_array.push(web_id);
        web_card_index_order_displayed.push(web_card_number_displayed);
        ++web_card_number_displayed;
        let filtered = right_side_bar_array.filter(function(value){
            return value != web_id;
        });
        right_side_bar_array = filtered;
    }
    refreshWebPage();
    return null;
}

async function getTopNewsArray(){
    let type = 'topNews';
    let result = await fetch('/' + type);
    const json = await result.json();
    return json.array;
}

async function getRightSideArray() {
    let type = 'rightSideNews';
    let result = await fetch('/' + type);
    const json = await result.json();
    // const json = await result.json();
    return json.array;
}

async function readTopNewsDB() {
    let data = 'mongodb';
    let result = await fetch('/topNewsDB/' + data);
    const json = await result.json();
    return json.array;
}

async function readRightBarDB() {
    let rightData = 'right_mongodb';
    let result = await fetch('/rightBarDB/' + rightData);
    const json = await result.json();
    return json.rightArr;
}