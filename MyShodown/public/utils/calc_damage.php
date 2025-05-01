<?php
require 'calc_stats.php';
require 'fetch_data.php';


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
    $random (int, default 0):
            Se applicare un fattore casuale tra 0.85 e 1.0. 0 = fattore random, 1 = max, -1 = min
*/

// Danno = (((2 * Level / 5 + 2) * Power * (Attack / Defense)) / 50 + 2) * Modifiers
// Modifiers = STAB * Type Effectiveness * Critical * Other * Random
function calc_generic_damage($lvl, $bsp, $attack_stat, $attack_multiplier = 1.0, $defense_stat, $defense_multiplier = 1.0, $type_effectiveness, $stab = false, $critical_multiplier = 1.0, $other_multipliers = 1.0, $random = 0): int
{
    // Fix random
    $rand_mult = match ($random) {
        1 => 1.0,
        -1 => 0.85,
        default => mt_rand(85, 100) / 100
    };

    // Calcolo con FLOOR a ogni passaggio (come nel gioco)
    $step1 = floor((2 * $lvl) / 5 + 2);
    $step2 = floor($step1 * $bsp * ($attack_stat * $attack_multiplier) / ($defense_stat * $defense_multiplier));
    $step3 = floor($step2 / 50) + 2;
    $danno = floor($step3 * ($stab ? 1.5 : 1) * $type_effectiveness * $critical_multiplier * $other_multipliers * $rand_mult);

    return $danno;
}

function calc_generic_damage_in_perc($def_HP, $lvl, $bsp, $attack_stat, $attack_multiplier = 1.0, $defense_stat, $defense_multiplier = 1.0, $type_effectiveness, $stab = false, $critical_multiplier = 1.0, $other_multipliers = 1.0, $random = 0): int
{
    $danno = calc_generic_damage($lvl, $bsp, $attack_stat, $attack_multiplier, $defense_stat, $defense_multiplier, $type_effectiveness, $stab, $critical_multiplier, $other_multipliers, $random);
    return floor(($danno / $def_HP) * 100);
}


function get_damage_perc($def_HP, $damadge): float
{
    return round((($damadge / $def_HP) * 100.0), 2);
}



/*
    === GEN1 ===
    Se critico:
    A/D = Valori base (senza modifiche da abilità/effetti).
    Modifiers = <code>(STAB × TypeEff)<sup>2</sup> × 2 × Altri × Random</code>.

    Se non critico:
    A/D = Valori modificati.
    Modifiers = STAB × TypeEff × Altri × Random.
*/
function calc_damage_gen1($lvl, $bsp, $attack_stat, $attack_multiplier = 1.0, $defense_stat, $defense_multiplier = 1.0, $type_effectiveness, $stab = false, $is_critical = false, $other_multipliers = 1.0, $random = 0): int
{
    $rand_mult = match ($random) {
        1 => 1.0,
        -1 => 0.85,
        default => mt_rand(85, 100) / 100
    };

    if ($is_critical) {
        // Gen 1: Critici usano A/D base e (STAB × TypeEff)^2 × 2
        $attack_multiplier = 1.0;
        $defense_multiplier = 1.0;
        $critical_multiplier = 2.0;
        $stab_type_mult = ($stab ? 1.5 : 1) * $type_effectiveness;
        $stab_type_mult = $stab_type_mult * $stab_type_mult; // Quadrato
    } else {
        $critical_multiplier = 1.0;
        $stab_type_mult = ($stab ? 1.5 : 1) * $type_effectiveness;
    }

    $step1 = floor((2 * $lvl) / 5 + 2);
    $step2 = floor($step1 * $bsp * ($attack_stat * $attack_multiplier) / ($defense_stat * $defense_multiplier));
    $step3 = floor($step2 / 50) + 2;
    $danno = floor($step3 * $stab_type_mult * $critical_multiplier * $other_multipliers * $rand_mult);

    return $danno;
}



/*
    === GEN2-5 ===
    Se critico:
    A/D = Valori modificati.
    Modifiers = STAB × TypeEff × 2 × Altri × Random.
    I critici non influenzano A/D, ma applicano ×2.
*/
function calc_damage_gen2_5($lvl, $bsp, $attack_stat, $attack_multiplier = 1.0, $defense_stat, $defense_multiplier = 1.0, $type_effectiveness, $stab = false, $is_critical = false, $other_multipliers = 1.0, $random = 0): int
{
    // Fix random
    $rand_mult = match ($random) {
        1 => 1.0,
        -1 => 0.85,
        default => mt_rand(85, 100) / 100
    };
    $critical_multiplier = ($is_critical ? 2.0 : 1.0);

    // Calcolo con FLOOR a ogni passaggio (come nel gioco)
    $step1 = floor((2 * $lvl) / 5 + 2);
    $step2 = floor($step1 * $bsp * ($attack_stat * $attack_multiplier) / ($defense_stat * $defense_multiplier));
    $step3 = floor($step2 / 50) + 2;
    $danno = floor($step3 * ($stab ? 1.5 : 1) * $type_effectiveness * $critical_multiplier * $other_multipliers * $rand_mult);

    return $danno;
}



