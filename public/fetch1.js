async function removeNews(event) {
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

const removeNews= document.querySelectorAll('.remove_news');
removeNews.addEventListener(onclick, removeNews);