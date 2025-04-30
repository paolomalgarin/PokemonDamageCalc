<?php

/*
    $lvl (int):
        Il livello del Pokémon attaccante (es. 50, 100).
    $bsp (int):
        La potenza base della mossa usata (es. 90 per "Thunderbolt").
    $attack_stat (int):
        Il valore dell'Attacco o Attacco Speciale del Pokémon attaccante, a seconda del tipo della mossa.
    $defense_stat (int):
        Il valore della Difesa o Difesa Speciale del Pokémon difensore, a seconda del tipo della mossa.
    $type_effectiveness (float):
        Il moltiplicatore di efficacia del tipo (es. 2.0 per superefficace, 0.5 per non molto efficace).
    $stab (bool, default false):
            Indica se la mossa beneficia dello STAB (Same-Type Attack Bonus). Se true, applica un moltiplicatore di 1.5.
    $critical_multiplier (float, default 1.0):
            Il moltiplicatore per i colpi critici (es. 1.5 o 2.0, a seconda della generazione del gioco).
    $other_multipliers (float, default 1.0):
            Il prodotto di altri modificatori come oggetti, abilità, condizioni atmosferiche (es. 1.3 per "Life Orb").
    $random (bool, default true):
            Se applicare un fattore casuale tra 0.85 e 1.0. 0 = fattore random, 1 = max, -1 = min
*/
 
// Danno = (((2 * Level / 5 + 2) * Power * (Attack / Defense)) / 50 + 2) * Modifiers
// Modifiers = STAB * Type Effectiveness * Critical * Other * Random
function calc_generic_damage($lvl, $bsp, $attack_stat, $defense_stat, $type_effectiveness, $stab = false, $critical_multiplier = 1.0, $other_multipliers = 1.0, $random = 0): int {
    // Fix random
    $rand_mult = match($random) {
        1 => 1.0,
        -1 => 0.85,
        default => mt_rand(85, 100) / 100
    };

    // Calcolo con FLOOR a ogni passaggio (come nel gioco)
    $step1 = floor((2 * $lvl) / 5 + 2);
    $step2 = floor($step1 * $bsp * $attack_stat / $defense_stat);
    $step3 = floor($step2 / 50) + 2;
    $danno = floor($step3 * ($stab ? 1.5 : 1) * $type_effectiveness * $critical_multiplier * $other_multipliers * $rand_mult);

    return $danno;
}

function calc_generic_damage_in_perc($def_HP, $lvl, $bsp, $attack_stat, $defense_stat, $type_effectiveness, $stab = false, $critical_multiplier = 1.0, $other_multipliers = 1.0, $random = 0): int {
    $danno = calc_generic_damage($lvl, $bsp, $attack_stat, $defense_stat, $type_effectiveness, $stab, $critical_multiplier, $other_multipliers, $random);
    return floor(($danno / $def_HP) * 100);
}