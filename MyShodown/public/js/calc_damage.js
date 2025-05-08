/*
    $lvl (int):
        Il livello del Pokémon attaccante (es. 50, 100).
    $bsp (int):
        La potenza base della mossa usata (es. 90 per "Thunderbolt").
    $attack_stat (int):
        Il valore dell'Attacco o Attacco Speciale del Pokémon attaccante, a seconda del tipo della mossa.
    $attack_multiplier (float):
        Il moltiplicatore dell'Attacco o Attacco Speciale del Pokémon attaccante (tipo sword dance = x2, bulk up = x1.5 atk, x1.5 def).
    $defense_stat (int):
        Il valore della Difesa o Difesa Speciale del Pokémon difensore, a seconda del tipo della mossa.
    $defense_multiplier (float):
        Il moltiplicatore della Difesa o Difesa Speciale del Pokémon attaccante (tipo sword dance = x2, bulk up = x1.5 atk, x1.5 def).
    $type_effectiveness (float):
        Il moltiplicatore di efficacia del tipo (es. 2.0 per superefficace, 0.5 per non molto efficace).
    $stab (bool, default false):
            Indica se la mossa beneficia dello STAB (Same-Type Attack Bonus). Se true, applica un moltiplicatore di 1.5.
    $critical_multiplier (float, default 1.0):
            Il moltiplicatore per i colpi critici (es. 1.5 o 2.0, a seconda della generazione del gioco).
    $other_multipliers (float, default 1.0):
            Il prodotto di altri modificatori come oggetti, abilità, condizioni atmosferiche (es. 1.3 per "Life Orb").
    $random (int, default 0):git 
            Se applicare un fattore casuale tra 0.85 e 1.0. 0 = fattore random, 1 = max, -1 = min
*/

// Danno = (((2 * Level / 5 + 2) * Power * (Attack / Defense)) / 50 + 2) * Modifiers
// Modifiers = STAB * Type Effectiveness * Critical * Other * Random

function calc_generic_damage(
    lvl,
    bsp,
    attack_stat,
    attack_multiplier = 1.0,
    defense_stat,
    defense_multiplier = 1.0,
    type_effectiveness,
    stab = false,
    critical_multiplier = 1.0,
    other_multipliers = 1.0,
    random = 0
) {
    // Gestione del moltiplicatore random
    let rand_mult;
    switch(random) {
        case 1: rand_mult = 1.0; break;
        case -1: rand_mult = 0.85; break;
        default: rand_mult = (Math.floor(Math.random() * 16) + 85) / 100;
    }

    // Calcoli step-by-step
    const step1 = Math.floor((2 * lvl) / 5 + 2);
    const step2 = Math.floor(step1 * bsp * (attack_stat * attack_multiplier) / (defense_stat * defense_multiplier));
    const step3 = Math.floor(step2 / 50) + 2;
    
    return Math.floor(step3 * 
        (stab ? 1.5 : 1) * 
        type_effectiveness * 
        critical_multiplier * 
        other_multipliers * 
        rand_mult
    );
}

function calc_generic_damage_in_perc(
    def_HP,
    lvl,
    bsp,
    attack_stat,
    attack_multiplier = 1.0,
    defense_stat,
    defense_multiplier = 1.0,
    type_effectiveness,
    stab = false,
    critical_multiplier = 1.0,
    other_multipliers = 1.0,
    random = 0
) {
    const danno = calc_generic_damage(
        lvl, bsp, attack_stat, attack_multiplier, 
        defense_stat, defense_multiplier, type_effectiveness, 
        stab, critical_multiplier, other_multipliers, random
    );
    return Math.floor((danno / def_HP) * 100);
}

function get_damage_perc(defHP, damage) {
    if (defHP <= 0) return 0.0; // Evita divisione per zero
    const raw_perc = (damage / defHP) * 100;
    return Number(raw_perc.toFixed(2)); // Arrotonda a 2 decimali e converte in numero
}

