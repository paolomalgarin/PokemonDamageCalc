<?php

// STATS NORMALI:
// floor( ((2*base + IV + EV/4) * level / 100 + 5 ) * nature
function calc_stat($base_stat, $iv_stat, $ev_stat, $level, $nature_multiplier) {
    $ev_contribution = floor($ev_stat / 4);
    $stat = floor( (( (2 * $base_stat + $iv_stat + $ev_contribution) * $level / 100 + 5 ) * $nature_multiplier ) );
    return $stat;
}

// HP:
// floor( ((2*base + IV + EV/4) * level / 100 ) + level + 10
function calc_hp($base_hp, $iv_hp, $ev_hp, $level) {
    $ev_contribution = floor($ev_hp / 4);
    $hp = floor( ( (2 * $base_hp + $iv_hp + $ev_contribution ) * $level / 100 ) + $level + 10 );
    return $hp;
}

function calc_hp_from_assoc($pkmn_assoc) {
    $base_hp = get_base_stat($pkmn_assoc['name'], 0);
    $ev_contribution = floor($pkmn_assoc['evs']['hp'] / 4);
    $hp = floor( ( (2 * $base_hp + $pkmn_assoc['ivs']['hp'] + $ev_contribution ) * $pkmn_assoc['level'] / 100 ) + $pkmn_assoc['level'] + 10 );
    return $hp;
}