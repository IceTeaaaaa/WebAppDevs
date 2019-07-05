async function onSearch(event) {
    event.preventDefault();
    const input = document.querySelector('#word-input');
    const word = input.value.trim();

    const results = document.querySelector('#results');
    results.classList.add('hidden');
    const result = await fetch('/lookup/' + word);
    const json = await result.json();


    // Prep results.
    const wordDisplay = results.querySelector('#word');
    const defDisplay = results.querySelector('#definition');
    wordDisplay.textContent = json.word;
    defDisplay.textContent = json.definition;

    // Prep set definition form.
    const setWordInput = results.querySelector('#set-word-input');
    const setDefInput = results.querySelector('#set-def-input');
    setWordInput.value = json.word;
    setDefInput.value = json.definition;

    // Display.
    results.classList.remove('hidden');
}

async function onSet(event) {
    event.preventDefault();
    const setWordInput = results.querySelector('#set-word-input');
    const setDefInput = results.querySelector('#set-def-input');
    const word = setWordInput.value;
    const def = setDefInput.value;

    const message = {
        definition: def
    };
    const fetchOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    };
    const status = results.querySelector('#status');
    status.textContent = '';
    await fetch('/set/' + word, fetchOptions);
    status.textContent = 'Saved.';

    const defDisplay = results.querySelector('#definition');
    defDisplay.textContent = def;
}

async function onSetNew(event) {
    event.preventDefault();
    const setNew = document.querySelector('#setNew');
    const setNewWordInput = setNew.querySelector('#word-set');
    const setNewDefInput = setNew.querySelector('#def-set');
    const newWord = setNewWordInput.value;
    const newDef = setNewDefInput.value;
    const newMessage = {
        definition: newDef
    };
    const newFetchOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMessage)
    };
    await fetch('/set/' + newWord, newFetchOptions);
    console.log(newWord);
}

const searchForm = document.querySelector('#search');
searchForm.addEventListener('submit', onSearch);

const setForm = document.querySelector('#set');
setForm.addEventListener('submit', onSet);

const newSetForm = document.querySelector('#setNew');
newSetForm.addEventListener('submit', onSetNew);