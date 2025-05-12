// TODO rinomina il file con un nome sensato e mettilo in public/js

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
                <td><input type="text" id="${structureId}-hp-bs" value="${stats.hp}"></td>
                <td><input type="number" min="0" max="31" value="31"></td>
                <td><input type="number" min="0" max="252" value="0"></td>
                <td>0</td> <!-- calcolo di base, ivs e evs -->
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td>Attack</td>
                <td><input type="text" id="${structureId}-atk-bs" value="${stats.atk}"></td>
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
                <td><input type="text" id="${structureId}-def-bs" value="${stats.def}"></td>
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
                <td><input type="text" id="${structureId}-spa-bs" value="${stats.spa}"></td>
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
                <td><input type="text" id="${structureId}-spd-bs" value="${stats.spd}"></td>
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
                <td><input type="text" id="${structureId}-spe-bs" value="${stats.spe}"></td>
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
        </table>
    </div>
    `;
}


function createPkmnContainerStructure(rootElement, structureId, title, pkmnName) {
    rootElement.innerHTML = `
        <h1>${title}</h1>
        <div class="pkmn-select"></div>
        <div class="type"></div>
        <div class="level"><label for="${structureId}-level">Level </label><input type="number" id="${structureId}-level" min="0" max="100" value="100"></div>
        <div class="stats" id="${structureId}-stats"></div>
    `;


    const stats = {
        hp: 100,
        atk: 100,
        def: 100,
        spa: 100,
        spd: 100,
        spe: 100
    };
    insertStats(document.getElementById(`${structureId}-stats`), structureId, stats);
}