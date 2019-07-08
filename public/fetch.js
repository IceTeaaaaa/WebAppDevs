const web_card_NL_1 = document.querySelector('.lsidebar').childNodes;
const web_card_NL_2 = document.querySelector('.lsidebar1').childNodes;
var web_card_array = [web_card_NL_1[1],web_card_NL_2[1],web_card_NL_1[3],web_card_NL_2[3],web_card_NL_1[5],web_card_NL_2[5]];
var web_card_ranked_array = ['https://en.wikipedia.org', 'https://www.youtube.com', 'https://arxiv.org', 'https://www.nytimes.com', 'https://www.reddit.com', 'https://www.infoq.com', 'https://www.washingtonpost.com', 'https://www.wired.com', 'https://spectrum.ieee.org', 'https://martinfowler.com', 'https://vimeo.com', 'https://medium.com', 'https://www.forbes.com', 'https://www.zdnet.com', 'https://techcrunch.com', 'https://www.slate.com', 'https://www.businessinsider.com', 'https://www.salon.com', 'https://www.slideshare.net', 'https://www.latimes.com', 'https://www.apple.com', 'https://www.quora.com', 'https://80000hours.org', 'https://www.npr.org', 'https://arstechnica.com', 'https://blog.codinghorror.com', 'https://www.oreilly.com', 'https://www.infoworld.com', 'https://www.drdobbs.com', 'https://openai.com', 'https://www.theguardian.com', 'https://lemire.me', 'https://blogs.msdn.microsoft.com', 'https://blogs.scientificamerican.com', 'https://aws.amazon.com', 'https://www.huffingtonpost.com', 'https://www.joelonsoftware.com', 'https://www.reuters.com', 'https://queue.acm.org', 'https://www.nature.com', 'https://www.johndcook.com', 'https://www.technologyreview.com', 'https://www.usatoday.com', 'https://www.theatlantic.com', 'https://www.bloomberg.com', 'https://matt.might.net', 'https://www.fast.ai', 'https://www.analyticsvidhya.com', 'https://www.vox.com', 'https://c2.com', 'https://www.computerhistory.org', 'https://gist.github.com', 'https://www.linuxvoice.com', 'https://daringfireball.net', 'https://www.rollingstone.com', 'https://battellemedia.com', 'https://triplebyte.com', 'https://www.cnbc.com', 'https://aphyr.com', 'https://www.theverge.com', 'https://digg.com', 'https://www.cl.cam.ac.uk', 'https://mashable.com', 'https://www.cbsnews.com', 'https://paulgraham.com', 'https://nymag.com', 'https://www.telegraph.co.uk', 'https://www.bbc.com', 'https://www.economist.com', 'https://www.newyorker.com', 'https://www.thedailybeast.com', 'https://www.sfgate.com'];
console.log(document.querySelector('.web_card').childNodes[5].childNodes[3].textContent);

refresh();

async function onDelete(event) {
    event.preventDefault();




    refresh();

    return null;
}

async function refresh(){
    const web_cards = document.querySelectorAll('.web_card');
    let index = 0;
    for(web_card of web_cards){
        web_card.childNodes[5].childNodes[1].textContent = web_card_ranked_array[index++];
        web_card.childNodes[5].childNodes[3].textContent = web_card_ranked_array[index++];
    }
}

function load(name) {
    let xhr = new XMLHttpRequest(),
        okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open('GET', name, false);
    xhr.overrideMimeType("text/html;charset=utf-8");//默认为utf-8
    xhr.send(null);
    return xhr.status === okStatus ? xhr.responseText : null;
}

let text = load("weblist.txt");
console.log(text);



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


const delete_news = document.querySelectorAll('.web_card');

for(let delete_new of delete_news){
    delete_new.addEventListener('click', onDelete);
}




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