function calc_damage_gen1(
    lvl,
    bsp,
    attack_stat,
    attack_multiplier = 1.0,
    defense_stat,
    defense_multiplier = 1.0,
    type_effectiveness,
    stab = false,
    is_critical = false,
    other_multipliers = 1.0,
    random = 0
) {
    // Gestione del moltiplicatore random (85-100%)
    let rand_mult;
    switch(random) {
        case 1: rand_mult = 1.0; break;
        case -1: rand_mult = 0.85; break;
        default: 
            rand_mult = (Math.floor(Math.random() * 16) + 85); // 85-100
            rand_mult /= 100;
    }

    // Logica specifica Gen 1 per i colpi critici
    let critical_multiplier, attack, defense, stab_type_mult;
    
    if(is_critical) {
        // I critici ignorano i modificatori di stat e usano valori base
        attack = attack_stat; // Original attack stat (no multiplier)
        defense = defense_stat; // Original defense stat (no multiplier)
        critical_multiplier = 2.0;
        
        // STAB × Type Effectiveness viene elevato al quadrato
        const base_mult = (stab ? 1.5 : 1) * type_effectiveness;
        stab_type_mult = base_mult * base_mult;
    } else {
        // Calcoli normali con modificatori
        attack = attack_stat * attack_multiplier;
        defense = defense_stat * defense_multiplier;
        critical_multiplier = 1.0;
        stab_type_mult = (stab ? 1.5 : 1) * type_effectiveness;
    }

    // Calcoli step-by-step con flooring a ogni passaggio
    const step1 = Math.floor((2 * lvl) / 5 + 2);
    const step2 = Math.floor(step1 * bsp * attack / defense);
    const step3 = Math.floor(step2 / 50) + 2;
    
    // Calcolo finale con tutti i modificatori
    return Math.floor(
        step3 * 
        stab_type_mult * 
        critical_multiplier * 
        other_multipliers * 
        rand_mult
    );
}

function calc_damage_gen2_5(
    lvl,
    bsp,
    attack_stat,
    attack_multiplier = 1.0,
    defense_stat,
    defense_multiplier = 1.0,
    type_effectiveness,
    stab = false,
    is_critical = false,
    other_multipliers = 1.0,
    random = 0
) {
    // Gestione del fattore random (85-100% con intervalli di 1%)
    let rand_mult;
    switch(random) {
        case 1: 
            rand_mult = 1.0;
            break;
        case -1: 
            rand_mult = 0.85;
            break;
        default:
            rand_mult = (Math.floor(Math.random() * 16) + 85) / 100;
    }

    // I critici Gen 2-5: ×2 ma usano i modificatori attuali
    const critical_multiplier = is_critical ? 2.0 : 1.0;

    // Calcolo passo-passo con flooring
    const step1 = Math.floor((2 * lvl) / 5 + 2);
    const step2 = Math.floor(
        step1 * 
        bsp * 
        (attack_stat * attack_multiplier) / 
        (defense_stat * defense_multiplier)
    );
    const step3 = Math.floor(step2 / 50) + 2;
    
    // Applicazione finale di tutti i modificatori
    return Math.floor(
        step3 * 
        (stab ? 1.5 : 1) * 
        type_effectiveness * 
        critical_multiplier * 
        other_multipliers * 
        rand_mult
    );
}
function calc_damage_gen6plus(
    lvl,
    bsp,
    attack_stat,
    attack_multiplier = 1.0,
    defense_stat,
    defense_multiplier = 1.0,
    type_effectiveness,
    stab = false,
    is_critical = false,
    other_multipliers = 1.0,
    random = 0
) {
    // Gestione del fattore random (85-100%)
    let rand_mult;
    switch(random) {
        case 1: 
            rand_mult = 1.0;
            break;
        case -1: 
            rand_mult = 0.85;
            break;
        default:
            rand_mult = (Math.floor(Math.random() * 16) + 85) / 100;
    }

    // I critici Gen6+ hanno moltiplicatore 1.5×
    const critical_multiplier = is_critical ? 1.5 : 1.0;

    // Calcolo passo-passo con flooring
    const step1 = Math.floor((2 * lvl) / 5 + 2);
    const step2 = Math.floor(
        step1 * 
        bsp * 
        (attack_stat * attack_multiplier) / 
        (defense_stat * defense_multiplier)
    );
    const step3 = Math.floor(step2 / 50) + 2;

    // Applicazione finale di tutti i modificatori
    return Math.floor(
        step3 * 
        (stab ? 1.5 : 1) * 
        type_effectiveness * 
        critical_multiplier * 
        other_multipliers * 
        rand_mult
    );
}

