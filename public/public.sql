-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Wrz 29, 2023 at 03:36 PM
-- Wersja serwera: 10.4.28-MariaDB
-- Wersja PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `radio`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `artists`
--

CREATE TABLE `artists` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `artists_tracks`
--

CREATE TABLE `artists_tracks` (
  `artists_id` int(11) NOT NULL,
  `tracks_id` varchar(22) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `tracks`
--

CREATE TABLE `tracks` (
  `id` varchar(22) NOT NULL,
  `cover` varchar(100) DEFAULT NULL,
  `artist` varchar(255) NOT NULL,
  `length` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `banned` tinyint(1) DEFAULT NULL,
  `verified` tinyint(1) not null DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `tracks`
    ADD FULLTEXT INDEX `nameIndex` (`name`);

ALTER TABLE `tracks`
    ADD FULLTEXT INDEX `artistIndex` (`artist`);

--
-- Dumping data for table `tracks`
--

INSERT INTO `tracks` (`id`, `cover`, `artist`, `length`, `name`, `banned`, `verified`) VALUES
('04aAxqtGp5pv12UXAg4pkq', 'https://i.scdn.co/image/ab67616d0000b2733cf1c1dbcfa3f1ab7282719b', '', 228360, 'Centuries', 0,0),
('0AUyNF6iFxMNQsNx2nhtrw', 'https://i.scdn.co/image/ab67616d0000b27397d11a89e5fd70347099f7c9', '', 216720, 'Blood // Water', 0,0),
('0DrDcqWpokMlhKYJSwoT4B', 'https://i.scdn.co/image/ab67616d0000b2731e8d8ca012d1289cafba4242', '', 209160, 'Don\'t Stop Me Now', 0,0),
('1kBauQyBgZA0GYSRptBTef', 'https://i.scdn.co/image/ab67616d0000b2731ea3281bc9b91e5d848be92f', '', 286240, 'Never Fade Away (SAMURAI Cover)', 0,0),
('26f7Peps5KnWZMQfmWiLl7', 'https://i.scdn.co/image/ab67616d0000b273aba42bc2bf2b1a3006def9f1', '', 262320, 'Randori', 0,0),
('2LBqCSwhJGcFQeTHMVGwy3', 'https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a', '', 260253, 'Die For You', 0,0),
('2tpWsVSb9UEmDRxAl1zhX1', 'https://i.scdn.co/image/ab67616d0000b2739e2f95ae77cf436017ada9cb', '', 257265, 'Counting Stars', 0,0),
('3K00Ib1shkOEiAXU5pec6e', 'https://i.scdn.co/image/ab67616d0000b2737a1b61448054bd2f97406822', '', 157252, 'Back To You', 0,0),
('4h9wh7iOZ0GGn8QVp4RAOB', 'https://i.scdn.co/image/ab67616d0000b273ec96e006b8bdfc582610ec13', '', 148485, 'I Ain\'t Worried', 0,0),
('54ipXppHLA8U4yqpOFTUhr', 'https://i.scdn.co/image/ab67616d0000b273fc915b69600dce2991a61f13', '', 165264, 'Bones', 0,0),
('6tSXFwYjoB1JeQ7WCNcKxC', 'https://i.scdn.co/image/ab67616d0000b27386b02e069b991dc8e608918a', 'Taco Hemingway', 215426, 'SUPRO', 0,0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `votes`
--

CREATE TABLE `votes` (
  `id` int(11) NOT NULL,
  `track_id` varchar(22) NOT NULL,
  `date_added` date NOT NULL,
  `ip` varchar(50) NOT NULL,
  `visitor_id` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `ranking_archive` (
  -- `id` int(11) NOT NULL,
  `track_id` varchar(22) NOT NULL,
  `vote_count` int(11) NOT NULL,
  PRIMARY KEY (`track_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `artists`
--
ALTER TABLE `artists`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `tracks`
--
ALTER TABLE `tracks`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `track_id` (`track_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `artists`
--
ALTER TABLE `artists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;


--
-- AUTO_INCREMENT for table `votes`
--
ALTER TABLE `votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `artists_tracks`
--
ALTER TABLE `artists_tracks`
  ADD CONSTRAINT `artists_tracks_ibfk_1` FOREIGN KEY (`artists_id`) REFERENCES `artists` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `artists_tracks_ibfk_2` FOREIGN KEY (`tracks_id`) REFERENCES `tracks` (`id`) ON DELETE CASCADE;



--
-- Constraints for table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`track_id`) REFERENCES `tracks` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
