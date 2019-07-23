let web_card_url_array = new Array();
let right_side_bar_array = new Array();


// attach event listener to interactive elements (like buttons) on webpages //
///////////////////////////////////////////////////////////////////////////
const delete_news = document.querySelectorAll('.delete_icon');
for(let delete_new of delete_news){
    delete_new.addEventListener('click', onDelete);
}
const add_news_buttons = document.querySelectorAll(".right-box-grid-button")
for(let add_news_button of add_news_buttons){
    add_news_button.addEventListener('click', addTopNews);
}

const web_cards = document.querySelectorAll('.web_card');
for(web_card of web_cards){
    web_card.onmouseover = function(){
        this.childNodes[1].classList.remove('hidden');
    };
    web_card.onmouseleave = function(){
        this.childNodes[1].classList.add('hidden');
    }
}




// Functions for interactive elements //
////////////////////////////////////////

// delete left cards websites
async function onDelete(event) {
    // Get id of this specific card. (Note: id is the url of the main site).
    console.log(event.currentTarget.parentNode.parentNode.attributes[1].value);
    let removeUrl = event.currentTarget.parentNode.parentNode.attributes[1].value;
    // let noSymbol = removeUrl.replace(/[^a-zA-Z ]/g, "");

    // remove it from dom tree
    event.currentTarget.parentNode.parentElement.remove();

    // update the database
    const message = {
        val: removeUrl,
        which: "url_array"
    };
    const message2 = {
        val: removeUrl,
        which: "right_side_url"
    }
    await fetch('/db/array/remove', generatePostmsg(message));
    await fetch('/db/array/add', generatePostmsg(message2));  // add it back to right side list
}

// add website on the list on the right to the left
async function addTopNews(event) {
    // get the url to be added to the left panel from right lists
    event.preventDefault();
    const urlToAdd = event.currentTarget.parentNode.children[1].children[0].children[0].attributes[0].value;
    console.log(urlToAdd);

    // remove it from the dom tree on the right
    event.currentTarget.parentNode.remove();  // can remove parentNode or parentElement. both work.

    // add it to the dom tree on the left
    const leftPanel = document.getElementById("leftPanel");
    console.log(leftPanel.childElementCount);

    // if odd number, clone a node on the right side of the two-column display.
    let replicate = leftPanel.children[0].cloneNode(true);
    if(leftPanel.childElementCount%2 === 1) {
        let replicate =leftPanel.children[1].cloneNode(true);
    }

    // reattach event listener
    replicate.querySelector('.delete_icon').addEventListener('click', onDelete);
    replicate.querySelector('.web_card').onmouseover = function(){
        this.childNodes[1].classList.remove('hidden');
    };
    replicate.querySelector('.web_card').onmouseover = function(){
        this.childNodes[1].classList.remove('hidden');
    };
    replicate.querySelector('.web_card').onmouseleave = function(){
        this.childNodes[1].classList.add('hidden');
    };
    replicate.setAttribute("id", urlToAdd);
    replicate.setAttribute("class", "lsidebar");

    // change actual card contents
    let allContent = replicate.children[0].children[1];
    let domainDisplay = allContent.children[0].children[0];
    domainDisplay.textContent = webName(urlToAdd);
    domainDisplay.setAttribute("href", urlToAdd);

    // remove old sublinks and added corresponding ones
    let listOfSub = allContent.children[1];
    while(listOfSub.firstChild) {
        listOfSub.removeChild(listOfSub.firstChild);
    }
    const message = {url: urlToAdd};
    const newSubUrls = await fetch('/redis/getSubUrls', generatePostmsg(message));
    const newSubUrlsJson = await newSubUrls.json();

    for(let url of newSubUrlsJson.urls) {
        let div = document.createElement("div");
        let linkInfo = document.createElement("a");
        div.appendChild(linkInfo);
        linkInfo.setAttribute("href", url);
        linkInfo.textContent = url;  // TODO: Change to title.
        listOfSub.appendChild(div);
    }


    leftPanel.appendChild(replicate);

    // update the mongodb database
    const messageAdd = {
        val: urlToAdd,
        which: "url_array",
    };
    const messageRemove = {
        val: urlToAdd,
        which: "right_side_url",
    };

    await fetch('/db/array/add', generatePostmsg(messageAdd));
    await fetch('/db/array/remove', generatePostmsg(messageRemove))

}


// Helper functions //
//////////////////////
function generatePostmsg(msg) {
    return {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(msg)
    };
}

function webName(siteName){
    let result = siteName.substring(0,siteName.length-5);
    //http
    if(result.substring(0,8) === "https://"){
        result = siteName.substring(8, result.length);
    }else if(result.substring(0,7) === "http://"){
        result = siteName.substring(7, result.length);
    }else{
        result = result;
    }
    if(result.substring(0,3) === "www"){
        result = result.substring(4, result.length);
    }else if(result.substring(0,4) === "blog"){
        result = result.substring(5, result.length);
    }else{
        result = result;
    }
    return result;
}



// async function onApi(event) {
//     event.preventDefault();
//
//     const message = {
//         url: web_card_url_array,
//         url2: right_side_bar_array
//     };
//     const fetchOptions = {
//         method: 'POST',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(message)
//     };
//     await fetch('/api', fetchOptions);
// }
// const setForm = document.querySelector('.refresh_button');
// setForm.addEventListener('click', onApi);