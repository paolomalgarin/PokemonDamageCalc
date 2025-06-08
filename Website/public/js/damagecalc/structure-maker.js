// Add at top of file
const STAT_DISPLAY_NAMES = {
    'atk': 'Atk',
    'def': 'Def',
    'spa': 'SpA',
    'spd': 'SpD',
    'spe': 'Spe'
};

const STATUSES = {
    "Healthy": ".\\public\\img\\status\\Healthy.png",
    "Asleep": ".\\public\\img\\status\\Asleep.png",
    "Burned": ".\\public\\img\\status\\Burned.png",
    "Frozen": ".\\public\\img\\status\\Frozen.png",
    "Paralyzed": ".\\public\\img\\status\\Paralysis.png",
    "Poisoned": ".\\public\\img\\status\\Poisoned.png",
    "Badly Poisoned": ".\\public\\img\\status\\PoisonedBad.png",
}

const NATURE_EFFECTS = {
    "Adamant": { plus: 'atk', minus: 'spa' },
    "Bold": { plus: 'def', minus: 'atk' },
    "Brave": { plus: 'atk', minus: 'spe' },
    "Calm": { plus: 'spd', minus: 'atk' },
    "Careful": { plus: 'spd', minus: 'spa' },
    "Gentle": { plus: 'spd', minus: 'def' },
    "Hasty": { plus: 'spe', minus: 'def' },
    "Impish": { plus: 'def', minus: 'spa' },
    "Jolly": { plus: 'spe', minus: 'spa' },
    "Lax": { plus: 'def', minus: 'spd' },
    "Lonely": { plus: 'atk', minus: 'def' },
    "Mild": { plus: 'spa', minus: 'def' },
    "Modest": { plus: 'spa', minus: 'atk' },
    "Naive": { plus: 'spe', minus: 'spd' },
    "Naughty": { plus: 'atk', minus: 'spd' },
    "Quiet": { plus: 'spa', minus: 'spe' },
    "Rash": { plus: 'spa', minus: 'spd' },
    "Relaxed": { plus: 'def', minus: 'spe' },
    "Sassy": { plus: 'spd', minus: 'spe' },
    "Timid": { plus: 'spe', minus: 'atk' }
};

function appendList(listId, options, rootElement, label = null, selected = null, onSelect = null) {
    const container = document.createElement('div');
    container.className = 'custom-select';

    // Genera ID univoci per ogni componente
    const dropdownId = `${listId}-dropdown`;
    const valueId = `${listId}-value`;

    container.innerHTML = `
        <div class="selected-option">
            <span id="${valueId}">${selected ? selected : options[0]}</span>
        </div>
        <div class="dropdown-content" id="${dropdownId}">
            <input type="text" 
                   class="dropdown-input" 
                   placeholder="Cerca..."
                   aria-label="Cerca opzioni">
            ${options.map(option => `
                <div class="option">${option}</div>
            `).join('')}
        </div>
    `;

    // Aggiungi label se specificata
    if (label) {
        const labelElement = document.createElement('label');
        labelElement.textContent = label;
        labelElement.htmlFor = listId;
        rootElement.appendChild(labelElement);
    }

    rootElement.appendChild(container);

    // Elementi DOM referenziati
    const selectedOption = container.querySelector('.selected-option');
    const dropdownContent = container.querySelector('.dropdown-content');
    const input = container.querySelector('.dropdown-input');
    const valueSpan = container.querySelector('span');

    // Gestione eventi
    selectedOption.addEventListener('click', () => {
        dropdownContent.classList.toggle('show');
        if (dropdownContent.classList.contains('show')) {
            input.focus();
        }
    });

    input.addEventListener('input', (e) => {
        const searchText = e.target.value.toLowerCase();
        const options = dropdownContent.querySelectorAll('.option');

        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            option.style.display = text.includes(searchText) ? 'block' : 'none';
        });
    });

    dropdownContent.addEventListener('click', (e) => {
        if (e.target.classList.contains('option')) {
            valueSpan.textContent = e.target.textContent;
            dropdownContent.classList.remove('show');
            input.value = '';
            dropdownContent.querySelectorAll('.option').forEach(o => o.style.display = 'block');

            // Chiama il callback di selezione se fornito
            if (onSelect) {
                onSelect(e.target.textContent);
            }
        }
    });

    // Chiudi dropdown al click esterno
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            dropdownContent.classList.remove('show');
        }
    });

    if (onSelect) {
        // Chiama il callback con il valore iniziale
        setTimeout(() => onSelect(valueSpan.textContent), 0);
    }
}


