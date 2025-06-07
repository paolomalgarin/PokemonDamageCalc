<?php
require '../public/utils/calc_damage.php';
require '../public/utils/pkmn_parser.php';


$weavile = '
Weavile (M) @ Cell Battery 
Level: 100 
Ability: Pickpocket  
Tera Type: Dark  
EVs: 252 Atk / 4 SpD / 252 Spe  
Jolly Nature  
- Foul Play  
- Ice Shard  
- Icicle Crash  
- Knock Off
';

// After parsing, check the structure
$pkmn_atk = parse_to_assoc($weavile);
$pkmn_def = parse_to_assoc($weavile);

// Adding informations
$pkmn_atk = load_more_information($pkmn_atk);
$pkmn_def = load_more_information($pkmn_def);


// Proceed with calculations
$dmg = calc_damage_from_assoc($pkmn_atk, $pkmn_def, 0, 9, 1.0, 1.0, 1.0, false);

$def_hp = calc_hp_from_assoc($pkmn_def);
$max_dmg_perc = get_damage_perc($def_hp, $dmg['max']);
$min_dmg_perc = get_damage_perc($def_hp, $dmg['min']);
echo 'end: ' . date('H:i:s') . '<br>';

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Damage Calculator</title>
</head>

<body>
    <h1>Weavile vs Weavile</h1>
    Min Damage (Foul Play) <?= $dmg['min'] ?> | <?= $min_dmg_perc ?>%<br>
    Max Damage (Foul Play) <?= $dmg['max'] ?> | <?= $max_dmg_perc ?>%<br>
</body>

</html>