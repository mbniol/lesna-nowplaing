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
-- Struktura tabeli dla tabeli a`artists`
--


CREATE TABLE `days_off` (
  `month` int(2) NOT NULL,
  `day` int(2) NOT NULL,
  PRIMARY KEY (month, day)
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
  `active` tinyint(1) not null DEFAULT 0
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

ALTER TABLE `breaks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `patterns`
--
ALTER TABLE `patterns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- Constraints for table `breaks`
--
ALTER TABLE `breaks`
  ADD CONSTRAINT `breaks_ibfk_1` FOREIGN KEY (`pattern_id`) REFERENCES `patterns` (`id`) ON DELETE CASCADE;


CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `topic` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zrzut danych tabeli `news`
--

INSERT INTO `news` (`id`, `topic`, `content`, `date`) VALUES
(1, 'Apel 11 listopada', 'Uwaga uczniowie\r\ndnia 10 listopada odbędzie się uroczysty apel z okazji dnia 11 listopada \r\nobowiązkowy strój galowy', '2023-11-10'),
(2, 'Żywy obraz', 'Dnia 10 listopada odbędzie się konkurs na żywy obraz Zapraszamy do udziału', '2023-11-10');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
