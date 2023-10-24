const userList = document.querySelector('.user-list');

function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function deletePokemon(pokemonName) {
    const pokemons = getFromLocalStorage('pokemons');
    const updatedPokemons = pokemons.filter(pokemon => pokemon.name !== pokemonName);
    saveToLocalStorage('pokemons', updatedPokemons);
    renderPokemons(updatedPokemons);
}

function searchPokemonByName(name) {
    const pokemons = getFromLocalStorage('pokemons');
    const filteredPokemons = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(name.toLowerCase()));
    renderPokemons(filteredPokemons);
}

function renderPokemons(pokemons) {
    userList.innerHTML = '';
    const totalPokemonElement = document.getElementById('totalPokemon');
    totalPokemonElement.textContent = pokemons.length;
    pokemons.forEach(pokemon => {
        renderPokemon(pokemon);
    });
}

async function getPokemonData() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/');
        const data = await response.json();
        const pokemons = data.results;
        saveToLocalStorage('pokemons', pokemons);
        renderPokemons(pokemons);
    } catch (error) {
        console.log('Помилка під час отримання даних покемонів', error);
    }
}

function renderPokemon(pokemon) {
    const listItem = document.createElement('div');
    listItem.classList.add('user-item');

    const avatar = document.createElement('img');
    avatar.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + getPokemonId(pokemon.url) + '.png';
    avatar.alt = pokemon.name;
    avatar.classList.add('avatar');
    listItem.appendChild(avatar);

    const userDetails = document.createElement('div');
    userDetails.classList.add('user-details');
    const userInfo = document.createElement('div');
    userInfo.classList.add('user-info');

    const username = document.createElement('h3');
    username.textContent = pokemon.name;
    userInfo.appendChild(username);

    userDetails.appendChild(avatar);
    userDetails.appendChild(userInfo);
    listItem.appendChild(userDetails);

    const userActions = document.createElement('div');
    userActions.classList.add('user-actions');
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deletePokemon(pokemon.name));
    userActions.appendChild(deleteButton);
    listItem.appendChild(userActions);

    userList.appendChild(listItem);
}

function getPokemonId(pokemonUrl) {
    const urlParts = pokemonUrl.split('/');
    return urlParts[urlParts.length - 2];
}

getPokemonData();

const searchInput = document.querySelector('.search input[type="text"]');
const searchButton = document.querySelector('.search button');

searchButton.addEventListener('click', () => {
    const searchText = searchInput.value;
    searchPokemonByName(searchText);
});
