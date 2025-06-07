<?php

function validate($pkmn_assoc) {
    $result = [
        'valid' => true,
        'errors' => [],
        'moves' => [],
        'ability' => null,
        'ivs' => [
            'valid' => true,
            'details' => [],
            'total' => 0,
            'error' => null
        ],
        'evs' => [
            'valid' => true,
            'details' => [],
            'total' => 0,
            'error' => null
        ]
    ];

    try {
        // Fetch complete Pokémon data with moves and abilities
        $pokemon_data = fetch_data_as_assoc("https://pokeapi.co/api/v2/pokemon/" . strtolower($pkmn_assoc['name']));
        $species_data = fetch_data_as_assoc("https://pokeapi.co/api/v2/pokemon-species/" . strtolower($pkmn_assoc['name']));

        if(!$pokemon_data || !$species_data) {
            throw new Exception("Pokemon not found in API");
        }

        // Get all possible moves (current and past versions)
        $valid_moves = [];
        foreach($pokemon_data['moves'] as $move_entry) {
            $valid_moves[strtolower($move_entry['move']['name'])] = true;
        }

        // Validate each move
        foreach($pkmn_assoc['moves'] as $index => $move) {
            if(empty($move)) {
                $result['moves'][$index] = ['valid' => false, 'error' => 'Empty move slot'];
                continue;
            }

            $normalized_move = strtolower(str_replace([' ', '-'], '', $move));
            $is_valid = false;

            // Check if move exists in any form
            foreach(array_keys($valid_moves) as $api_move) {
                if(str_replace([' ', '-'], '', $api_move) === $normalized_move) {
                    $is_valid = true;
                    break;
                }
            }

            $result['moves'][$index] = [
                'name' => $move,
                'valid' => $is_valid,
                'error' => $is_valid ? null : 'Move not available for this Pokémon'
            ];

            if(!$is_valid) $result['valid'] = false;
        }

        // Validate ability
        $valid_abilities = array_map('strtolower', array_column($pokemon_data['abilities'], 'ability.name'));
        $valid_hidden_abilities = array_map('strtolower', array_column($species_data['abilities'], 'name'));

        $normalized_ability = strtolower(str_replace([' ', '-'], '', $pkmn_assoc['ability']));
        $is_ability_valid = false;

        // Check regular abilities
        foreach($valid_abilities as $ability) {
            if(str_replace([' ', '-'], '', $ability) === $normalized_ability) {
                $is_ability_valid = true;
                break;
            }
        }

        // Check hidden abilities
        if(!$is_ability_valid) {
            foreach($valid_hidden_abilities as $ability) {
                if(str_replace([' ', '-'], '', $ability['name']) === $normalized_ability) {
                    $is_ability_valid = true;
                    break;
                }
            }
        }

        $result['ability'] = [
            'name' => $pkmn_assoc['ability'],
            'valid' => $is_ability_valid,
            'error' => $is_ability_valid ? null : 'Ability not available for this Pokémon'
        ];

        if(!$is_ability_valid) $result['valid'] = false;

        // IVs Validation (0-31 per stat)
        $ivs_total = 0;
        foreach(['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as $stat) {
            $iv = $pkmn_assoc['ivs'][$stat] ?? 0;
            
            if($iv < 0 || $iv > 31) {
                $result['ivs']['details'][$stat] = [
                    'value' => $iv,
                    'valid' => false,
                    'error' => "IV must be between 0-31"
                ];
                $result['ivs']['valid'] = false;
                $result['valid'] = false;
            } else {
                $result['ivs']['details'][$stat] = ['value' => $iv, 'valid' => true];
                $ivs_total += $iv;
            }
        }

        // EVs Validation
        $evs_total = 0;
        foreach(['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as $stat) {
            $ev = $pkmn_assoc['evs'][$stat] ?? 0;
            
            // Controllo valore singolo
            if($ev < 0 || $ev > 252) {
                $result['evs']['details'][$stat] = [
                    'value' => $ev,
                    'valid' => false,
                    'error' => "EV must be between 0-252"
                ];
                $result['evs']['valid'] = false;
                $result['valid'] = false;
            } else {
                $result['evs']['details'][$stat] = ['value' => $ev, 'valid' => true];
                $evs_total += $ev;
            }
        }

        // Controllo totale EVs
        $result['evs']['total'] = $evs_total;
        if($evs_total > 510) {
            $result['evs']['error'] = "Total EVs cannot exceed 510 (current: $evs_total)";
            $result['evs']['valid'] = false;
            $result['valid'] = false;
        }

        // Controllo totale IVs (opzionale, non esiste limite ma mostriamo il totale)
        $result['ivs']['total'] = $ivs_total;

    } catch(Exception $e) {
        $result['valid'] = false;
        $result['errors'][] = 'API validation failed: ' . $e->getMessage();
    }

    return $result;
}