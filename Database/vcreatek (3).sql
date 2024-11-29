-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 27, 2023 at 06:09 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vcreatek`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `category` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `category`) VALUES
(1, 'Data Visualization'),
(2, 'Machine Learning');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `project_name` varchar(255) DEFAULT NULL,
  `project_desc` text DEFAULT NULL,
  `project_link` text DEFAULT NULL,
  `project_image` varchar(500) DEFAULT NULL,
  `category` int(11) NOT NULL,
  `team` int(11) NOT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `deleted_by` int(11) DEFAULT NULL,
  `created_on` datetime DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  `deleted_on` datetime DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `project_name`, `project_desc`, `project_link`, `project_image`, `category`, `team`, `created_by`, `updated_by`, `deleted_by`, `created_on`, `updated_on`, `deleted_on`, `is_deleted`) VALUES
(1, 'Contract Analytics Using GenAI 3', 'On Ganesh System need to deploy on LAB', 'https://vcreatek.greythr.com/uas/portal/auth/login?login_challenge=64c1e32162e54354b9ad47f18eb3920f', 'istockphoto-1286704861-170x170.jpg', 1, 2, NULL, 1, NULL, '2023-10-12 17:38:40', '0000-00-00 00:00:00', NULL, 0),
(2, 'Contract Analytics Using GenAI', 'On Ganesh System need to deploy on LAB', 'https://vcreatek.greythr.com/uas/portal/auth/login?login_challenge=64c1e32162e54354b9ad47f18eb3920f', 'DSC_1093-1.png', 1, 2, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(3, 'zxc', 'zxc', 'zxc', 'depositphotos_467366440-stock-illustration-flat-isometric-vector-illustration-isolated.jpg', 2, 2, NULL, NULL, NULL, NULL, NULL, NULL, 1),
(4, 'POC on Django with Quality', 'Huge data, can be done by reducing the cols and generating the data, Harsh working on sample data and generated data with prompt engineering', 'https://vcreatek.greythr.com/uas/portal/auth/login?login_challenge=ce0f98e6b8724af0a39fbab480cfbf4e', 'istockphoto-1392682224-612x612.jpg', 2, 2, NULL, 1, NULL, '2023-10-13 11:40:52', '0000-00-00 00:00:00', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role`, `created`, `updated`) VALUES
(1, 'User', '2023-10-20 09:51:22', '2023-10-20 09:51:22'),
(2, 'Admin', '2023-10-20 09:51:22', '2023-10-20 09:51:22');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `team` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `team`) VALUES
(1, 'DS Lab'),
(2, 'GBI NA');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT 0,
  `role` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `password`, `created`, `email`, `is_deleted`, `role`) VALUES
(1, 'sharad', 'gaikwad', '$2a$08$rGgvo4zwiDENWUJNdvjOKOputNK5aP8bGJ2m.i5lrN8JKrRGSc/wm', '0000-00-00 00:00:00', 'sharad.g@vcreatek.com', 0, 2),
(2, 'sharad', 'gaikwad', '$2a$08$BWiXI3l/316YyANVB8A5RO6P/ZMOocLiJyMEZXDm/u1QHO2.cXrR.', '2023-10-20 12:55:06', 'sharad.gaikwad01@gmail.com', 0, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`category`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`team`) REFERENCES `teams` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
