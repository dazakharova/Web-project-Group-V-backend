drop database if exists journey_junction;

create database journey_junction;

use journey_junction;

create table users (
    id serial primary key,
    username varchar(30) not null unique,
    password varchar(64) not null
);

create table posts (
    id serial primary key,
    user_id integer,
    title varchar(255) not null,
    body text not null,
    created_at timestamp with time zone not null default current_timestamp,
    likes_number integer not null default 0,
    foreign key (user_id) references users(id)
);

create table comments (
    id serial primary key,
    post_id integer,
    user_id integer,
    content text not null,
    created_at timestamp with time zone not null default current_timestamp,
    foreign key (post_id) references posts(id) on delete cascade,
    foreign key (user_id) references users(id)
);

-- Inserting test values into the users table
insert into users (username, password) values ('user1', 'password_for_user1');
insert into users (username, password) values ('user2', 'password_for_user2');

-- Inserting test values into the posts table
insert into posts (user_id, title, body) values (1, 'First Post Title', 'This is the body of the first post.');
insert into posts (user_id, title, body) values (2, 'Second Post Title', 'This is the body of the second post.');

-- Inserting test values into the comments table
insert into comments (post_id, user_id, content) values (1, 1, 'This is a comment from user1 on the first post.');
insert into comments (post_id, user_id, content) values (1, 2, 'This is a comment from user2 on the first post.');


-- Commands for deleting these values above from each table (if needed):

-- delete from users where username IN ('user1', 'user2');
-- delete from posts where user_id IN (1, 2);
-- delete from comments where post_id = 1 AND user_id IN (1, 2);