function insertStats(rootElement, structureId, stats) {
    rootElement.innerHTML = `
    <div class="stats">
        <table>
            <thead>
                <td></td>
                <td>Base</td>
                <td>IVs</td>
                <td>EVs</td>
                <td></td>
                <td></td>
                <td></td>
            </thead>
            <tr>
                <td>HP</td>
                <td><input type="number" id="${structureId}-hp-bs" value="${stats.hp}"></td>
                <td><input type="number" id="${structureId}-hp-iv" min="0" max="31" value="31"></td>
                <td><input type="number" id="${structureId}-hp-ev" min="0" max="252" value="0"></td>
                <td id="${structureId}-hp-calc">0</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Attack</td>
                <td><input type="number" id="${structureId}-atk-bs" value="${stats.atk}"></td>
                <td><input type="number" id="${structureId}-atk-iv" min="0" max="31" value="31"></td>
                <td><input type="number" id="${structureId}-atk-ev" min="0" max="252" value="0"></td>
                <td id="${structureId}-atk-calc">0</td>
                <td><select id="${structureId}-atk-multiplier">
                        <option value="6">+6</option>
                        <option value="5">+5</option>
                        <option value="4">+4</option>
                        <option value="3">+3</option>
                        <option value="2">+2</option>
                        <option value="1">+1</option>
                        <option value="0" selected>--</option>
                        <option value="-1">-1</option>
                        <option value="-2">-2</option>
                        <option value="-3">-3</option>
                        <option value="-4">-4</option>
                        <option value="-5">-5</option>
                        <option value="-6">-6</option>
                    </select></td>
                <td></td>
            </tr>
            <tr>
                <td>Defense</td>
                <td><input type="number" id="${structureId}-def-bs" value="${stats.def}"></td>
                <td><input type="number" id="${structureId}-def-iv" min="0" max="31" value="31"></td>
                <td><input type="number" id="${structureId}-def-ev" min="0" max="252" value="0"></td>
                <td id="${structureId}-def-calc">0</td>
                <td><select id="${structureId}-def-multiplier">
                        <option value="6">+6</option>
                        <option value="5">+5</option>
                        <option value="4">+4</option>
                        <option value="3">+3</option>
                        <option value="2">+2</option>
                        <option value="1">+1</option>
                        <option value="0" selected>--</option>
                        <option value="-1">-1</option>
                        <option value="-2">-2</option>
                        <option value="-3">-3</option>
                        <option value="-4">-4</option>
                        <option value="-5">-5</option>
                        <option value="-6">-6</option>
                    </select></td>
                <td></td>
            </tr>
            <tr>
                <td>Sp. Atk</td>
                <td><input type="number" id="${structureId}-spa-bs" value="${stats.spa}"></td>
                <td><input type="number" id="${structureId}-spa-iv" min="0" max="31" value="31"></td>
                <td><input type="number" id="${structureId}-spa-ev" min="0" max="252" value="0"></td>
                <td id="${structureId}-spa-calc">0</td>
                <td><select id="${structureId}-spa-multiplier">
                        <option value="6">+6</option>
                        <option value="5">+5</option>
                        <option value="4">+4</option>
                        <option value="3">+3</option>
                        <option value="2">+2</option>
                        <option value="1">+1</option>
                        <option value="0" selected>--</option>
                        <option value="-1">-1</option>
                        <option value="-2">-2</option>
                        <option value="-3">-3</option>
                        <option value="-4">-4</option>
                        <option value="-5">-5</option>
                        <option value="-6">-6</option>
                    </select></td>
                <td></td>
            </tr>
            <tr>
                <td>Sp. Def</td>
                <td><input type="number" id="${structureId}-spd-bs" value="${stats.spd}"></td>
                <td><input type="number" id="${structureId}-spd-iv" min="0" max="31" value="31"></td>
                <td><input type="number" id="${structureId}-spd-ev" min="0" max="252" value="0"></td>
                <td id="${structureId}-spd-calc">0</td>
                <td><select id="${structureId}-spd-multiplier">
                        <option value="6">+6</option>
                        <option value="5">+5</option>
                        <option value="4">+4</option>
                        <option value="3">+3</option>
                        <option value="2">+2</option>
                        <option value="1">+1</option>
                        <option value="0" selected>--</option>
                        <option value="-1">-1</option>
                        <option value="-2">-2</option>
                        <option value="-3">-3</option>
                        <option value="-4">-4</option>
                        <option value="-5">-5</option>
                        <option value="-6">-6</option>
                    </select></td>
                <td></td>
            </tr>
            <tr>
                <td>Speed</td>
                <td><input type="number" id="${structureId}-spe-bs" value="${stats.spe}"></td>
                <td><input type="number" id="${structureId}-spe-iv" min="0" max="31" value="31"></td>
                <td><input type="number" id="${structureId}-spe-ev" min="0" max="252" value="0"></td>
                <td id="${structureId}-spe-calc">0</td>
                <td><select id="${structureId}-spe-multiplier">
                        <option value="6">+6</option>
                        <option value="5">+5</option>
                        <option value="4">+4</option>
                        <option value="3">+3</option>
                        <option value="2">+2</option>
                        <option value="1">+1</option>
                        <option value="0" selected>--</option>
                        <option value="-1">-1</option>
                        <option value="-2">-2</option>
                        <option value="-3">-3</option>
                        <option value="-4">-4</option>
                        <option value="-5">-5</option>
                        <option value="-6">-6</option>
                    </select></td>
                <td id="${structureId}-spe-calc-multiplied">0</td> <!-- ADDED THIS -->
            </tr>
            <tr>
                <td>Total</td>
                <td></td>
                <td></td>
                <td id="${structureId}-total-evs">0</td> <!-- CHANGED THIS -->
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </table>
    </div>
    `;

    // Fix 4: Update event listeners
    const statsList = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

    // Sposta queste funzioni helper all'inizio
    const calculateSpeedWithMultiplier = () => {
        const baseSpeed = parseInt(document.getElementById(`${structureId}-spe-calc`).textContent) || 0;
        const multiplier = parseFloat(document.getElementById(`${structureId}-spe-multiplier`).value) || 0;

        const multiplierFactors = {
            '-6': 2 / 8, '-5': 2 / 7, '-4': 2 / 6, '-3': 2 / 5, '-2': 2 / 4,
            '-1': 2 / 3, '0': 1, '1': 3 / 2, '2': 4 / 2, '3': 5 / 2, '4': 6 / 2, '5': 7 / 2, '6': 8 / 2
        };

        const modifiedSpeed = Math.floor(baseSpeed * multiplierFactors[multiplier]);
        document.getElementById(`${structureId}-spe-calc-multiplied`).textContent = modifiedSpeed;
    };

    const updateTotalEVs = () => {
        const stats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
        let totalEVs = 0;

        stats.forEach(stat => {
            const evInput = document.getElementById(`${structureId}-${stat}-ev`);
            if (evInput) totalEVs += parseInt(evInput.value) || 0;
        });

        const totalCell = document.getElementById(`${structureId}-total-evs`);
        if (totalCell) {
            totalCell.textContent = totalEVs;
            totalCell.style.color = totalEVs > 508 ? 'red' : '';
        }
    };

    // Definisci calculateAllStats come variabile locale
    const calculateAllStats = () => {
        statsList.forEach(stat => calculateStat(stat));
        calculateSpeedWithMultiplier();
        updateTotalEVs();
    };

    // Assegna alla variabile globale
    window[`calculateAllStats_${structureId}`] = calculateAllStats;

    // Modifica gli event listener per usare la versione locale
    statsList.forEach(stat => {
        const inputs = [
            document.getElementById(`${structureId}-${stat}-bs`),
            document.getElementById(`${structureId}-${stat}-iv`),
            document.getElementById(`${structureId}-${stat}-ev`)
        ];

        inputs.forEach(input => {
            if (input) input.addEventListener('change', calculateAllStats);
        });
    });

    const calculateStat = (stat) => {
        const base = parseInt(document.getElementById(`${structureId}-${stat}-bs`).value) || 0;
        const iv = parseInt(document.getElementById(`${structureId}-${stat}-iv`).value) || 0;
        const ev = parseInt(document.getElementById(`${structureId}-${stat}-ev`).value) || 0;
        const level = parseInt(document.getElementById(`${structureId}-level`).value) || 100;

        let calculated;
        if (stat === 'hp') {
            calculated = Math.floor(0.01 * (2 * base + iv + Math.floor(ev / 4)) * level) + level + 10;
        } else {
            calculated = Math.floor(0.01 * (2 * base + iv + Math.floor(ev / 4)) * level) + 5;
        }

        document.getElementById(`${structureId}-${stat}-calc`).textContent = calculated;
        updateTotalEVs(structureId); // ADD THIS LINE// Apply nature multiplier

        // 1. Recupera la natura attuale
        const natureSelectElement = document.getElementById(`${structureId}-nature-select-value`);
        let natureEffect = null;
        if (natureSelectElement) {
            const natureName = natureSelectElement.textContent.split(' ')[0];
            natureEffect = NATURE_EFFECTS[natureName];
        }

        // 2. Applica modificatori natura
        if (natureEffect && stat !== 'hp') {
            if (natureEffect.plus === stat) {
                calculated = Math.floor(calculated * 1.1);
            } else if (natureEffect.minus === stat) {
                calculated = Math.floor(calculated * 0.9);
            }
        }

        // 3. Aggiorna colore
        const calcCell = document.getElementById(`${structureId}-${stat}-calc`);
        calcCell.textContent = calculated;

        if (natureEffect) {
            calcCell.style.color = natureEffect.plus === stat ? 'green' :
                natureEffect.minus === stat ? 'red' : '';
        } else {
            calcCell.style.color = '';
        }
    };

    const natureSelect = document.getElementById(`${structureId}-nature-select`);
    if (natureSelect) {
        natureSelect.addEventListener('change', calculateAllStats);
    }

    // Add multiplier change listener
    const speedMultiplier = document.getElementById(`${structureId}-spe-multiplier`);
    if (speedMultiplier) {
        speedMultiplier.addEventListener('change', () => {
            calculateSpeedWithMultiplier(structureId);
        });
    }

    // Update calculateAllStats
    window[`calculateAllStats_${structureId}`] = () => {
        statsList.forEach(stat => calculateStat(stat));
        calculateSpeedWithMultiplier(structureId);
        updateTotalEVs(structureId); // ADD THIS
    };

    // Add event listeners to all inputs
    statsList.forEach(stat => {
        const inputs = [
            document.getElementById(`${structureId}-${stat}-bs`),
            document.getElementById(`${structureId}-${stat}-iv`),
            document.getElementById(`${structureId}-${stat}-ev`)
        ];

        inputs.forEach(input => {
            if (input) {
                input.addEventListener('change', calculateAllStats);
            }
        });
    });

    // Add event listener to level input
    const levelInput = document.getElementById(`${structureId}-level`);
    if (levelInput) {
        levelInput.addEventListener('change', calculateAllStats);
    }

    // Add EV input validation and total update
    statsList.forEach(stat => {
        const evInput = document.getElementById(`${structureId}-${stat}-ev`);
        if (evInput) {
            evInput.addEventListener('change', () => {
                // Limit EVs to 252 per stat
                if (evInput.value > 252) evInput.value = 252;
                if (evInput.value < 0) evInput.value = 0;
                calculateAllStats();
            });
        }
    });

    // Add multiplier change listener
    const multiplierSelect = document.getElementById(`${structureId}-spe-multiplier`);
    if (multiplierSelect) {
        multiplierSelect.addEventListener('change', () => {
            calculateSpeedWithMultiplier(structureId);
        });
    }

}

