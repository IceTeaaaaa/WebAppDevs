const username = document.querySelector('.username');

async function onEnroll(event) {
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
    wordDisplay.href = `/${json.word}`;
    defDisplay.textContent = json.definition;

    // Display.
    results.classList.remove('hidden');
}

document.querySelector('#btn_register').addEventListener('submit', function(event){
    event.preventDefault();
    const usr_input = document.querySelector('#username');
    const pass_input = document.querySelector('#password');
    const username = usr_input.value.trim();
    const password = pass_input.value.trim();
    console.log(username);
    console.log(password);

});
