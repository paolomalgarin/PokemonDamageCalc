<?php

function fetch_data_as_assoc($url) {
    $json_data = file_get_contents($url);
    $data_assoc = json_decode($json_data, true);
    return $data_assoc;
}

function get_move_bsp($move_name)
{
    $move_name = str_replace(" ", "-", $move_name);
    $move_data = fetch_data_as_assoc("https://pokeapi.co/api/v2/move/$move_name");
    return $move_data['power'];
}

// $stat_id =  0(hp) 1(atk) 2(def) 3(spa) 4(spd) 5(spe)
function get_base_stat($pkmn_name, $stat_id)
{
    $pkmn_name = str_replace(" ", "-", $pkmn_name);
    $pkmn_data = fetch_data_as_assoc("https://pokeapi.co/api/v2/pokemon/$pkmn_name");
    return $pkmn_data['stats'][$stat_id]['base_stat'];
}

function get_nature_multiplier($nature, $stat_full_name) {
    $nature_data = fetch_data_as_assoc("https://pokeapi.co/api/v2/nature/$nature");
    
    // Controllo se la natura cambia le stat
    if(!$nature_data || !isset($nature_data['increased_stat'], $nature_data['decreased_stat'])) {
        return 1.0;
    }

    // Converti lo stat name in lowercase per sicurezza
    $lower_stat = strtolower($stat_full_name);
    
    // Controllo stat aumentata
    if(isset($nature_data['increased_stat']['name']) && 
       strtolower($nature_data['increased_stat']['name']) === $lower_stat) {
        return 1.1;
    }
    
    // Controllo stat diminuita
    if(isset($nature_data['decreased_stat']['name']) && 
       strtolower($nature_data['decreased_stat']['name']) === $lower_stat) {
        return 0.9;
    }
    
    return 1.0;
}

