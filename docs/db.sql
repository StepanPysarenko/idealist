CREATE TABLE ideas (
  id serial primary key,
  name varchar,
  text varchar NOT NULL,
  created timestamp DEFAULT current_timestamp,
  updated timestamp
);

CREATE TABLE users (
  id serial primary key,
  username varchar NOT NULL,
  email varchar NOT NULL,
  password varchar NOT NULL,
  created timestamp DEFAULT current_timestamp
);

insert into ideas(text) values
('lorem'),
('ipsum'),
('dolor'),
('sit'),
('amet');

insert into users(username, email, password) values
('test', 'test@mail.com', '$2a$10$OuKt4M398LrRizHg.bHzB.GW6ToacV6S6VEKKND6pXk7GUcS29hAK');

('new', 'new@mail.com', '$2a$10$bb8EO61ET08dLvfCKixFguhOmUkFuxmIewbl9fFmjTYh7U99DdkXm');