function addBarInteractions(barElement, maxHP, structureId) {
    const hpInput = document.getElementById(`${structureId}-hp`);
    const hpPercentage = document.getElementById(`${structureId}-hp-percentage`);

    // Da barra a input/percentuale
    barElement.addEventListener('input', (e) => {
        // parte di stile
        const value = e.target.value;
        const max = e.target.max || 100; // Default a 100 se manca l'attributo
        const percentage = (value / max) * 100;

        // Aggiorna la CSS variable
        e.target.style.setProperty('--fill-percentage', percentage + '%');

        // setto il colore
        if (percentage < 50) {
            if (percentage < 20) {
                e.target.style.setProperty('--light-fill-color', 'var(--red)');
                e.target.style.setProperty('--dark-fill-color', 'var(--dark-red)');
            } else {
                e.target.style.setProperty('--light-fill-color', 'var(--orange)');
                e.target.style.setProperty('--dark-fill-color', 'var(--dark-orange)');
            }
        } else {
            e.target.style.setProperty('--light-fill-color', 'var(--green)');
            e.target.style.setProperty('--dark-fill-color', 'var(--dark-green)');
        }

        // conti
        const percent = Math.round(parseInt(barElement.value) / maxHP * 100);
        const currentHP = Math.round((percent / 100) * maxHP);

        hpInput.value = currentHP;
        hpPercentage.textContent = `${percent}%`;
    });

    // Da input a barra/percentuale
    hpInput.addEventListener('change', () => {
        let currentHP = Math.min(maxHP, Math.max(0, parseInt(hpInput.value) || 0));
        const percent = Math.round(currentHP / maxHP * 100);

        barElement.value = currentHP;
        hpPercentage.textContent = `${percent}%`;

        // Aggiorna la CSS variable
        barElement.style.setProperty('--fill-percentage', percent + '%');

        // setto il colore
        if (percent < 50) {
            if (percent < 20) {
                barElement.style.setProperty('--light-fill-color', 'var(--red)');
                barElement.style.setProperty('--dark-fill-color', 'var(--dark-red)');
            } else {
                barElement.style.setProperty('--light-fill-color', 'var(--orange)');
                barElement.style.setProperty('--dark-fill-color', 'var(--dark-orange)');
            }
        } else {
            barElement.style.setProperty('--light-fill-color', 'var(--green)');
            barElement.style.setProperty('--dark-fill-color', 'var(--dark-green)');
        }
    });
}
// Update insertHealth function
function insertHealth(rootElement, structureId, maxHP) {
    rootElement.innerHTML = `
    <label for="${structureId}-hp-bar">Current HP </label>
    <input type="number" id="${structureId}-hp" min="0" max="${maxHP}" value="${maxHP}">
    /${maxHP} (<span class="hp-percentage" id="${structureId}-hp-percentage">100%</span>)
    <input type="range" class="hp-input-range" min="0" max="${maxHP}" value="${maxHP}" step="1" id="${structureId}-hp-bar">
    `;

    // Add interactions
    const barElement = document.getElementById(`${structureId}-hp-bar`);
    if (barElement) {
        addBarInteractions(barElement, maxHP, structureId);
    }
}


