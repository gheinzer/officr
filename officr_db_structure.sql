-- phpMyAdmin SQL Dump
-- version 4.9.7deb1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Erstellungszeit: 28. Sep 2021 um 21:49
-- Server-Version: 8.0.26-0ubuntu0.21.04.3
-- PHP-Version: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `officr`
--
CREATE DATABASE IF NOT EXISTS `officr` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `officr`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `todo_categories`
--

CREATE TABLE `todo_categories` (
  `ID` int NOT NULL,
  `UserID` int NOT NULL,
  `Name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `todo_tasks`
--

CREATE TABLE `todo_tasks` (
  `ID` int NOT NULL,
  `UserID` int NOT NULL,
  `CategoryID` int NOT NULL,
  `TypeID` int NOT NULL,
  `StateID` int NOT NULL DEFAULT '0',
  `Description` text NOT NULL,
  `Date` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `todo_types`
--

CREATE TABLE `todo_types` (
  `ID` int NOT NULL,
  `UserID` int NOT NULL,
  `Name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `users`
--

CREATE TABLE `users` (
  `ID` int NOT NULL,
  `Username` text NOT NULL,
  `Password` text NOT NULL,
  `Email` text NOT NULL,
  `isAdmin` int NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `usersessions`
--

CREATE TABLE `usersessions` (
  `ID` int NOT NULL,
  `UserID` int NOT NULL,
  `PrivateID` text NOT NULL,
  `Expires` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `todo_categories`
--
ALTER TABLE `todo_categories`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `todo_tasks`
--
ALTER TABLE `todo_tasks`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `todo_types`
--
ALTER TABLE `todo_types`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- Indizes für die Tabelle `usersessions`
--
ALTER TABLE `usersessions`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `todo_categories`
--
ALTER TABLE `todo_categories`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `todo_tasks`
--
ALTER TABLE `todo_tasks`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `todo_types`
--
ALTER TABLE `todo_types`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `users`
--
ALTER TABLE `users`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `usersessions`
--
ALTER TABLE `usersessions`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;