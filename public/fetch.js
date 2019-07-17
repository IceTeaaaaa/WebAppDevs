let web_card_number_displayed = 6;
let web_card_index_order_displayed = [0,1,2,3,4,5];
let right_bar_index_order_displayed = [0,1,2,3,4,5];
let web_card_url_array = new Array();
let right_side_bar_array = new Array();
let web_array_mongod = new Array();

readDB().then(function (result) {
    if(result[0] !== ""){
        web_card_url_array = result;
        refresh_webpage();
    } else {
        getTopNewsArray().then(function (result2) {
            web_card_url_array = result2;
            refresh_webpage();
        });
    }
    console.log(web_card_url_array);
})

getRightSideArray().then(function (result) {
    right_side_bar_array = result;
    refresh_webpage();
});

const delete_news = document.querySelectorAll('.delete_icon');
for(let delete_new of delete_news){
    delete_new.addEventListener('click', onDelete);
    delete_new.addEventListener('click', onApi);
}
const add_news_buttons = document.querySelectorAll(".add-to-top-news")
for(let add_news_button of add_news_buttons){
    add_news_button.addEventListener('click', addTopNews);
}

async function onApi(event) {
    event.preventDefault();

    const message = {
        url: web_card_url_array
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

        if(web_id != ""){
            var filtered = web_card_url_array.filter(function (value) {
                return value != web_id;
            });
            web_card_url_array = filtered;
            --web_card_number_displayed;
            web_card_index_order_displayed.pop();
        }
    }

    refresh_webpage();
    return null;
}

async function refresh_webpage(){
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
    console.log(1111);
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
    refresh_webpage();
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

async function readDB() {
    let data = 'mongodb';
    let result = await fetch('/dataset/' + data);
    const json = await result.json();
    return json.array;
}


// async function refreshIndex() {
//     await fetch('/');
// }
//
// setInterval(function() {
//     refreshIndex();
// }, 500)
//
//

//
// async function onSet(event) {
//   event.preventDefault();
//   await fetch('/web_mongod', );
//   console.log(123);
//
// }


// async function onSearch(event) {
//   event.preventDefault();
//   const input = document.querySelector('#word-input');
//   const word = input.value.trim();
//   const results = document.querySelector('#results');
//   results.classList.add('hidden');
//   const result = await fetch('/lookup/' + word);
//   const json = await result.json();
//   // Prep results.
//   const wordDisplay = results.querySelector('#word');
//   const defDisplay = results.querySelector('#definition');
//   wordDisplay.textContent = json.word;
//   defDisplay.textContent = json.definition;
//   // Prep set definition form.
//   const setWordInput = results.querySelector('#set-word-input');
//   const setDefInput = results.querySelector('#set-def-input');
//   setWordInput.value = json.word;
//   setDefInput.value = json.definition;
//   // Display.
//   results.classList.remove('hidden');
// }

// async function onSet(event) {
//   event.preventDefault();
//   const setWordInput = results.querySelector('#set-word-input');
//   const setDefInput = results.querySelector('#set-def-input');
//   const word = setWordInput.value;
//   const def = setDefInput.value;
//   const message = {
//     definition: def
//   };
//   const fetchOptions = {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(message)
//   };
//   const status = results.querySelector('#status');
//   status.textContent = '';
//   await fetch('/set/' + word, fetchOptions);
//   status.textContent = 'Saved.';
//   const defDisplay = results.querySelector('#definition');
//   defDisplay.textContent = def;
// }

// async function onSetNew(event) {
//   event.preventDefault();
//   const setNew = document.querySelector('#setNew');
//   const setNewWordInput = setNew.querySelector('#word-set');
//   const setNewDefInput = setNew.querySelector('#def-set');
//   const newWord = setNewWordInput.value;
//   const newDef = setNewDefInput.value;
//   const newMessage = {
//     definition: newDef
//   };
//   const newFetchOptions = {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(newMessage)
//   };
//   await fetch('/set/' + newWord, newFetchOptions);
//   console.log(newWord);
// }

// const searchForm = document.querySelector('#search');
// searchForm.addEventListener('submit', onSearch);

// const setForm = document.querySelector('#set');
// setForm.addEventListener('submit', onSet);

// const newSetForm = document.querySelector('#setNew');
// newSetForm.addEventListener('submit', onSetNew);