let web_card_number_displayed = 6;
let web_card_index_order_displayed = [0,1,2,3,4,5];
let right_bar_index_order_displayed = [0,1,2,3,4,5];


let text = load("weblist.txt");
var web_array = text.split(",");
var groupedArray = group(web_array, 6);
var web_card_url_array = groupedArray[0];
var right_side_bar_array = groupedArray[1];

function load(name) {
    let xhr = new XMLHttpRequest(),
        okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open('GET', name, false);
    xhr.overrideMimeType("text/html;charset=utf-8");//默认为utf-8
    xhr.send(null);
    return xhr.status === okStatus ? xhr.responseText : null;
}
refresh_webpage();


async function onDelete(event) {
    event.preventDefault();

    const deleteNews = event.currentTarget;

    const web_id = deleteNews.parentNode.childNodes[5].childNodes[1].childNodes[0].textContent;

    var filtered = web_card_url_array.filter(function(value){
        return value != web_id;
    });
    web_card_url_array = filtered;

    --web_card_number_displayed;
    var filtered_index_left = web_card_index_order_displayed.filter(function(value){
        return value != web_card_number_displayed;
    });
    web_card_index_order_displayed = filtered_index_left;

    refresh_webpage();

    return null;
}

console.log(document.querySelector('.web_card').childNodes[5].childNodes[1].href)

async function refresh_webpage(){
    const web_cards = document.querySelectorAll('.web_card');
    var i = 0;
    for(web_card of web_cards){
        web_card.childNodes[5].childNodes[1].childNodes[0].textContent = web_card_url_array[web_card_index_order_displayed[i]];
        web_card.childNodes[5].childNodes[1].childNodes[0].href = web_card_url_array[web_card_index_order_displayed[i]];
        web_card.childNodes[5].childNodes[3].childNodes[0].textContent = web_card_url_array[web_card_index_order_displayed[i]];
        web_card.childNodes[5].childNodes[3].childNodes[0].href = web_card_url_array[web_card_index_order_displayed[i++]];
    }
    const right_side_bars = document.querySelectorAll('.right-box-grid-title');
    var j = 0;
    for(right_side_bar of right_side_bars){
        right_side_bar.childNodes[1].childNodes[0].textContent = right_side_bar_array[right_bar_index_order_displayed[j]];
        right_side_bar.childNodes[1].childNodes[0].href = right_side_bar_array[right_bar_index_order_displayed[j++]];
    }
}

function group(array, subGroupLength) {
    let index = 0;
    let newArray = [];
    while(index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
    }
    return newArray;
}



const delete_news = document.querySelectorAll('.delete_icon');
for(let delete_new of delete_news){
    delete_new.addEventListener('click', onDelete);
}





// async function onDelete(event) {
//     event.preventDefault();
//     const deleteNews = event.currentTarget;
//     console.log(deleteNews.childNodes);
//
//     const web_id = deleteNews.childNodes[3].id;
//     const des_id = deleteNews.childNodes[5].id;
//
//     if(web_id == 'web_shortcut_1'){
//         document.getElementById(web_id).src=document.getElementById('web_shortcut_2').src;
//         document.getElementById(des_id).childNodes[1].textContent=document.getElementById('desc_2').childNodes[1].textContent;
//         document.getElementById(des_id).childNodes[3].textContent=document.getElementById('desc_2').childNodes[3].textContent;
//     }else if(web_id == 'web_shortcut_2'){
//         document.getElementById(web_id).src=document.getElementById('web_shortcut_3').src;
//         document.getElementById(des_id).childNodes[1].textContent=document.getElementById('desc_3').childNodes[1].textContent;
//         document.getElementById(des_id).childNodes[3].textContent=document.getElementById('desc_3').childNodes[3].textContent;
//     }else if(web_id == 'web_shortcut_3'){
//         document.getElementById(web_id).src=document.getElementById('web_shortcut_4').src;
//         document.getElementById(des_id).childNodes[1].textContent=document.getElementById('desc_4').childNodes[1].textContent;
//         document.getElementById(des_id).childNodes[3].textContent=document.getElementById('desc_4').childNodes[3].textContent;
//     }else if(web_id == 'web_shortcut_4'){
//         document.getElementById(web_id).src=document.getElementById('web_shortcut_5').src;
//         document.getElementById(des_id).childNodes[1].textContent=document.getElementById('desc_5').childNodes[1].textContent;
//         document.getElementById(des_id).childNodes[3].textContent=document.getElementById('desc_5').childNodes[3].textContent;
//     }else if(web_id == 'web_shortcut_5'){
//         document.getElementById(web_id).src=document.getElementById('web_shortcut_6').src;
//         document.getElementById(des_id).childNodes[1].textContent=document.getElementById('desc_6').childNodes[1].textContent;
//         document.getElementById(des_id).childNodes[3].textContent=document.getElementById('desc_6').childNodes[3].textContent;
//     }else if(web_id == 'web_shortcut_6'){
//         document.getElementById(web_id).src=document.getElementById('web_shortcut_6').src;
//         document.getElementById(des_id).childNodes[1].textContent=document.getElementById('desc_6').childNodes[1].textContent;
//         document.getElementById(des_id).childNodes[3].textContent=document.getElementById('desc_6').childNodes[3].textContent;
//     }
// }





//onclick="document.getElementById('web_shortcut_1').src=document.getElementById('web_shortcut_2').src, document.getElementById('desc_1').childNodes[1].textContent=document.getElementById('desc_2').childNodes[1].textContent, document.getElementById('desc_1').childNodes[3].textContent=document.getElementById('desc_2').childNodes[3].textContent"




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