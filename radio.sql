-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Wrz 15, 2023 at 10:12 PM
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
CREATE DATABASE IF NOT EXISTS `radio` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `radio`;

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
  `tracks_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `breaks`
--

CREATE TABLE `breaks` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `position` int(11) DEFAULT NULL,
  `start` varchar(255) DEFAULT NULL,
  `end` varchar(255) DEFAULT NULL,
  `for_requested` tinyint(1) DEFAULT NULL,
  `pattern_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `patterns`
--

CREATE TABLE `patterns` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `alarm_offset` int(11) DEFAULT NULL,
  `active` BOOLEAN DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `requested_tracks`
--

CREATE TABLE `requested_tracks` (
  `id` int(11) DEFAULT NULL,
  `votes` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `tracks`
--

CREATE TABLE `tracks` (
  `id` varchar(22) NOT NULL,
  `cover` varchar(255) DEFAULT NULL,
  `length` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `banned` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tracks`
--

INSERT INTO `tracks` (`id`, `cover`, `length`, `name`, `banned`) VALUES
('04aAxqtGp5pv12UXAg4pkq', 'https://i.scdn.co/image/ab67616d0000b2733cf1c1dbcfa3f1ab7282719b', 228360, 'Centuries', 0),
('2LBqCSwhJGcFQeTHMVGwy3', 'https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a', 260253, 'Die For You', 0),
('3K00Ib1shkOEiAXU5pec6e', 'https://i.scdn.co/image/ab67616d0000b2737a1b61448054bd2f97406822', 157252, 'Back To You', 0),
('4h9wh7iOZ0GGn8QVp4RAOB', 'https://i.scdn.co/image/ab67616d0000b273ec96e006b8bdfc582610ec13', 148485, 'I Ain\'t Worried', 0),
('54ipXppHLA8U4yqpOFTUhr', 'https://i.scdn.co/image/ab67616d0000b273fc915b69600dce2991a61f13', 165264, 'Bones', 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `votes`
--

CREATE TABLE `votes` (
  `id` int(11) NOT NULL,
  `track_id` varchar(22) NOT NULL,
  `date_added` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`id`, `track_id`, `date_added`) VALUES
(1, '04aAxqtGp5pv12UXAg4pkq', '2023-09-15'),
(2, '04aAxqtGp5pv12UXAg4pkq', '2023-09-14'),
(3, '04aAxqtGp5pv12UXAg4pkq', '2023-09-14'),
(4, '04aAxqtGp5pv12UXAg4pkq', '2023-09-14'),
(5, '04aAxqtGp5pv12UXAg4pkq', '2023-09-15'),
(6, '04aAxqtGp5pv12UXAg4pkq', '2023-09-15'),
(7, '3K00Ib1shkOEiAXU5pec6e', '2023-09-15'),
(8, '3K00Ib1shkOEiAXU5pec6e', '2023-09-15'),
(9, '3K00Ib1shkOEiAXU5pec6e', '2023-09-15'),
(10, '3K00Ib1shkOEiAXU5pec6e', '2023-09-15'),
(11, '4h9wh7iOZ0GGn8QVp4RAOB', '2023-09-15'),
(12, '2LBqCSwhJGcFQeTHMVGwy3', '2023-09-15');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `artists`
--
ALTER TABLE `artists`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `artists_tracks`
--
ALTER TABLE `artists_tracks`
  ADD PRIMARY KEY (`artists_id`,`tracks_id`),
  ADD KEY `tracks_id` (`tracks_id`);

--
-- Indeksy dla tabeli `breaks`
--
ALTER TABLE `breaks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pattern_id` (`pattern_id`);

--
-- Indeksy dla tabeli `patterns`
--
ALTER TABLE `patterns`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `requested_tracks`
--
ALTER TABLE `requested_tracks`
  ADD UNIQUE KEY `id` (`id`);

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
-- AUTO_INCREMENT for table `votes`
--
ALTER TABLE `votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `artists_tracks`
--
ALTER TABLE `artists_tracks`
  ADD CONSTRAINT `artists_tracks_ibfk_1` FOREIGN KEY (`artists_id`) REFERENCES `artists` (`id`);

--
-- Constraints for table `breaks`
--
ALTER TABLE `breaks`
  ADD CONSTRAINT `breaks_ibfk_1` FOREIGN KEY (`pattern_id`) REFERENCES `patterns` (`id`);

--
-- Constraints for table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`track_id`) REFERENCES `tracks` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
