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
  `active` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patterns`
--

INSERT INTO `patterns` (`id`, `name`, `alarm_offset`, `active`) VALUES
(1, 'testowe', 123, 0),
(2, NULL, NULL, 0),
(3, NULL, NULL, 0),
(4, NULL, NULL, 0),
(5, NULL, NULL, 0),
(6, NULL, NULL, 0),
(7, NULL, NULL, 0),
(8, NULL, NULL, 0),
(9, NULL, NULL, 0),
(10, NULL, NULL, 0),
(11, NULL, NULL, 0),
(12, NULL, NULL, 0),
(13, NULL, NULL, 0),
(14, NULL, NULL, 0),
(15, NULL, NULL, 0),
(16, NULL, NULL, 0),
(17, NULL, NULL, 0),
(18, NULL, NULL, 0),
(19, NULL, NULL, 0),
(20, NULL, NULL, 0),
(21, NULL, NULL, 0),
(22, NULL, NULL, 0),
(23, NULL, NULL, 0),
(24, NULL, NULL, 0),
(25, NULL, NULL, 0),
(26, NULL, NULL, 0),
(27, NULL, NULL, 0),
(28, NULL, NULL, 0),
(29, NULL, NULL, 0),
(30, NULL, NULL, 0),
(31, NULL, NULL, 0),
(32, NULL, NULL, 0),
(33, NULL, NULL, 0),
(34, NULL, NULL, 0),
(35, NULL, NULL, 0),
(36, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `requested_tracks`
--

CREATE TABLE `requested_tracks` (
  `id` int(11) NOT NULL,
  `votes` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `tracks`
--

CREATE TABLE `tracks` (
  `id` varchar(22) NOT NULL,
  `cover` varchar(255) DEFAULT NULL,
  `artist` text NOT NULL,
  `length` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `banned` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tracks`
--

