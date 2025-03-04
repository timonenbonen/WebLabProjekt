-- I flatten t_song into t_song_card because it is a 1:1 relationship and the performance is better

create table t_design
(
    pk_design_id serial primary key,
    design_json  jsonb not null
);


create table t_artist
(
    pk_artist_id serial primary key,
    name         text not null
);

create table t_user
(
    pk_user_id    serial primary key,
    username      text not null unique,
    display_name  text not null,
    password_hash text not null -- data privacy???
);

create table t_guestbook
(
    pk_guestbook_id serial primary key,
    name            text    not null,
    fk_user_id      integer not null,
    foreign key (fk_user_id) references t_user (pk_user_id),
    fk_design_id    integer not null,
    foreign key (fk_design_id) references t_design (pk_design_id),
    share_link      text    not null
);

create table t_song_card
(
    pk_song_card_id  serial primary key,
    name             text    not null,
    spotify_id       text    not null,
    year             integer not null,
    qr_code          text   not null,
    personal_message text,
    guest_name       text    not null,
    fk_guestbook_id  integer not null,
    foreign key (fk_guestbook_id) references t_guestbook (pk_guestbook_id),
    unique (fk_guestbook_id, spotify_id)
);

create table t_song_card_artist
(
    pfk_song_card_id integer not null,
    foreign key (pfk_song_card_id) references t_song_card (pk_song_card_id),
    pfk_artist_id    integer not null,
    foreign key (pfk_artist_id) references t_artist (pk_artist_id),
    primary key (pfk_song_card_id, pfk_artist_id)
);