/*
    === GEN6+ ===
    Se critico:
    A/D = Valori modificati.
    Modifiers = STAB × TypeEff × 1.5 × Altri × Random.
*/
function calc_damage_gen6plus($lvl, $bsp, $attack_stat, $attack_multiplier = 1.0, $defense_stat, $defense_multiplier = 1.0, $type_effectiveness, $stab = false, $is_critical = false, $other_multipliers = 1.0, $random = 0): int
{
    // Fix random
    $rand_mult = match ($random) {
        1 => 1.0,
        -1 => 0.85,
        default => mt_rand(85, 100) / 100
    };
    $critical_multiplier = ($is_critical ? 1.5 : 1.0);

    // Calcolo con FLOOR a ogni passaggio (come nel gioco)
    $step1 = floor((2 * $lvl) / 5 + 2);
    $step2 = floor($step1 * $bsp * ($attack_stat * $attack_multiplier) / ($defense_stat * $defense_multiplier));
    $step3 = floor($step2 / 50) + 2;
    $danno = floor($step3 * ($stab ? 1.5 : 1) * $type_effectiveness * $critical_multiplier * $other_multipliers * $rand_mult);

    return $danno;
}






// FUNZIONE GENERICA
// $pkmn_atk_assoc  ->  array associativo con i dati del pokemon che attacca
// $pkmn_def_assoc  ->  array associativo con i dati del pokemon che subisce l'attaco
// $move  ->  indice della mossa usata (0 - 3)
function calc_damage_from_assoc($pkmn_atk_assoc, $pkmn_def_assoc, $move = 0, $gen = 9, $other_multipliers = 1.0, $attack_multiplier = 1.0, $defense_multiplier = 1.0, $is_critical = false)
{
    // -------------------------- CONTROLLI --------------------------
    // Controllo se ha selezionato una mossa valida
    if (!$pkmn_atk_assoc['moves'][$move]) {
        return -1;
    }
    // Controllo se il pkmn ha i dati aggiuntivi (se è stata usata la funzione load_more_information())
    if(!isset($pkmn_atk_assoc['base_stats']) || !isset($pkmn_def_assoc['base_stats'])) {
        echo 'Il pokemon no ha dati sufficenti, usa la funzione load_more_information() per aggiungerli';
        return -1;
    }

    // -------------------------- LOGICA --------------------------
    // mi prendo i dati x le funzioni
    $move_name = $pkmn_atk_assoc['moves'][$move];

    if (!str_contains($pkmn_atk_assoc['moves_info'][$move_name]['category'], 'damage')) {
        return 0;
    } else {
        $is_move_phisical = $pkmn_atk_assoc['moves_info'][$move_name]['damage_class'] === 'physical';
    }

    $lvl = $pkmn_atk_assoc['level'];
    $bsp = $pkmn_atk_assoc['moves_info'][$move_name]['base_power'];
    $attack_stat = calc_stat(
        $pkmn_atk_assoc['base_stats'][($is_move_phisical ? 'attack' : 'special-attack')],
        $pkmn_atk_assoc['ivs'][($is_move_phisical ? 'atk' : 'spa')],
        $pkmn_atk_assoc['evs'][($is_move_phisical ? 'atk' : 'spa')],
        $lvl,
        get_nature_multiplier($pkmn_atk_assoc['nature'], ($is_move_phisical ? 'attack' : 'special-attack'))
    );
    $defense_stat = calc_stat(
        $pkmn_def_assoc['base_stats'][($is_move_phisical ? 'defense' : 'special-defense')],
        $pkmn_def_assoc['ivs'][($is_move_phisical ? 'def' : 'spd')],
        $pkmn_def_assoc['evs'][($is_move_phisical ? 'def' : 'spd')],
        $lvl,
        get_nature_multiplier($pkmn_def_assoc['nature'], ($is_move_phisical ? 'defense' : 'special-defense'))
    );
    $type_effectiveness = calculate_type_effectiveness($pkmn_atk_assoc['moves_info'][$move_name]['type'], $pkmn_def_assoc['types']);
    $stab = is_stab($pkmn_atk_assoc['moves_info'][$move_name]['type'], $pkmn_atk_assoc['types']);

    // calcolo il danno con le funzioni
    switch ($gen) {
        case 1:
            $result = [
                'max' => calc_damage_gen1(
                    $lvl,
                    $bsp,
                    $attack_stat,
                    $attack_multiplier,
                    $defense_stat,
                    $defense_multiplier,
                    $type_effectiveness,
                    $stab,
                    $is_critical,
                    $other_multipliers,
                    1
                ),
                'min' => calc_damage_gen1(
                    $lvl,
                    $bsp,
                    $attack_stat,
                    $attack_multiplier,
                    $defense_stat,
                    $defense_multiplier,
                    $type_effectiveness,
                    $stab,
                    $is_critical,
                    $other_multipliers,
                    -1
                ),
                'rand' => calc_damage_gen1(
                    $lvl,
                    $bsp,
                    $attack_stat,
                    $attack_multiplier,
                    $defense_stat,
                    $defense_multiplier,
                    $type_effectiveness,
                    $stab,
                    $is_critical,
                    $other_multipliers,
                    0
                ),
            ];
            break;

        case 2:
        case 3:
        case 4:
        case 5:
            $result = [
                'max' => calc_damage_gen2_5(
                    $lvl,
                    $bsp,
                    $attack_stat,
                    $attack_multiplier,
                    $defense_stat,
                    $defense_multiplier,
                    $type_effectiveness,
                    $stab,
                    $is_critical,
                    $other_multipliers,
                    1
                ),
                'min' => calc_damage_gen2_5(
                    $lvl,
                    $bsp,
                    $attack_stat,
                    $attack_multiplier,
                    $defense_stat,
                    $defense_multiplier,
                    $type_effectiveness,
                    $stab,
                    $is_critical,
                    $other_multipliers,
                    -1
                ),
                'rand' => calc_damage_gen2_5(
                    $lvl,
                    $bsp,
                    $attack_stat,
                    $attack_multiplier,
                    $defense_stat,
                    $defense_multiplier,
                    $type_effectiveness,
                    $stab,
                    $is_critical,
                    $other_multipliers,
                    0
                ),
            ];
            break;

        case 6:
        case 7:
        case 8:
        case 9:
            $result = [
                'max' => calc_damage_gen6plus(
                    $lvl,
                    $bsp,
                    $attack_stat,
                    $attack_multiplier,
                    $defense_stat,
                    $defense_multiplier,
                    $type_effectiveness,
                    $stab,
                    $is_critical,
                    $other_multipliers,
                    1
                ),
                'min' => calc_damage_gen6plus(
                    $lvl,
                    $bsp,
                    $attack_stat,
                    $attack_multiplier,
                    $defense_stat,
                    $defense_multiplier,
                    $type_effectiveness,
                    $stab,
                    $is_critical,
                    $other_multipliers,
                    -1
                ),
                'rand' => calc_damage_gen6plus(
                    $lvl,
                    $bsp,
                    $attack_stat,
                    $attack_multiplier,
                    $defense_stat,
                    $defense_multiplier,
                    $type_effectiveness,
                    $stab,
                    $is_critical,
                    $other_multipliers,
                    0
                ),
            ];
            break;

        default:
            $result = [
                'max' => calc_generic_damage(
                    $lvl,
                    $bsp,
                    $attack_stat,
                    $attack_multiplier,
                    $defense_stat,
                    $defense_multiplier,
                    $type_effectiveness,
                    $stab,
                    $is_critical ? 1.5 : 1.0,
                    $other_multipliers,
                    1
                ),
                'min' => calc_generic_damage(
                    $lvl,
                    $bsp,
                    $attack_stat,
                    $attack_multiplier,
                    $defense_stat,
                    $defense_multiplier,
                    $type_effectiveness,
                    $stab,
                    $is_critical ? 1.5 : 1.0,
                    $other_multipliers,
                    -1
                ),
                'rand' => calc_generic_damage(
                    $lvl,
                    $bsp,
                    $attack_stat,
                    $attack_multiplier,
                    $defense_stat,
                    $defense_multiplier,
                    $type_effectiveness,
                    $stab,
                    $is_critical ? 1.5 : 1.0,
                    $other_multipliers,
                    0
                ),
            ];
            break;
    }

    return $result;
}

