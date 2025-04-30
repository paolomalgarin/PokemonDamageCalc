<?php
require '../public/utils/calc_stats.php';
require '../public/utils/calc_damage.php';

/*
    Altaria @ Heavy-Duty Boots
    Level: 50
    EVs: 240 HP / 0 Atk / 252 Def / 0 SpA / 0 SpD / 16 Spe
    Bold Nature
    IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
    - Roost
    - Perish Song
    - Defog
    - Fire Spin
*/



// Esempio: Pikachu (Livello 100) usa Thunderbolt contro Gyarados (Livello 100)
$damage = calc_generic_damage(
    $level = 100,
    $power = 90,
    $attack_stat = 136, // Attacco Speciale di Pikachu
    $defense_stat = 236, // Difesa Speciale di Gyarados
    $type_effectiveness = 2.0, // Elettro vs Acqua/Volante
    $stab = true, // Thunderbolt è di tipo Elettro (STAB)
    $critical_multiplier = 1.0, // Nessun colpo critico
    $other_multipliers = 1.0, // Nessun altro modificatore
    $random = 1 // Calcola danno massimo
);

$damage_perc = calc_generic_damage_in_perc(
    $def_HP = calc_hp(
        $base_stat = 95,
        $iv_stat = 31,
        $ev_stat = 252,  // max ex in una stat (tot evs = 510)
        $level = 100,
        $nature_multiplier = 1
    ),
    $level = 100,
    $power = 90,
    $attack_stat = 120, // Attacco Speciale di Pikachu
    $defense_stat = 95, // Difesa Speciale di Gyarados
    $type_effectiveness = 2.0, // Elettro vs Acqua/Volante
    $stab = true, // Thunderbolt è di tipo Elettro (STAB)
    $critical_multiplier = 1.0, // Nessun colpo critico
    $other_multipliers = 1.0, // Nessun altro modificatore
    $random = 1 // Calcola danno massimo
);
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Damage Calculator</title>
</head>

<body>
    <?= $damage ?><br>
    Gyarados HP: <?= calc_hp (
                        $base_stat = 95,
                        $iv_stat = 31,
                        $ev_stat = 252,
                        $level = 100,
                        $nature_multiplier = 1
                    ); ?><br>
    <br>
    <?= $damage_perc ?>%<br>
</body>

</html>