// Modifica la funzione insertMoves
function insertMoves(rootElement, structureId, moves, all_moves, types) {
    rootElement.innerHTML = ''; // Pulisci il contenitore

    // Funzione per aggiornare i dettagli quando si cambia mossa
    const updateMoveDetails = async (index, moveName) => {
        const details = await fetchMoveDetails(moveName);

        // Aggiorna il tipo
        const typeValue = document.getElementById(`${structureId}-move-type-${index}-value`);
        if (typeValue) typeValue.textContent = details.type;

        // Aggiorna il base power
        const bspInput = document.getElementById(`${structureId}-move-bsp-${index}`);
        if (bspInput) bspInput.value = details.bsp;

        // Aggiorna la categoria
        const categorySelect = document.getElementById(`${structureId}-move-category-${index}`);
        if (categorySelect) categorySelect.value = details.category;
    };

    // Crea 4 slot per le mosse
    for (let i = 0; i < 4; i++) {
        const moveDiv = document.createElement('div');
        moveDiv.classList = 'move-container';
        moveDiv.id = `${structureId}-move-${i}-container`;

        const move = moves[i] || {
            name: all_moves[0] || 'tackle',
            bsp: 0,
            type: 'Normal',
            category: 'physical'
        };

        // Dropdown per selezionare la mossa
        appendList(
            `${structureId}-move-${i}`,
            all_moves,
            moveDiv,
            null,
            move.name,
            (selected) => updateMoveDetails(i, selected)
        );

        // Campi per i dettagli della mossa
        moveDiv.insertAdjacentHTML('beforeend', `
            <input type="number" id="${structureId}-move-bsp-${i}" value="${move.bsp}">
        `);

        // Dropdown per il tipo (sola visualizzazione)
        appendList(
            `${structureId}-move-type-${i}`,
            types,
            moveDiv,
            null,
            move.type
        );

        // Dropdown per la categoria
        moveDiv.insertAdjacentHTML('beforeend', `
            <select id="${structureId}-move-category-${i}">
                <option value="physical" ${move.category === 'physical' ? 'selected' : ''}>physical</option>
                <option value="special" ${move.category === 'special' ? 'selected' : ''}>special</option>
            </select>
            <input type="checkbox" id="${structureId}-move-iscrit-${i}" style="display: none;">
            <label for="${structureId}-move-iscrit-${i}" class="crit-btn">crit</label>
        `);

        rootElement.appendChild(moveDiv);

        // After creating the move container:
        setTimeout(() => {
            if (moves[i]) {
                updateMoveDetails(i, moves[i].name);
            }
        }, 0);
    }
}


