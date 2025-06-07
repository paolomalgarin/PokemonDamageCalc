// Aggiungi questa nuova funzione per ottenere i dati completi del Pokémon
async function fetchPkmnData(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        return await response.json();
    } catch (error) {
        console.error('Errore nel fetch dati Pokémon:', error);
        return null;
    }
}

// Modifica la funzione esistente per supportare il callback
function fetchPkmnNames(dropdown, onSelectCallback) {
    const input = dropdown.querySelector('.dropdown-input');
    if (!input) {
        dropdown.innerHTML = '<input type="text" class="dropdown-input" placeholder="Cerca..." aria-label="Cerca opzioni">';
    }

    fetch('https://pokeapi.co/api/v2/pokemon?limit=1500')
        .then(response => response.json())
        .then(data => {
            const names = data.results.map(pokemon =>
                pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
            );
            names.sort();

            const options = dropdown.querySelectorAll('.option');
            options.forEach(option => option.remove());

            names.forEach(name => {
                const option = document.createElement('div');
                option.className = 'option';
                option.textContent = name;
                option.addEventListener('click', () => onSelectCallback(name));
                dropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Errore nel fetch:', error));
}

// Aggiungi questa funzione
async function fetchMoveDetails(moveName) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName.toLowerCase()}`);
        const data = await response.json();
        return {
            name: moveName,
            bsp: data.power || 0,
            type: data.type.name,
            category: data.damage_class.name
        };
    } catch (error) {
        console.error('Errore nel fetch dettagli mossa:', error);
        return {
            name: moveName,
            bsp: 0,
            type: 'Normal',
            category: 'physical'
        };
    }
}

// Aggiungi questa funzione
async function fetchAbilities(pokemonName) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
        const data = await response.json();
        return data.abilities.map(a =>
            a.ability.name.charAt(0).toUpperCase() + a.ability.name.slice(1)
        );
    } catch (error) {
        console.error('Errore nel fetch abilità:', error);
        return ['?'];
    }
}

// Add this function to fetch Pokémon sprite
async function fetchPkmnSprite(name) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
        const data = await response.json();
        return data.sprites.front_default || '';
    } catch (error) {
        console.error('Errore nel fetch sprite Pokémon:', error);
        return '';
    }
}

