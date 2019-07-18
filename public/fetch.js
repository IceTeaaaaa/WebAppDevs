let web_card_number_displayed = 6;
let web_card_index_order_displayed = [0,1,2,3,4,5];
let right_bar_index_order_displayed = [0,1,2,3,4,5];
let web_card_url_array = new Array();
let right_side_bar_array = new Array();

readDB().then(function (result) {
    web_card_url_array = result.array;
    web_card_number_displayed = result.array.length;
    right_side_bar_array = result.rightArr;
    refreshWebpage();
    })


const delete_news = document.querySelectorAll('.delete_icon');
for(let delete_new of delete_news){
    delete_new.addEventListener('click', onDelete);
    //delete_new.addEventListener('click', onApi);
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
    // Get id of this specific card. (Note: id is the url of the main site).
    console.log(event.currentTarget.parentNode.parentNode.attributes[1].value);
    let removeUrl = event.currentTarget.parentNode.parentNode.attributes[1].value;
    // let noSymbol = removeUrl.replace(/[^a-zA-Z ]/g, "");
    event.currentTarget.parentNode.parentElement.remove();

    const message = {
        url: removeUrl
    };
    const postmsg = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    };
    await fetch('/removeCard/a', postmsg);
}


async function refreshWebpage(){
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
    refreshWebpage();
    return null;
}


async function readDB() {
    let data = 'mongodb';
    let result = await fetch('/readDB/' + data);
    const json = await result.json();
    return json;
}

