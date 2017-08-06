CREATE TABLE IF NOT EXISTS account (
  id serial primary key,
  username varchar NOT NULL,
  email varchar NOT NULL,
  password varchar NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  updated_at timestamp NULL
);

CREATE TABLE IF NOT EXISTS category (
  id serial primary key,
  name varchar NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  updated_at timestamp NULL
);

CREATE TABLE IF NOT EXISTS idea (
  id serial primary key,
  name NOT NULL varchar,
  description varchar NOT NULL,
  author_id integer NULL REFERENCES account (id),
  category_id integer REFERENCES category (id),
  created_at timestamp DEFAULT current_timestamp,
  updated_at timestamp NULL
);

CREATE TABLE IF NOT EXISTS star (
  id serial primary key,
  idea_id integer NOT NULL REFERENCES idea (id) ON DELETE CASCADE,
  account_id integer NOT NULL REFERENCES account (id) ON DELETE CASCADE,
  created_at timestamp DEFAULT current_timestamp,
  UNIQUE(idea_id, account_id)
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


--------------------------------------------------
INSERT INTO star(idea_id, account_id) VALUES
(67, 1),
(67, 2),
(68, 1),
(68, 4),
(68, 5),
(68, 6),
(69, 3),
(72, 1),
(73, 1);
