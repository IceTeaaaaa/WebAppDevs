let web_card_url_array = new Array();
let right_side_bar_array = new Array();


// attach event listener to interactive elements (like buttons) on webpages //
///////////////////////////////////////////////////////////////////////////
const delete_news = document.querySelectorAll('.delete_icon');
for(let delete_new of delete_news){
    delete_new.addEventListener('click', onDelete);
}
const add_news_buttons = document.querySelectorAll(".add-to-top-news")
for(let add_news_button of add_news_buttons){
    add_news_button.addEventListener('click', addTopNews);
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
    await fetch('/db/array/remove', generatePostmsg(message));
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

    // let allContent = replicate.getElementById("main_content");
    let allContent = replicate.children[0].children[1];

    let mainInfo = allContent.children[0].children[0];
    mainInfo.textContent = urlToAdd.split(".")[1];
    console.log(mainInfo);
    // mainInfo.children[0].children[0].textContent = urlToAdd;
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