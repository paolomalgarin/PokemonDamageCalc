<?php

/*
    Araquanid (M) @ Expert Belt  
    Ability: Water Absorb  
    Shiny: Yes  
    Tera Type: Water  
    EVs: 248 HP / 252 Atk / 8 SpA  
    Brave Nature  
    - Body Slam  
    - Endeavor  
    - Ice Beam  
    - Lunge
*/

// Da forma sopra a json
function parse_to_assoc($pkmn)
{
    // Struttura base con valori di default
    $pkmn_assoc = [
        'name' => null,
        'gender' => 'r',  // r = random, f = female, m = male
        'item' => null,
        'ability' => null,
        'level' => null,
        'shiny' => false,
        'evs' => [
            'hp' => 0,
            'atk' => 0,
            'def' => 0,
            'spa' => 0,
            'spd' => 0,
            'spe' => 0,
        ],
        'nature' => null,
        'ivs' => [
            'hp' => 31,
            'atk' => 31,
            'def' => 31,
            'spa' => 31,
            'spd' => 31,
            'spe' => 31,
        ],
        'moves' => [
            null,
            null,
            null,
            null,
        ]
    ];

    $lines = explode("\n", trim($pkmn, " \n\r\t\v"));
    $move_n = 0;  //numero della mossa che serve nella gestione delle mosse (vedi l'if sotto)
    for ($i = 0; $i < sizeof($lines); $i++) {
        $line = strtolower(trim($lines[$i]));
        // echo $line . '<br>';

        if ($i === 0) {
            // nome & genere + oggetto
            $data = explode("@", $line);
            if(str_contains($data[0], "(")) {
                $name = trim(explode("(", $data[0])[0]);
                $gender = trim(explode("(", $data[0])[1], " ()\n\r\t\v\0");
                $pkmn_assoc['name'] = $name;
                $pkmn_assoc['gender'] = $gender;
            } else {
                $pkmn_assoc['name'] = trim($data[0]);
            }
            $pkmn_assoc['item'] = (sizeof($data) > 1 ? trim($data[1]) : null);
        } else if (str_starts_with($line, "-")) {
            // mosse (priorità per evitare errori con str_ends_with() o str_starts_with())
            $pkmn_assoc['moves'][$move_n++] = trim($line, " \n\r\t\v\0-");
        } else if (str_starts_with($line, "ability:")) {
            // abilità
            $pkmn_assoc['ability'] = trim(explode(":", $line)[1]);
        } else if (str_starts_with($line, "level:")) {
            // livello
            $pkmn_assoc['level'] = (int) trim(explode(":", $line)[1]);
        } else if (str_starts_with($line, "shiny:")) {
            // shiny
            $pkmn_assoc['shiny'] = trim(explode(":", $line)[1]) == 'yes';
        } else if (str_starts_with($line, "evs:")) {
            // EVs
            $evs = trim(explode(":", $line)[1]);
            // isolo gli evs
            $evs = explode("/", $evs);
            foreach ($evs as $ev) {
                $ev = trim($ev, " ");
                $ev_name = trim(explode(" ", $ev)[1], " ");
                $ev_val = trim(explode(" ", $ev)[0], " ");
                if ($ev_name && $ev_val) {
                    $pkmn_assoc['evs'][$ev_name] = (int)$ev_val;
                }
            }
        } else if (str_ends_with($line, "nature")) {
            // natura
            $nature = explode(" ", $line)[0];
            if (sizeof(explode(" ", $line)) > 1)
                $pkmn_assoc['nature'] = $nature;
        } else if (str_starts_with($line, "ivs:")) {
            // IVs
            $ivs = trim(explode(":", $line)[1]);
            // isolo gli ivs
            $ivs = explode("/", $ivs);
            foreach ($ivs as $iv) {
                $iv = trim($iv, " ");
                $ev_name = trim(explode(" ", $iv)[1], " ");
                $ev_val = trim(explode(" ", $iv)[0], " ");
                if ($ev_name && $ev_val) {
                    $pkmn_assoc['ivs'][$ev_name] = (int)$ev_val;
                }
            }
        }
    }

    return $pkmn_assoc;
}

// Contrario
function parse_from_assoc($assoc) {}

function parse_from_json($json)
{
    // work in progress...
}
