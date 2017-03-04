CREATE TABLE IF NOT EXISTS ideas (
  id serial primary key,
  name varchar,
  text varchar NOT NULL,
  created timestamp DEFAULT current_timestamp,
  updated timestamp
);

CREATE TABLE IF NOT EXISTS users (
  id serial primary key,
  username varchar NOT NULL,
  email varchar NOT NULL,
  password varchar NOT NULL,
  created timestamp DEFAULT current_timestamp
);

INSERT INTO ideas(text) VALUES
('lorem'),
('ipsum'),
('dolor'),
('sit'),
('amet');

INSERT INTO  users(username, email, password) VALUES
('test', 'test@mail.com', '$2a$10$OuKt4M398LrRizHg.bHzB.GW6ToacV6S6VEKKND6pXk7GUcS29hAK')
('new', 'new@mail.com', '$2a$10$bb8EO61ET08dLvfCKixFguhOmUkFuxmIewbl9fFmjTYh7U99DdkXm');