function calculate_type_effectiveness($type_atk, $type_def)
{
    // Ottieni i dati del tipo di attacco dall'API
    $attack_type_url = "https://pokeapi.co/api/v2/type/" . strtolower($type_atk);
    $attack_type_data = fetch_data_as_assoc($attack_type_url);

    // Estrai le relazioni di danno
    $damage_relations = $attack_type_data['damage_relations'];
    $double_damage = array_map('strtolower', array_column($damage_relations['double_damage_to'], 'name'));
    $half_damage = array_map('strtolower', array_column($damage_relations['half_damage_to'], 'name'));
    $no_damage = array_map('strtolower', array_column($damage_relations['no_damage_to'], 'name'));

    $effectiveness = 1.0;

    foreach ($type_def as $def_type) {
        // var_dump($def_type);
        $def_name = strtolower($def_type);

        // Controlla immunità
        if (in_array($def_name, $no_damage)) {
            $effectiveness = 0;
            break; // Interrompi se c'è immunità
        }

        // Applica moltiplicatori
        if (in_array($def_name, $double_damage)) {
            $effectiveness *= 2;
        }
        if (in_array($def_name, $half_damage)) {
            $effectiveness *= 0.5;
        }
    }

    return $effectiveness;
}

function is_stab($move_type, $pkmn_types)
{
    $move_type = strtolower($move_type);

    foreach ($pkmn_types as $type) {
        if (strtolower($type) === $move_type) {
            return true;
        }
    }

    return false;
}
