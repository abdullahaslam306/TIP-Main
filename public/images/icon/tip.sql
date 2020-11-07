-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 01, 2020 at 10:29 AM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.2.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tip`
--

-- --------------------------------------------------------

--
-- Table structure for table `contactus`
--

CREATE TABLE `contactus` (
  `id` int(11) NOT NULL,
  `rcvdfrom` varchar(100) NOT NULL,
  `subject` varchar(200) NOT NULL,
  `content` varchar(1000) NOT NULL,
  `dated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `contactus`
--

INSERT INTO `contactus` (`id`, `rcvdfrom`, `subject`, `content`, `dated`) VALUES
(13, 'aBDJAKNAKND', 'sajdmk', 'asnd jasdk', '2020-10-27 11:29:34'),
(24, 'tip-template1', 'ABDULLAHALSM306@GMAIL.COM', 'AKDSF AS;MF AS;LFM AS;FL', '2020-10-27 11:41:44'),
(25, 'loru lallit', 'lorulallit@gmail.com', 'kwlnqkd qklwmke wqekl', '2020-10-27 11:45:44'),
(26, 'Mr Preston', 'mrprestonbrown@gmail.com', 'Hi i want to ask some questions kindly contact me!', '2020-10-30 12:12:31');

-- --------------------------------------------------------

--
-- Table structure for table `subscription`
--

CREATE TABLE `subscription` (
  `id` int(11) NOT NULL,
  `mail` varchar(50) NOT NULL,
  `dated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subscription`
--

INSERT INTO `subscription` (`id`, `mail`, `dated`) VALUES
(1, 'abdullahaslam306@gmail.com', '2020-10-27 10:01:31'),
(5, 'asabdjan', '2020-10-27 10:07:47'),
(6, 'abdullahaslammatrix@gmail.com', '2020-10-27 10:13:28'),
(8, 'f178135@nu.edu.pk', '2020-10-27 10:13:53'),
(9, 'f178135@cfd.nu.edu.pk', '2020-10-27 10:14:07'),
(11, 'thematrix9815@gmail.com', '2020-10-27 10:28:49'),
(14, 'u.aslam105@gmail.com', '2020-10-30 12:10:25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contactus`
--
ALTER TABLE `contactus`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscription`
--
ALTER TABLE `subscription`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mail` (`mail`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contactus`
--
ALTER TABLE `contactus`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `subscription`
--
ALTER TABLE `subscription`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
