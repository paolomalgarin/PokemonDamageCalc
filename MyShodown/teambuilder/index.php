<?php
require __DIR__ . '/utils/pkmn_parser.php';


/*
    (Con i \n)

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

$pkmn = '
Araquanid (M) @ Expert Belt  
Ability: Water Absorb  
Level: 100  
Shiny: Yes  
EVs: 248 HP / 252 Atk / 8 SpA  
Brave Nature  
- Body Slam  
- Endeavor  
- Ice Beam  
- Lunge
';

$pkmn_assoc = parse_to_assoc($pkmn);

header('Content-type: application/json');
echo json_encode($pkmn_assoc);

// echo '<br><br>';

// $pkmn_norm = parse_from_assoc($pkmn_assoc);
// echo str_replace("\n", "<br>", $pkmn_norm);