// funzione di base da modificare in base alla gen
function createPkmnContainerStructure_GENERIC(rootElement, structureId, title, pkmnName) {
    rootElement.innerHTML = `
        <div class="pkmn-sprite">
            <img id="${structureId}-sprite" src="" alt="${pkmnName} sprite" class="sprite">
            <img id="${structureId}-sprite-status" src=".\\public\\img\\status\\Healthy.png" alt="${pkmnName} status" class="pkmn-sprite-status">
        </div>
        <h1>${title}</h1>
        <div class="pkmn-select" id="${structureId}-pkmn-select"></div>
        <div class="type" id="${structureId}-type"></div>
        <div class="level"><label for="${structureId}-level">Level </label><input type="number" id="${structureId}-level" min="0" max="100" value="100"></div>
        <div class="stats" id="${structureId}-stats"></div>
        <div class="selectables-container">
            <div class="nature" id="${structureId}-nature"></div>
            <div class="ability" id="${structureId}-ability"></div>
            <div class="item" id="${structureId}-item"></div>
            <div class="status" id="${structureId}-status"></div>
        </div>
        <div class="health" id="${structureId}-health"></div>
        <div class="moves-container" id="${structureId}-moves-container"></div>
    `;


    const stats = {
        hp: 100,
        atk: 100,
        def: 100,
        spa: 100,
        spd: 100,
        spe: 100
    };
    const types = ['???', 'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Steel', 'Dragon', 'Dark', 'Fairy'];
    const moves = [
        {
            name: 'blizzard',
            bsp: 110,
            type: 'ice',
            category: 'special'
        },
        {
            name: 'blizzard',
            bsp: 110,
            type: 'ice',
            category: 'physical'
        },
        {
            name: 'blizzard',
            bsp: 110,
            type: 'ice',
            category: 'special'
        },
        {
            name: 'blizzard',
            bsp: 110,
            type: 'ice',
            category: 'special'
        },
    ];
    // Aggiungi questo array all'inizio del file
    const NATURES = Object.entries(NATURE_EFFECTS).map(([name, effect]) => {
        return `${name} (+${STAT_DISPLAY_NAMES[effect.plus]} -${STAT_DISPLAY_NAMES[effect.minus]})`;
    }).concat([
        "Bashful", "Docile", "Hardy", "Quirky", "Serious"
    ]).sort();

    // Aggiungi callback per gestire la selezione del Pokémon
    const onPokemonSelect = async (selectedName) => {
        const pkmnData = await fetchPkmnData(selectedName);
        if (!pkmnData) return;

        // Update sprite
        const spriteUrl = await fetchPkmnSprite(selectedName);
        document.getElementById(`${structureId}-sprite`).src = spriteUrl;

        // Aggiorna i tipi
        updateTypes(structureId, pkmnData.types);

        // Aggiorna le statistiche
        updateBaseStats(structureId, {
            hp: pkmnData.stats[0].base_stat,
            attack: pkmnData.stats[1].base_stat,
            defense: pkmnData.stats[2].base_stat,
            'special-attack': pkmnData.stats[3].base_stat,
            'special-defense': pkmnData.stats[4].base_stat,
            speed: pkmnData.stats[5].base_stat
        });

        // Aggiorna le mosse con tutte le mosse disponibili
        const allMoves = pkmnData.moves.map(m =>
            m.move.name.charAt(0).toUpperCase() + m.move.name.slice(1)
        );
        updateMoves(structureId, allMoves);

        // Aggiorna le abilità
        const abilities = await fetchAbilities(selectedName);
        updateAbilities(structureId, abilities);
    };

    // Set initial sprite
    (async () => {
        const spriteUrl = await fetchPkmnSprite(pkmnName);
        document.getElementById(`${structureId}-sprite`).src = spriteUrl;
    })();

    // Modifica la chiamata appendList per il Pokémon
    appendList(`${structureId}-pkmn`, [pkmnName], document.getElementById(`${structureId}-pkmn-select`), 'Pokemon');

    // Popola il dropdown con i nomi e collega il callback
    fetchPkmnNames(
        document.getElementById(`${structureId}-pkmn-dropdown`),
        onPokemonSelect
    );

    appendList(`${structureId}-type-1`, types, document.getElementById(`${structureId}-type`), 'Types ');
    appendList(`${structureId}-type-2`, ['(none)', ...types], document.getElementById(`${structureId}-type`));

    insertStats(document.getElementById(`${structureId}-stats`), structureId, stats);

    appendList(
        `${structureId}-nature-select`,
        NATURES,
        document.getElementById(`${structureId}-nature`),
        'Nature',
        'Serious',
        // Aggiungi questo callback
        () => {
            const calculateAllStats = window[`calculateAllStats_${structureId}`];
            if (calculateAllStats) calculateAllStats();
        }
    );

    appendList(`${structureId}-ability-select`, ['?'], document.getElementById(`${structureId}-ability`), 'Ability');
    appendList(`${structureId}-item-select`, ['(none)'], document.getElementById(`${structureId}-item`), 'Item');
    appendList(
        `${structureId}-status-select`, 
        ['Healthy', 'Poisoned', 'Badly Poisoned', 'Burned', 'Paralyzed', 'Asleep', 'Frozen'], 
        document.getElementById(`${structureId}-status`), 
        'Status',
        null,
        () => {
            let status = document.getElementById(`${structureId}-status-select-value`).innerText;
            document.getElementById(`${structureId}-sprite-status`).src = STATUSES[status];
        }
    );

    insertHealth(document.getElementById(`${structureId}-health`), structureId, 324);

    insertMoves(document.getElementById(`${structureId}-moves-container`), structureId, moves, [], types);


}



