-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 18, 2014 at 07:46 PM
-- Server version: 5.6.20
-- PHP Version: 5.5.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `tweetydb`
--

CREATE DATABASE IF NOT EXISTS `tweetydb` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `tweetydb`;

-- --------------------------------------------------------

--
-- Table structure for table `phrases`
--


CREATE TABLE IF NOT EXISTS `phrases` (
  `phrase` varchar(12) NOT NULL,
  `grp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `rel_tweet`
--


CREATE TABLE IF NOT EXISTS `rel_tweet` (
  `grpid` int(11) NOT NULL,
  `twid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `relations`
--


CREATE TABLE IF NOT EXISTS `relations` (
  `word` varchar(20) NOT NULL,
  `grp` int(11) NOT NULL,
  `rep` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tweeters`
--


CREATE TABLE IF NOT EXISTS `tweeters` (
`id` int(12) NOT NULL,
  `scr_name` varchar(30) NOT NULL,
  `desc` varchar(145) NOT NULL,
  `img_url` varchar(145) NOT NULL,
  `ban_url` varchar(145) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=105843 ;

-- --------------------------------------------------------

--
-- Table structure for table `tweets`
--


CREATE TABLE IF NOT EXISTS `tweets` (
`id` int(11) NOT NULL,
  `text` varchar(145) NOT NULL,
  `timestamp_ms` int(20) DEFAULT NULL,
  `userid` int(12) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=105843 ;

-- --------------------------------------------------------

--
-- Table structure for table `user_prefs`
--


CREATE TABLE IF NOT EXISTS `user_prefs` (
  `userid` int(12) NOT NULL,
  `grpid` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--


CREATE TABLE IF NOT EXISTS `users` (
`id` int(11) NOT NULL,
  `email` varchar(40) NOT NULL,
  `verify_acct` int(11) DEFAULT NULL,
  `password` varchar(40) NOT NULL,
  `name` varchar(30) NOT NULL,
  `active` int(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=14 ;

-- --------------------------------------------------------

--
-- Table structure for table `words`
--


CREATE TABLE IF NOT EXISTS `words` (
  `word` varchar(100) NOT NULL,
  `grp` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `phrases`
--
ALTER TABLE `phrases`
 ADD PRIMARY KEY (`phrase`);

--
-- Indexes for table `rel_tweet`
--
ALTER TABLE `rel_tweet`
 ADD PRIMARY KEY (`grpid`,`twid`);

--
-- Indexes for table `relations`
--
ALTER TABLE `relations`
 ADD PRIMARY KEY (`word`,`grp`);

--
-- Indexes for table `tweeters`
--
ALTER TABLE `tweeters`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `scr_name` (`scr_name`);

--
-- Indexes for table `tweets`
--
ALTER TABLE `tweets`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `text` (`text`);

--
-- Indexes for table `user_prefs`
--
ALTER TABLE `user_prefs`
 ADD PRIMARY KEY (`userid`,`grpid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tweeters`
--
ALTER TABLE `tweeters`
MODIFY `id` int(12) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=105843;
--
-- AUTO_INCREMENT for table `tweets`
--
ALTER TABLE `tweets`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=105843;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=14;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