INSERT INTO `tracks` (`id`, `cover`, `artist`, `length`, `name`, `banned`) VALUES
('04aAxqtGp5pv12UXAg4pkq', 'https://i.scdn.co/image/ab67616d0000b2733cf1c1dbcfa3f1ab7282719b', '', 228360, 'Centuries', 0),
('0AUyNF6iFxMNQsNx2nhtrw', 'https://i.scdn.co/image/ab67616d0000b27397d11a89e5fd70347099f7c9', '', 216720, 'Blood // Water', 0),
('0DrDcqWpokMlhKYJSwoT4B', 'https://i.scdn.co/image/ab67616d0000b2731e8d8ca012d1289cafba4242', '', 209160, 'Don\'t Stop Me Now', 0),
('1kBauQyBgZA0GYSRptBTef', 'https://i.scdn.co/image/ab67616d0000b2731ea3281bc9b91e5d848be92f', '', 286240, 'Never Fade Away (SAMURAI Cover)', 0),
('26f7Peps5KnWZMQfmWiLl7', 'https://i.scdn.co/image/ab67616d0000b273aba42bc2bf2b1a3006def9f1', '', 262320, 'Randori', 0),
('2LBqCSwhJGcFQeTHMVGwy3', 'https://i.scdn.co/image/ab67616d0000b273a048415db06a5b6fa7ec4e1a', '', 260253, 'Die For You', 0),
('2tpWsVSb9UEmDRxAl1zhX1', 'https://i.scdn.co/image/ab67616d0000b2739e2f95ae77cf436017ada9cb', '', 257265, 'Counting Stars', 0),
('3K00Ib1shkOEiAXU5pec6e', 'https://i.scdn.co/image/ab67616d0000b2737a1b61448054bd2f97406822', '', 157252, 'Back To You', 0),
('4h9wh7iOZ0GGn8QVp4RAOB', 'https://i.scdn.co/image/ab67616d0000b273ec96e006b8bdfc582610ec13', '', 148485, 'I Ain\'t Worried', 0),
('54ipXppHLA8U4yqpOFTUhr', 'https://i.scdn.co/image/ab67616d0000b273fc915b69600dce2991a61f13', '', 165264, 'Bones', 0),
('6tSXFwYjoB1JeQ7WCNcKxC', 'https://i.scdn.co/image/ab67616d0000b27386b02e069b991dc8e608918a', 'Taco Hemingway', 215426, 'SUPRO', 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `votes`
--

CREATE TABLE `votes` (
  `id` int(11) NOT NULL,
  `track_id` varchar(22) NOT NULL,
  `date_added` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`id`, `track_id`, `date_added`) VALUES
(1, '04aAxqtGp5pv12UXAg4pkq', '2023-09-24'),
(2, '04aAxqtGp5pv12UXAg4pkq', '2023-09-24'),
(3, '04aAxqtGp5pv12UXAg4pkq', '2023-09-24'),
(4, '04aAxqtGp5pv12UXAg4pkq', '2023-09-24'),
(5, '04aAxqtGp5pv12UXAg4pkq', '2023-09-25'),
(6, '04aAxqtGp5pv12UXAg4pkq', '2023-09-25'),
(7, '3K00Ib1shkOEiAXU5pec6e', '2023-09-25'),
(8, '3K00Ib1shkOEiAXU5pec6e', '2023-09-25'),
(9, '3K00Ib1shkOEiAXU5pec6e', '2023-09-25'),
(10, '3K00Ib1shkOEiAXU5pec6e', '2023-09-25'),
(11, '4h9wh7iOZ0GGn8QVp4RAOB', '2023-09-25'),
(12, '2LBqCSwhJGcFQeTHMVGwy3', '2023-09-25'),
(13, '54ipXppHLA8U4yqpOFTUhr', '2023-09-25'),
(14, '54ipXppHLA8U4yqpOFTUhr', '2023-09-25'),
(15, '54ipXppHLA8U4yqpOFTUhr', '2023-09-25'),
(16, '54ipXppHLA8U4yqpOFTUhr', '2023-09-25'),
(17, '54ipXppHLA8U4yqpOFTUhr', '2023-09-25'),
(18, '54ipXppHLA8U4yqpOFTUhr', '2023-09-25'),
(19, '54ipXppHLA8U4yqpOFTUhr', '2023-09-25'),
(20, '54ipXppHLA8U4yqpOFTUhr', '2023-09-25'),
(21, '54ipXppHLA8U4yqpOFTUhr', '2023-09-25'),
(22, '54ipXppHLA8U4yqpOFTUhr', '2023-09-25'),
(23, '0AUyNF6iFxMNQsNx2nhtrw', '2023-09-25'),
(24, '0AUyNF6iFxMNQsNx2nhtrw', '2023-09-25'),
(25, '2tpWsVSb9UEmDRxAl1zhX1', '2023-09-26'),
(26, '2tpWsVSb9UEmDRxAl1zhX1', '2023-09-26'),
(27, '0AUyNF6iFxMNQsNx2nhtrw', '2023-09-27'),
(28, '0AUyNF6iFxMNQsNx2nhtrw', '2023-09-27'),
(29, '0AUyNF6iFxMNQsNx2nhtrw', '2023-09-27'),
(30, '0AUyNF6iFxMNQsNx2nhtrw', '2023-09-27'),
(31, '0AUyNF6iFxMNQsNx2nhtrw', '2023-09-27'),
(32, '0AUyNF6iFxMNQsNx2nhtrw', '2023-09-27'),
(33, '0AUyNF6iFxMNQsNx2nhtrw', '2023-09-27'),
(34, '0AUyNF6iFxMNQsNx2nhtrw', '2023-09-27'),
(35, '0AUyNF6iFxMNQsNx2nhtrw', '2023-09-29'),
(36, '0AUyNF6iFxMNQsNx2nhtrw', '2023-09-29'),
(37, '0AUyNF6iFxMNQsNx2nhtrw', '2023-09-29'),
(38, '3K00Ib1shkOEiAXU5pec6e', '2023-09-29'),
(50, '1kBauQyBgZA0GYSRptBTef', '2023-09-29'),
(51, '1kBauQyBgZA0GYSRptBTef', '2023-09-29'),
(52, '1kBauQyBgZA0GYSRptBTef', '2023-09-29'),
(53, '1kBauQyBgZA0GYSRptBTef', '2023-09-29'),
(54, '1kBauQyBgZA0GYSRptBTef', '2023-09-29'),
(55, '1kBauQyBgZA0GYSRptBTef', '2023-09-29'),
(56, '1kBauQyBgZA0GYSRptBTef', '2023-09-29'),
(57, '4h9wh7iOZ0GGn8QVp4RAOB', '2023-09-29'),
(58, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(59, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(60, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(61, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(62, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(63, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(64, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(65, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(66, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(67, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(68, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(69, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(70, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(71, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(72, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(73, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(74, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(75, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(76, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(77, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(78, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(79, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(80, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(81, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(82, '0DrDcqWpokMlhKYJSwoT4B', '2023-09-29'),
(83, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(84, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(85, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(86, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(87, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(88, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(89, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(90, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(91, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(92, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(93, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(94, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(95, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(96, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(97, '26f7Peps5KnWZMQfmWiLl7', '2023-09-29'),
(98, '6tSXFwYjoB1JeQ7WCNcKxC', '2023-09-29');

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
-- AUTO_INCREMENT for table `breaks`
--
ALTER TABLE `breaks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patterns`
--
ALTER TABLE `patterns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `requested_tracks`
--
ALTER TABLE `requested_tracks`
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
  ADD CONSTRAINT `artists_tracks_ibfk_1` FOREIGN KEY (`artists_id`) REFERENCES `artists` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `breaks`
--
ALTER TABLE `breaks`
  ADD CONSTRAINT `breaks_ibfk_1` FOREIGN KEY (`pattern_id`) REFERENCES `patterns` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`track_id`) REFERENCES `tracks` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
