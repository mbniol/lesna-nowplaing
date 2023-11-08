CREATE TABLE `tracks` (
  `id` integer PRIMARY KEY,
  `cover` varchar(255),
  `length` integer,
  `name` varchar(255),
  `artist_id` integer,
  `album_id` integer,
  `banned` bool
);

CREATE TABLE `requested_tracks` (
  `id` integer UNIQUE,
  `votes` integer unsigned
);

CREATE TABLE `artists` (
  `id` integer PRIMARY KEY,
  `name` varchar(255)
);

CREATE TABLE `album` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `image` varchar(255)
);

CREATE TABLE `patterns` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `alarm_offset` integer
);

CREATE TABLE `breaks` (
  `id` integer PRIMARY KEY,
  `name` varchar(255),
  `position` integer,
  `start` varchar(255),
  `end` varchar(255),
  `for_requested` bool,
  `pattern_id` integer
);

CREATE TABLE `artists_tracks` (
  `artists_id` integer,
  `tracks_id` integer,
  PRIMARY KEY (`artists_id`, `tracks_id`)
);

ALTER TABLE `artists_tracks` ADD FOREIGN KEY (`artists_id`) REFERENCES `artists` (`id`);

ALTER TABLE `artists_tracks` ADD FOREIGN KEY (`tracks_id`) REFERENCES `tracks` (`id`);


ALTER TABLE `tracks` ADD FOREIGN KEY (`album_id`) REFERENCES `album` (`id`);

ALTER TABLE `tracks` ADD FOREIGN KEY (`id`) REFERENCES `requested_tracks` (`id`);

ALTER TABLE `breaks` ADD FOREIGN KEY (`pattern_id`) REFERENCES `patterns` (`id`);