// Aggiungi questa funzione per aggiornare le statistiche
function updateBaseStats(structureId, stats) {
    document.getElementById(`${structureId}-hp-bs`).value = stats.hp;
    document.getElementById(`${structureId}-atk-bs`).value = stats.attack;
    document.getElementById(`${structureId}-def-bs`).value = stats.defense;
    document.getElementById(`${structureId}-spa-bs`).value = stats['special-attack'];
    document.getElementById(`${structureId}-spd-bs`).value = stats['special-defense'];
    document.getElementById(`${structureId}-spe-bs`).value = stats.speed;

    // Recalculate all stats
    const calculateAllStats = window[`calculateAllStats_${structureId}`];
    if (calculateAllStats) calculateAllStats();
}

// Aggiungi questa funzione per aggiornare i tipi
function updateTypes(structureId, types) {
    const type1 = types[0].type.name.charAt(0).toUpperCase() + types[0].type.name.slice(1);
    const type2 = types[1] ? types[1].type.name.charAt(0).toUpperCase() + types[1].type.name.slice(1) : '(none)';

    document.getElementById(`${structureId}-type-1-value`).textContent = type1;
    document.getElementById(`${structureId}-type-2-value`).textContent = type2;
}

// Aggiungi questa funzione per aggiornare le mosse
// Modifica la funzione
async function updateMoves(structureId, all_moves) {
    // Controllo per array vuoto
    if (!all_moves || all_moves.length === 0) {
        all_moves = ['Tackle'];
    }
    // Fetch details for first 4 moves
    const moveDetails = await Promise.all(
        all_moves.slice(0, 4).map(async name => {
            const details = await fetchMoveDetails(name);
            return {
                name,
                bsp: details.bsp,
                type: details.type,
                category: details.category
            };
        })
    );

    // Now insert moves with actual details
    const movesContainer = document.getElementById(`${structureId}-moves-container`);
    const types = ['???', 'Normal', 'Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Steel', 'Dragon', 'Dark', 'Fairy'];
    insertMoves(movesContainer, structureId, moveDetails, all_moves, types);
}

