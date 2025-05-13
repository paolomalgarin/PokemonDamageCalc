function appendList(listId, options, rootElement, label = null) {
    const container = document.createElement('div');
    container.className = 'custom-select';

    // Genera ID univoci per ogni componente
    const dropdownId = `${listId}-dropdown`;
    const valueId = `${listId}-value`;

    container.innerHTML = `
        <div class="selected-option">
            <span id="${valueId}">${options[0]}</span>
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

    dropdownContent.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            valueSpan.textContent = option.textContent;
            dropdownContent.classList.remove('show');
            input.value = '';
            dropdownContent.querySelectorAll('.option').forEach(o => o.style.display = 'block');
        });
    });

    // Chiudi dropdown al click esterno
    document.addEventListener('click', (e) => {
        if (!container.contains(e.target)) {
            dropdownContent.classList.remove('show');
        }
    });
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
                <td><input type="number" min="0" max="31" value="31"></td>
                <td><input type="number" min="0" max="252" value="0"></td>
                <td>0</td> <!-- calcolo di base, ivs e evs -->
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Attack</td>
                <td><input type="number" id="${structureId}-atk-bs" value="${stats.atk}"></td>
                <td><input type="number" min="0" max="31" value="31"></td>
                <td><input type="number" min="0" max="252" value="0"></td>
                <td>0</td> <!-- calcolo di base, ivs e evs -->
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
                <td><input type="number" min="0" max="31" value="31"></td>
                <td><input type="number" min="0" max="252" value="0"></td>
                <td>0</td> <!-- calcolo di base, ivs e evs -->
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
                <td><input type="number" min="0" max="31" value="31"></td>
                <td><input type="number" min="0" max="252" value="0"></td>
                <td>0</td> <!-- calcolo di base, ivs e evs -->
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
                <td><input type="number" min="0" max="31" value="31"></td>
                <td><input type="number" min="0" max="252" value="0"></td>
                <td>0</td> <!-- calcolo di base, ivs e evs -->
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
                <td><input type="number" min="0" max="31" value="31"></td>
                <td><input type="number" min="0" max="252" value="0"></td>
                <td>0</td> <!-- calcolo di base, ivs e evs -->
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
                <td>0</td> <!-- calcolo di base, ivs e evs e multiplier -->
            </tr>
            <tr>
                <td>Total</td>
                <td></td>
                <td></td>
                <td>0</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </table>
    </div>
    `;
}

function addBarInteractions(barElement, maxHP, structureId) {
    const hpInput = document.getElementById(`${structureId}-hp`);
    const hpPercentage = document.getElementById(`${structureId}-hp-percentage`);

    // Da barra a input/percentuale
    barElement.addEventListener('change', (e) => {
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
        const percent = parseInt(barElement.value);
        const currentHP = Math.round((percent / 100) * maxHP);

        hpInput.value = currentHP;
        hpPercentage.textContent = `${percent}%`;
    });

    // Da input a barra/percentuale
    hpInput.addEventListener('change', () => {
        let currentHP = Math.min(maxHP, Math.max(0, parseInt(hpInput.value) || 0));
        const percent = Math.round((currentHP / maxHP));

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

function insertHealth(rootElement, structureId, maxHP) {
    rootElement.innerHTML = `
    <label for="${structureId}-hp-bar">Current HP </label><input type="number" id="${structureId}-hp" min="0" max="${maxHP}" value="${maxHP}">/${maxHP} (<span class="hp-percentage" id="${structureId}-hp-percentage">100%</span>)
    <input type="range" class="hp-input-range" min="0" max="${maxHP}" value="${maxHP}" step="1" id="${structureId}-hp-bar">
    `;

    // Aggiungi interazioni al range
    addBarInteractions(document.getElementById(`${structureId}-hp-bar`), maxHP, structureId);
}


function insertMoves(rootElement, structureId, moves) {
    rootElement.innerHTML = `
    `;
}


// funzione di base da modificare in base alla gen
function createPkmnContainerStructure_GENERIC(rootElement, structureId, title, pkmnName) {
    rootElement.innerHTML = `
        <h1>${title}</h1>
        <div class="pkmn-select" id="${structureId}-pkmn-select"></div>
        <div class="type" id="${structureId}-type"></div>
        <div class="level"><label for="${structureId}-level">Level </label><input type="number" id="${structureId}-level" min="0" max="100" value="100"></div>
        <div class="stats" id="${structureId}-stats"></div>
        <div class="nature" id="${structureId}-nature"></div>
        <div class="ability" id="${structureId}-ability"></div>
        <div class="item" id="${structureId}-item"></div>
        <div class="status" id="${structureId}-status"></div>
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


    appendList(`${structureId}-pkmn`, [pkmnName], document.getElementById(`${structureId}-pkmn-select`), 'Pokemon');

    appendList(`${structureId}-type-1`, types, document.getElementById(`${structureId}-type`), 'Types ');
    appendList(`${structureId}-type-2`, ['(none)', ...types], document.getElementById(`${structureId}-type`));

    insertStats(document.getElementById(`${structureId}-stats`), structureId, stats);

    appendList(`${structureId}-nature-select`, ['?'], document.getElementById(`${structureId}-nature`), 'Nature');
    appendList(`${structureId}-ability-select`, ['?'], document.getElementById(`${structureId}-ability`), 'Ability');
    appendList(`${structureId}-item-select`, ['(none)'], document.getElementById(`${structureId}-item`), 'Item');
    appendList(`${structureId}-status-select`, ['Healthy', 'Poisoned', 'Badly Poisoned', 'Burned', 'Paralyzed', 'Asleep', 'Frozen'], document.getElementById(`${structureId}-status`), 'Status');

    insertHealth(document.getElementById(`${structureId}-health`), structureId, 324);

    insertMoves(document.getElementById(`${structureId}-moves-container`), structureId, 324);
}