async function calc_damage_from_assoc(
    pkmnAtkAssoc,
    pkmnDefAssoc,
    move = 0,
    gen = 9,
    otherMultipliers = 1.0,
    attackMultiplier = 1.0,
    defenseMultiplier = 1.0,
    isCritical = false
) {
    // Controllo mossa valida
    if (!pkmnAtkAssoc.moves?.[move]) {
        return { error: "Invalid move selection" };
    }

    try {
        // Prepara nomi per le API
        const moveName = pkmnAtkAssoc.moves[move].replace(/ /g, '-');
        const atkName = pkmnAtkAssoc.name.replace(/ /g, '-');
        const defName = pkmnDefAssoc.name.replace(/ /g, '-');

        // Fetch dati concorrenti
        const [moveData, pkmnAtkData, pkmnDefData] = await Promise.all([
            fetch_data_as_assoc(`https://pokeapi.co/api/v2/move/${moveName}`),
            fetch_data_as_assoc(`https://pokeapi.co/api/v2/pokemon/${atkName}`),
            fetch_data_as_assoc(`https://pokeapi.co/api/v2/pokemon/${defName}`)
        ]);

        // Controllo mossa status
        if (moveData.damage_class.name === 'status') {
            return { max: 0, min: 0, rand: 0 };
        }

        // Determina tipo di attacco
        const isMovePhysical = moveData.damage_class.name === 'physical';
        const lvl = pkmnAtkAssoc.level;
        const bsp = moveData.power || 0;

        // Calcolo statistiche
        const attackStat = calc_stat(
            pkmnAtkData.stats[isMovePhysical ? 1 : 3].base_stat,
            pkmnAtkAssoc.ivs[isMovePhysical ? 'atk' : 'spa'],
            pkmnAtkAssoc.evs[isMovePhysical ? 'atk' : 'spa'],
            lvl,
            get_nature_multiplier(pkmnAtkAssoc.nature, isMovePhysical ? 'attack' : 'special-attack')
        );

        const defenseStat = calc_stat(
            pkmnDefData.stats[isMovePhysical ? 2 : 4].base_stat,
            pkmnDefAssoc.ivs[isMovePhysical ? 'def' : 'spd'],
            pkmnDefAssoc.evs[isMovePhysical ? 'def' : 'spd'],
            lvl,
            get_nature_multiplier(pkmnDefAssoc.nature, isMovePhysical ? 'defense' : 'special-defense')
        );

        // Calcolo efficacia e STAB
        const typeEffectiveness = await calculate_type_effectiveness(moveData.type.name, pkmnDefData.types);
        const stab = is_stab(moveData.type.name, pkmnAtkData.types);

        // Selezione generazione
        let damageFn;
        if (gen === 1) damageFn = calc_damage_gen1;
        else if (gen >= 2 && gen <= 5) damageFn = calc_damage_gen2_5;
        else if (gen >= 6) damageFn = calc_damage_gen6plus;
        else damageFn = calc_generic_damage;

        // Calcolo risultati
        return {
            max: damageFn(
                lvl, bsp, attackStat, attackMultiplier,
                defenseStat, defenseMultiplier, typeEffectiveness,
                stab, isCritical, otherMultipliers, 1
            ),
            min: damageFn(
                lvl, bsp, attackStat, attackMultiplier,
                defenseStat, defenseMultiplier, typeEffectiveness,
                stab, isCritical, otherMultipliers, -1
            ),
            rand: damageFn(
                lvl, bsp, attackStat, attackMultiplier,
                defenseStat, defenseMultiplier, typeEffectiveness,
                stab, isCritical, otherMultipliers, 0
            )
        };

    } catch (error) {
        console.error('Damage calculation error:', error);
        return { error: "Failed to calculate damage" };
    }
}

// CALCOLO EFFICACIA DEL TIPO
async function calculate_type_effectiveness(typeAtk, typeDef) {
    try {
        const attackTypeData = await fetch_data_as_assoc(`https://pokeapi.co/api/v2/type/${typeAtk.toLowerCase()}`);
        const damageRelations = attackTypeData.damage_relations;

        // Estrae i tipi con varie efficacie
        const doubleDamage = damageRelations.double_damage_to.map(t => t.name.toLowerCase());
        const halfDamage = damageRelations.half_damage_to.map(t => t.name.toLowerCase());
        const noDamage = damageRelations.no_damage_to.map(t => t.name.toLowerCase());

        let effectiveness = 1.0;
        
        for (const defType of typeDef) {
            const defName = defType.type.name.toLowerCase();
            
            // Controllo immunità
            if (noDamage.includes(defName)) {
                effectiveness = 0;
                break; // Interrompe immediatamente se c'è immunità
            }
            
            // Applica modificatori
            if (doubleDamage.includes(defName)) effectiveness *= 2;
            if (halfDamage.includes(defName)) effectiveness *= 0.5;
        }

        return effectiveness;
    } catch (error) {
        console.error('Error calculating type effectiveness:', error);
        return 1.0; // Valore di default in caso di errore
    }
}

// CONTROLLO STAB (Same-Type Attack Bonus)
function is_stab(moveType, pkmnTypes) {
    const lowerMoveType = moveType.toLowerCase();
    return pkmnTypes.some(t => 
        t.type.name.toLowerCase() === lowerMoveType
    );
}