function updateAbilities(structureId, abilities) {
    const abilityDropdown = document.getElementById(`${structureId}-ability-select-dropdown`);
    // Pulisci le opzioni esistenti
    const options = abilityDropdown.querySelectorAll('.option');
    options.forEach(option => option.remove());

    // Aggiungi le nuove abilità
    abilities.forEach(ability => {
        const option = document.createElement('div');
        option.className = 'option';
        option.textContent = ability;
        abilityDropdown.appendChild(option);
    });

    // Imposta la prima abilità come selezionata
    const valueSpan = document.getElementById(`${structureId}-ability-select-value`);
    if (abilities.length > 0) {
        valueSpan.textContent = abilities[0];
    }

    const calculateAllStatsFunc = window[`calculateAllStats_${structureId}`];
    if (calculateAllStatsFunc) {
        calculateAllStatsFunc();
    }
}


// Add this function to calculate total EVs
function updateTotalEVs(structureId) {
    const stats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
    let totalEVs = 0;

    stats.forEach(stat => {
        const evInput = document.getElementById(`${structureId}-${stat}-ev`);
        if (evInput) {
            totalEVs += parseInt(evInput.value) || 0;
        }
    });

    const totalCell = document.querySelector(`#${structureId}-stats tr:last-child td:nth-child(4)`);
    if (totalCell) {
        totalCell.textContent = totalEVs;
        // Highlight in red if over limit (Gen 8: 508 EVs max)
        totalCell.style.color = totalEVs > 508 ? 'red' : '';
    }
}


// Add multiplier calculation for speed
function calculateSpeedWithMultiplier(structureId) {
    const baseSpeed = parseInt(document.getElementById(`${structureId}-spe-calc`).textContent) || 0;
    const multiplier = parseFloat(document.getElementById(`${structureId}-spe-multiplier`).value) || 0;

    // Stage multipliers: -6 to +6
    const multiplierFactors = {
        '-6': 2 / 8, '-5': 2 / 7, '-4': 2 / 6, '-3': 2 / 5, '-2': 2 / 4,
        '-1': 2 / 3, '0': 1, '1': 3 / 2, '2': 4 / 2, '3': 5 / 2, '4': 6 / 2, '5': 7 / 2, '6': 8 / 2
    };

    const modifiedSpeed = Math.floor(baseSpeed * multiplierFactors[multiplier]);
    document.querySelector(`#${structureId}-stats tr:nth-child(6) td:last-child`).textContent = modifiedSpeed;
}

// In insertStats function, add these helper functions:
