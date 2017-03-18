CREATE TABLE IF NOT EXISTS account (
  account_id serial primary key,
  username varchar NOT NULL,
  email varchar NOT NULL,
  password varchar NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  is_deleted boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS category (
  category_id serial primary key,
  name varchar NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  deleted_at boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS idea (
  idea_id serial primary key,
  name varchar,
  description varchar NOT NULL,
  category_id integer REFERENCES category (category_id),
  created_at timestamp DEFAULT current_timestamp,
  updated_at timestamp DEFAULT current_timestamp,
  is_deleted boolean NOT NULL DEFAULT false
);

INSERT INTO category(name) VALUES
('Science'),
('Art'),
('Music');


INSERT INTO idea(description, category_id) VALUES
('lorem', 2),
('ipsum', 1),
('dolor', 3),
('sit', 3),
('amet', 1);

INSERT INTO account(username, email, password) VALUES
('test', 'test@mail.com', '$2a$10$OuKt4M398LrRizHg.bHzB.GW6ToacV6S6VEKKND6pXk7GUcS29hAK'),
('new', 'new@mail.com', '$2a$10$bb8EO61ET08dLvfCKixFguhOmUkFuxmIewbl9fFmjTYh7U99DdkXm');
