create database myshodown;

use myshodown;

create table utenti (
    user_id int(15) auto_increment, -- PK
    nickname varchar(255) not null unique,
    password varchar(255) not null,
    in_queue int(1) not null default 0, -- 0 = false, 1 = true

    PRIMARY KEY (user_id)
);

insert into utenti (nickname, password) values ('test1', '');
insert into utenti (nickname, password) values ('test2', '');
insert into utenti (nickname, password) values ('test3', '');


create table regole (
    nome varchar(255), -- PK
    descrizione varchar(255) not null default '',
    info mediumtext not null,  -- json con settings della partita

    PRIMARY KEY (nome)
);

insert into regole (nome, descrizione, info) 
values ('gen1', 'regole x partrite in gen 1', '{"allow-items":true,"gen":1,"team-size":6,"default-weather":"none","default-hazards":null}');


create table partite (
    game_id int(15) auto_increment, -- PK
    data_inizio timestamp not null default current_timestamp,  -- timestamp di inizio della partita
    stato int(1) not null default 0 comment '0=waiting,1=in corso,2=finita',
    stato_iniziale mediumtext not null default '',
    regole varchar(255) not null,

    PRIMARY KEY (game_id),
    -- fk
    CONSTRAINT fk_partite_regole
    FOREIGN KEY (regole) REFERENCES regole(nome) on delete restrict
);


create table partecipazioni(
    user_id int(15), -- PK
    game_id int(15), -- PK
    ruolo int(1) not null comment '0=giocatore,1=spettatore',  -- giocatore (0) | spettatore (1)

    PRIMARY KEY (user_id, game_id),
    -- fk
    CONSTRAINT fk_partecipazioni_utenti
    FOREIGN KEY (user_id) REFERENCES utenti(user_id) on delete cascade,
    CONSTRAINT fk_partecipazioni_partite
    FOREIGN KEY (game_id) REFERENCES partite(game_id) on delete cascade
);


create table mosse(
    move_id int(15) auto_increment, -- PK
    user_id int(15),  -- null = deleted_user
    game_id int(15) not null,
    data_mossa timestamp not null default current_timestamp,  -- timestamp in cui è stata fatta la mossa
    mossa varchar(255) not null,  -- mossa formato: {"pkmn":id_move(1,..)} o {"pkmn":null,"switch":slot(1,..,6)}
    stato_partita mediumtext default null,  -- stato della partita dopo la mossa (calcolato dal server)

    PRIMARY KEY (move_id),
    -- fk
    CONSTRAINT fk_mosse_utenti
    FOREIGN KEY (user_id) REFERENCES utenti(user_id) on delete set null,
    CONSTRAINT fk_mosse_partite
    FOREIGN KEY (game_id) REFERENCES partite(game_id) on delete cascade
);