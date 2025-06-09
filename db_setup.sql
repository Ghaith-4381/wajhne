-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 05, 2025 at 04:07 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gggg`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(200) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL,
  `password_hash_2` varchar(255) NOT NULL,
  `password_hash_3` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `password_hash`, `full_name`, `email`, `created_at`, `last_login`, `password_hash_2`, `password_hash_3`) VALUES
(1, 'admin123', '$2a$10$ZLOeK6b9TI3JzCCzE5qv.eoTWX2nFq1zVsxQIXy1pqA6qC4lFgTca', 'مدير النظام', 'admin@example.com', '2025-05-22 07:13:20', NULL, '', ''),
(14, 'Ghaith_134185', '$2b$10$NzFrNlrjuqlQQe/1WKyrGuIUuJvUTB3GYtV0LX7lQL4OT30KLZkfe', 'Ghaith Almohammad', 'ghaithalmohammad@gmail.com', '2025-06-01 06:33:58', '2025-06-01 18:11:34', '$2b$10$rAZmeb/7oMeeDm2QM7owGeqdboC/YL0pzupQseJhJvjF/ZPR7Gkiq', '$2b$10$UR7cVXIrwEkYgaqjYddo7OfWrjr/vEOocBQaJWKZvTDP3YKsRKG6O');

-- --------------------------------------------------------

--
-- Table structure for table `admin_otps`
--

CREATE TABLE `admin_otps` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `otp_code` varchar(10) NOT NULL,
  `expires_at` datetime NOT NULL,
  `verified` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `anti_click_bot_settings`
--

CREATE TABLE `anti_click_bot_settings` (
  `id` int(11) NOT NULL,
  `is_enabled` tinyint(1) DEFAULT 1 COMMENT 'تفعيل/تعطيل الحماية',
  `max_clicks_per_minute` int(11) DEFAULT 100 COMMENT 'الحد الأقصى للنقرات في الدقيقة',
  `time_window_seconds` int(11) DEFAULT 60 COMMENT 'النافذة الزمنية بالثواني',
  `block_duration_minutes` int(11) DEFAULT 5 COMMENT 'مدة الحظر بالدقائق',
  `require_captcha` tinyint(1) DEFAULT 1 COMMENT 'طلب كابتشا عند التجاوز',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `anti_click_bot_settings`
--

INSERT INTO `anti_click_bot_settings` (`id`, `is_enabled`, `max_clicks_per_minute`, `time_window_seconds`, `block_duration_minutes`, `require_captcha`, `created_at`, `updated_at`) VALUES
(1, 1, 80, 1, 5, 1, '2025-06-02 11:32:23', '2025-06-02 14:31:20');

-- --------------------------------------------------------

--
-- Table structure for table `banned_ips`
--

CREATE TABLE `banned_ips` (
  `id` int(11) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `country` varchar(100) DEFAULT NULL,
  `ban_type` enum('temporary','permanent') DEFAULT 'temporary',
  `ban_reason` varchar(255) DEFAULT 'نشاط غير طبيعي / استخدام أدوات تزوير',
  `banned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `banned_by_admin` tinyint(1) DEFAULT 0,
  `click_count_at_ban` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ban_settings`
--

CREATE TABLE `ban_settings` (
  `id` int(11) NOT NULL,
  `max_clicks_per_window` int(11) DEFAULT 20,
  `time_window_seconds` int(11) DEFAULT 10,
  `temp_ban_duration_minutes` int(11) DEFAULT 30,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ban_settings`
--

INSERT INTO `ban_settings` (`id`, `max_clicks_per_window`, `time_window_seconds`, `temp_ban_duration_minutes`, `created_at`, `updated_at`) VALUES
(1, 80, 10, 30, '2025-05-31 13:35:58', '2025-06-02 14:31:44');

-- --------------------------------------------------------

--
-- Table structure for table `challenge_settings`
--

CREATE TABLE `challenge_settings` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `click_events`
--

CREATE TABLE `click_events` (
  `id` int(11) NOT NULL,
  `image_id` int(11) NOT NULL,
  `country` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `click_events`
--

INSERT INTO `click_events` (`id`, `image_id`, `country`, `created_at`) VALUES
(251, 2, 'Saudi Arabia', '2025-05-31 11:34:16'),
(252, 2, 'Saudi Arabia', '2025-05-31 11:34:16'),
(253, 2, 'Saudi Arabia', '2025-05-31 11:34:16'),
(254, 2, 'Saudi Arabia', '2025-05-31 11:34:16'),
(255, 1, 'Saudi Arabia', '2025-05-31 11:34:17'),
(256, 1, 'Saudi Arabia', '2025-05-31 11:34:17'),
(257, 1, 'Saudi Arabia', '2025-05-31 11:34:17'),
(258, 1, 'Saudi Arabia', '2025-05-31 11:34:17'),
(259, 1, 'Saudi Arabia', '2025-05-31 11:34:17'),
(260, 1, 'Saudi Arabia', '2025-05-31 11:34:18'),
(261, 1, 'Saudi Arabia', '2025-05-31 11:34:18'),
(262, 2, 'Saudi Arabia', '2025-05-31 11:56:43'),
(263, 2, 'Saudi Arabia', '2025-05-31 11:56:43'),
(264, 2, 'Saudi Arabia', '2025-05-31 11:56:44'),
(265, 2, 'Saudi Arabia', '2025-05-31 11:56:45'),
(266, 2, 'Saudi Arabia', '2025-05-31 11:56:46'),
(267, 2, 'Saudi Arabia', '2025-05-31 11:56:46'),
(268, 2, 'Saudi Arabia', '2025-05-31 11:56:46'),
(269, 2, 'Saudi Arabia', '2025-05-31 11:56:47'),
(270, 2, 'Saudi Arabia', '2025-05-31 11:56:47'),
(271, 2, 'Saudi Arabia', '2025-05-31 11:56:47'),
(272, 2, 'Saudi Arabia', '2025-05-31 11:56:47'),
(273, 2, 'Saudi Arabia', '2025-05-31 11:56:47'),
(274, 2, 'Saudi Arabia', '2025-05-31 11:56:48'),
(275, 2, 'Saudi Arabia', '2025-05-31 11:56:48'),
(276, 2, 'Saudi Arabia', '2025-05-31 11:56:48'),
(277, 2, 'Saudi Arabia', '2025-05-31 11:56:48'),
(278, 2, 'Saudi Arabia', '2025-05-31 11:56:48'),
(279, 2, 'Saudi Arabia', '2025-05-31 11:56:48'),
(280, 2, 'Saudi Arabia', '2025-05-31 11:56:48'),
(281, 2, 'Saudi Arabia', '2025-05-31 11:56:49'),
(282, 2, 'Saudi Arabia', '2025-05-31 11:56:49'),
(283, 2, 'Saudi Arabia', '2025-05-31 11:56:49'),
(284, 2, 'Saudi Arabia', '2025-05-31 11:56:49'),
(285, 2, 'Saudi Arabia', '2025-05-31 11:56:49'),
(286, 2, 'Saudi Arabia', '2025-05-31 11:56:49'),
(287, 2, 'Saudi Arabia', '2025-05-31 11:56:50'),
(288, 2, 'Saudi Arabia', '2025-05-31 11:56:50'),
(289, 2, 'Saudi Arabia', '2025-05-31 11:56:51'),
(290, 2, 'Saudi Arabia', '2025-05-31 11:56:51'),
(291, 2, 'Saudi Arabia', '2025-05-31 11:56:51'),
(292, 1, 'Saudi Arabia', '2025-05-31 11:56:52'),
(293, 1, 'Saudi Arabia', '2025-05-31 11:56:52'),
(294, 1, 'Saudi Arabia', '2025-05-31 11:56:52'),
(295, 1, 'Saudi Arabia', '2025-05-31 11:56:52'),
(296, 1, 'Saudi Arabia', '2025-05-31 11:56:52'),
(297, 1, 'Saudi Arabia', '2025-05-31 11:56:53'),
(298, 1, 'Saudi Arabia', '2025-05-31 11:56:53'),
(299, 1, 'Saudi Arabia', '2025-05-31 11:56:53'),
(300, 1, 'Saudi Arabia', '2025-05-31 11:56:53'),
(301, 1, 'Saudi Arabia', '2025-05-31 11:56:53'),
(302, 1, 'Saudi Arabia', '2025-05-31 11:56:54'),
(303, 1, 'Saudi Arabia', '2025-05-31 11:56:54'),
(304, 1, 'Saudi Arabia', '2025-05-31 11:57:29'),
(305, 2, 'Saudi Arabia', '2025-05-31 11:57:30'),
(306, 2, 'Saudi Arabia', '2025-05-31 11:57:30'),
(307, 2, 'Saudi Arabia', '2025-05-31 11:57:31'),
(308, 2, 'Saudi Arabia', '2025-05-31 11:57:31'),
(309, 2, 'Saudi Arabia', '2025-05-31 11:57:31'),
(310, 2, 'Saudi Arabia', '2025-05-31 11:57:31'),
(311, 2, 'Saudi Arabia', '2025-05-31 11:57:31'),
(312, 2, 'Saudi Arabia', '2025-05-31 11:57:31'),
(313, 2, 'Saudi Arabia', '2025-05-31 11:57:31'),
(314, 2, 'Saudi Arabia', '2025-05-31 11:57:32'),
(315, 2, 'Saudi Arabia', '2025-05-31 11:57:32'),
(316, 2, 'Saudi Arabia', '2025-05-31 12:04:41'),
(317, 1, 'Saudi Arabia', '2025-05-31 12:04:43'),
(318, 1, 'Saudi Arabia', '2025-05-31 12:04:44'),
(319, 1, 'Saudi Arabia', '2025-05-31 12:04:44'),
(320, 1, 'Saudi Arabia', '2025-05-31 12:04:44'),
(321, 1, 'Saudi Arabia', '2025-05-31 12:04:44'),
(322, 1, 'Saudi Arabia', '2025-05-31 12:04:44'),
(323, 1, 'Saudi Arabia', '2025-05-31 12:04:44'),
(324, 1, 'Saudi Arabia', '2025-05-31 12:04:44'),
(325, 1, 'Saudi Arabia', '2025-05-31 12:04:45'),
(326, 1, 'Saudi Arabia', '2025-05-31 12:04:45'),
(327, 1, 'Saudi Arabia', '2025-05-31 12:04:45'),
(328, 1, 'Saudi Arabia', '2025-05-31 12:04:46'),
(329, 1, 'Saudi Arabia', '2025-05-31 12:04:46'),
(330, 1, 'Saudi Arabia', '2025-05-31 12:04:46'),
(331, 1, 'Saudi Arabia', '2025-05-31 12:04:46'),
(332, 1, 'Saudi Arabia', '2025-05-31 12:04:46'),
(333, 1, 'Saudi Arabia', '2025-05-31 12:04:47'),
(334, 1, 'Saudi Arabia', '2025-05-31 12:04:47'),
(335, 1, 'Saudi Arabia', '2025-05-31 12:04:47'),
(336, 1, 'Saudi Arabia', '2025-05-31 12:04:47'),
(337, 1, 'Saudi Arabia', '2025-05-31 12:04:47'),
(338, 1, 'Saudi Arabia', '2025-05-31 12:04:47'),
(339, 1, 'Saudi Arabia', '2025-05-31 12:04:48'),
(340, 1, 'Saudi Arabia', '2025-05-31 12:04:48'),
(341, 1, 'Saudi Arabia', '2025-05-31 12:04:48'),
(342, 1, 'Saudi Arabia', '2025-05-31 12:04:48'),
(343, 1, 'Saudi Arabia', '2025-05-31 12:04:48'),
(344, 1, 'Saudi Arabia', '2025-05-31 12:04:48'),
(345, 1, 'Saudi Arabia', '2025-05-31 12:04:49'),
(346, 1, 'Saudi Arabia', '2025-05-31 12:04:49'),
(347, 1, 'Saudi Arabia', '2025-05-31 12:04:49'),
(348, 1, 'Saudi Arabia', '2025-05-31 12:04:49'),
(349, 1, 'Saudi Arabia', '2025-05-31 12:04:49'),
(350, 1, 'Saudi Arabia', '2025-05-31 12:04:49'),
(351, 1, 'Saudi Arabia', '2025-05-31 12:04:50'),
(352, 1, 'Saudi Arabia', '2025-05-31 12:04:50'),
(353, 1, 'Saudi Arabia', '2025-05-31 12:04:50'),
(354, 1, 'Saudi Arabia', '2025-05-31 12:04:50'),
(355, 2, 'Saudi Arabia', '2025-05-31 12:04:52'),
(356, 2, 'Saudi Arabia', '2025-05-31 12:04:53'),
(357, 2, 'Saudi Arabia', '2025-05-31 12:04:53'),
(358, 2, 'Saudi Arabia', '2025-05-31 12:04:54'),
(359, 2, 'Saudi Arabia', '2025-05-31 12:04:54'),
(360, 2, 'Saudi Arabia', '2025-05-31 12:04:56'),
(361, 2, 'Saudi Arabia', '2025-05-31 12:04:56'),
(362, 2, 'Saudi Arabia', '2025-05-31 12:04:56'),
(363, 2, 'Saudi Arabia', '2025-05-31 12:04:56'),
(364, 2, 'Saudi Arabia', '2025-05-31 12:04:56'),
(365, 2, 'Saudi Arabia', '2025-05-31 12:04:56'),
(366, 2, 'Saudi Arabia', '2025-05-31 12:04:57'),
(367, 2, 'Saudi Arabia', '2025-05-31 12:04:57'),
(368, 2, 'Saudi Arabia', '2025-05-31 12:04:57'),
(369, 2, 'Saudi Arabia', '2025-05-31 12:04:57'),
(370, 2, 'Saudi Arabia', '2025-05-31 12:04:57'),
(371, 2, 'Saudi Arabia', '2025-05-31 12:04:57'),
(372, 2, 'Saudi Arabia', '2025-05-31 12:04:57'),
(373, 2, 'Saudi Arabia', '2025-05-31 12:04:58'),
(374, 2, 'Saudi Arabia', '2025-05-31 12:04:58'),
(375, 2, 'Saudi Arabia', '2025-05-31 12:04:58'),
(376, 2, 'Saudi Arabia', '2025-05-31 12:04:58'),
(377, 2, 'Saudi Arabia', '2025-05-31 12:04:58'),
(378, 2, 'Saudi Arabia', '2025-05-31 12:04:58'),
(379, 2, 'Saudi Arabia', '2025-05-31 12:04:58'),
(380, 2, 'Saudi Arabia', '2025-05-31 12:04:59'),
(381, 2, 'Saudi Arabia', '2025-05-31 12:04:59'),
(382, 2, 'Saudi Arabia', '2025-05-31 12:04:59'),
(383, 2, 'Saudi Arabia', '2025-05-31 12:04:59'),
(384, 2, 'Saudi Arabia', '2025-05-31 12:04:59'),
(385, 2, 'Saudi Arabia', '2025-05-31 12:05:00'),
(386, 2, 'Saudi Arabia', '2025-05-31 12:05:00'),
(387, 2, 'Saudi Arabia', '2025-05-31 12:05:00'),
(388, 2, 'Saudi Arabia', '2025-05-31 12:05:00'),
(389, 2, 'Saudi Arabia', '2025-05-31 12:05:00'),
(390, 2, 'Saudi Arabia', '2025-05-31 12:05:01'),
(391, 2, 'Saudi Arabia', '2025-05-31 12:05:01'),
(392, 2, 'Saudi Arabia', '2025-05-31 12:05:01'),
(393, 2, 'Saudi Arabia', '2025-05-31 12:05:01'),
(394, 2, 'Saudi Arabia', '2025-05-31 12:05:01'),
(395, 2, 'Saudi Arabia', '2025-05-31 12:05:02'),
(396, 2, 'Saudi Arabia', '2025-05-31 12:05:02'),
(397, 2, 'Saudi Arabia', '2025-05-31 12:05:02'),
(398, 2, 'Saudi Arabia', '2025-05-31 12:05:02'),
(399, 2, 'Saudi Arabia', '2025-05-31 12:05:02'),
(400, 2, 'Saudi Arabia', '2025-05-31 12:05:03'),
(401, 2, 'Saudi Arabia', '2025-05-31 12:05:03'),
(402, 2, 'Saudi Arabia', '2025-05-31 12:05:03'),
(403, 2, 'Saudi Arabia', '2025-05-31 12:05:03'),
(404, 2, 'Saudi Arabia', '2025-05-31 12:05:03'),
(405, 2, 'Saudi Arabia', '2025-05-31 12:05:03'),
(406, 2, 'Saudi Arabia', '2025-05-31 12:05:04'),
(407, 2, 'Saudi Arabia', '2025-05-31 12:05:04'),
(408, 2, 'Saudi Arabia', '2025-05-31 12:05:04'),
(409, 2, 'Saudi Arabia', '2025-05-31 12:05:04'),
(410, 2, 'Saudi Arabia', '2025-05-31 12:05:04'),
(411, 2, 'Saudi Arabia', '2025-05-31 12:05:04'),
(412, 2, 'Saudi Arabia', '2025-05-31 12:05:05'),
(413, 2, 'Saudi Arabia', '2025-05-31 12:05:05'),
(414, 2, 'Saudi Arabia', '2025-05-31 12:05:05'),
(415, 2, 'Saudi Arabia', '2025-05-31 12:05:05'),
(416, 2, 'Saudi Arabia', '2025-05-31 12:05:05'),
(417, 2, 'Saudi Arabia', '2025-05-31 12:05:05'),
(418, 2, 'Saudi Arabia', '2025-05-31 12:05:06'),
(419, 2, 'Saudi Arabia', '2025-05-31 12:05:06'),
(420, 2, 'Saudi Arabia', '2025-05-31 12:05:06'),
(421, 2, 'Saudi Arabia', '2025-05-31 12:05:06'),
(422, 2, 'Saudi Arabia', '2025-05-31 12:05:06'),
(423, 2, 'Saudi Arabia', '2025-05-31 12:05:06'),
(424, 2, 'Saudi Arabia', '2025-05-31 12:05:06'),
(425, 2, 'Saudi Arabia', '2025-05-31 12:05:07'),
(426, 2, 'Saudi Arabia', '2025-05-31 12:05:07'),
(427, 2, 'Saudi Arabia', '2025-05-31 12:05:07'),
(428, 2, 'Saudi Arabia', '2025-05-31 12:05:07'),
(429, 2, 'Saudi Arabia', '2025-05-31 12:05:07'),
(430, 2, 'Saudi Arabia', '2025-05-31 12:05:07'),
(431, 2, 'Saudi Arabia', '2025-05-31 12:05:08'),
(432, 2, 'Saudi Arabia', '2025-05-31 12:05:08'),
(433, 2, 'Saudi Arabia', '2025-05-31 12:05:08'),
(434, 2, 'Saudi Arabia', '2025-05-31 12:05:08'),
(435, 2, 'Saudi Arabia', '2025-05-31 12:05:08'),
(436, 2, 'Saudi Arabia', '2025-05-31 12:05:08'),
(437, 2, 'Saudi Arabia', '2025-05-31 12:05:09'),
(438, 1, 'Saudi Arabia', '2025-05-31 12:05:10'),
(439, 1, 'Saudi Arabia', '2025-05-31 12:05:10'),
(440, 1, 'Saudi Arabia', '2025-05-31 12:05:11'),
(441, 1, 'Saudi Arabia', '2025-05-31 12:05:11'),
(442, 1, 'Saudi Arabia', '2025-05-31 12:05:11'),
(443, 1, 'Saudi Arabia', '2025-05-31 12:05:11'),
(444, 1, 'Saudi Arabia', '2025-05-31 12:05:11'),
(445, 1, 'Saudi Arabia', '2025-05-31 12:05:11'),
(446, 1, 'Saudi Arabia', '2025-05-31 12:05:12'),
(447, 1, 'Saudi Arabia', '2025-05-31 12:05:12'),
(448, 1, 'Saudi Arabia', '2025-05-31 12:05:12'),
(449, 1, 'Saudi Arabia', '2025-05-31 12:05:12'),
(450, 1, 'Saudi Arabia', '2025-05-31 12:05:12'),
(451, 1, 'Saudi Arabia', '2025-05-31 12:05:12'),
(452, 1, 'Saudi Arabia', '2025-05-31 12:05:13'),
(453, 1, 'Saudi Arabia', '2025-05-31 12:05:13'),
(454, 1, 'Saudi Arabia', '2025-05-31 12:05:13'),
(455, 1, 'Saudi Arabia', '2025-05-31 12:05:13'),
(456, 1, 'Saudi Arabia', '2025-05-31 12:05:13'),
(457, 1, 'Saudi Arabia', '2025-05-31 12:05:14'),
(458, 1, 'Saudi Arabia', '2025-05-31 12:05:14'),
(459, 1, 'Saudi Arabia', '2025-05-31 12:05:14'),
(460, 1, 'Saudi Arabia', '2025-05-31 12:05:14'),
(461, 1, 'Saudi Arabia', '2025-05-31 12:05:14'),
(462, 1, 'Saudi Arabia', '2025-05-31 12:05:14'),
(463, 1, 'Saudi Arabia', '2025-05-31 12:05:15'),
(464, 1, 'Saudi Arabia', '2025-05-31 12:05:15'),
(465, 1, 'Saudi Arabia', '2025-05-31 12:05:15'),
(466, 1, 'Saudi Arabia', '2025-05-31 12:05:15'),
(467, 1, 'Saudi Arabia', '2025-05-31 12:05:18'),
(468, 1, 'Saudi Arabia', '2025-05-31 12:05:18'),
(469, 1, 'Saudi Arabia', '2025-05-31 12:05:18'),
(470, 1, 'Saudi Arabia', '2025-05-31 12:05:18'),
(471, 1, 'Saudi Arabia', '2025-05-31 12:05:18'),
(472, 1, 'Saudi Arabia', '2025-05-31 12:05:18'),
(473, 1, 'Saudi Arabia', '2025-05-31 12:05:18'),
(474, 1, 'Saudi Arabia', '2025-05-31 12:05:19'),
(475, 1, 'Saudi Arabia', '2025-05-31 12:05:19'),
(476, 1, 'Saudi Arabia', '2025-05-31 12:05:19'),
(477, 1, 'Saudi Arabia', '2025-05-31 12:05:19'),
(478, 1, 'Saudi Arabia', '2025-05-31 12:05:19'),
(479, 1, 'Saudi Arabia', '2025-05-31 12:05:20'),
(480, 1, 'Saudi Arabia', '2025-05-31 12:05:20'),
(481, 1, 'Saudi Arabia', '2025-05-31 12:05:20'),
(482, 1, 'Saudi Arabia', '2025-05-31 12:05:20'),
(483, 1, 'Saudi Arabia', '2025-05-31 12:05:21'),
(484, 1, 'Saudi Arabia', '2025-05-31 12:05:21'),
(485, 1, 'Saudi Arabia', '2025-05-31 12:05:21'),
(486, 1, 'Saudi Arabia', '2025-05-31 12:05:21'),
(487, 1, 'Saudi Arabia', '2025-05-31 12:05:21'),
(488, 1, 'Saudi Arabia', '2025-05-31 12:05:22'),
(489, 1, 'Saudi Arabia', '2025-05-31 12:05:22'),
(490, 1, 'Saudi Arabia', '2025-05-31 12:05:22'),
(491, 1, 'Saudi Arabia', '2025-05-31 12:05:22'),
(492, 1, 'Saudi Arabia', '2025-05-31 12:05:22'),
(493, 1, 'Saudi Arabia', '2025-05-31 12:05:22'),
(494, 1, 'Saudi Arabia', '2025-05-31 12:05:23'),
(495, 1, 'Saudi Arabia', '2025-05-31 12:05:23'),
(496, 1, 'Saudi Arabia', '2025-05-31 12:05:23'),
(497, 1, 'Saudi Arabia', '2025-05-31 12:05:23'),
(498, 1, 'Saudi Arabia', '2025-05-31 12:05:23'),
(499, 1, 'Saudi Arabia', '2025-05-31 12:05:24'),
(500, 1, 'Saudi Arabia', '2025-05-31 12:05:24'),
(501, 1, 'Saudi Arabia', '2025-05-31 12:05:24'),
(502, 1, 'Saudi Arabia', '2025-05-31 12:05:24'),
(503, 1, 'Saudi Arabia', '2025-05-31 12:05:24'),
(504, 1, 'Saudi Arabia', '2025-05-31 12:05:25'),
(505, 1, 'Saudi Arabia', '2025-05-31 12:05:25'),
(506, 1, 'Saudi Arabia', '2025-05-31 12:05:25'),
(507, 1, 'Saudi Arabia', '2025-05-31 12:05:25'),
(508, 1, 'Saudi Arabia', '2025-05-31 12:05:25'),
(509, 1, 'Saudi Arabia', '2025-05-31 12:05:26'),
(510, 1, 'Saudi Arabia', '2025-05-31 12:05:26'),
(511, 1, 'Saudi Arabia', '2025-05-31 12:05:26'),
(512, 1, 'Saudi Arabia', '2025-05-31 12:05:26'),
(513, 1, 'Saudi Arabia', '2025-05-31 12:05:26'),
(514, 1, 'Saudi Arabia', '2025-05-31 12:05:27'),
(515, 1, 'Saudi Arabia', '2025-05-31 12:05:27'),
(516, 1, 'Saudi Arabia', '2025-05-31 12:05:27'),
(517, 1, 'Saudi Arabia', '2025-05-31 12:05:27'),
(518, 1, 'Saudi Arabia', '2025-05-31 12:05:27'),
(519, 1, 'Saudi Arabia', '2025-05-31 12:05:28'),
(520, 1, 'Saudi Arabia', '2025-05-31 12:05:28'),
(521, 1, 'Saudi Arabia', '2025-05-31 12:05:28'),
(522, 1, 'Saudi Arabia', '2025-05-31 12:05:28'),
(523, 1, 'Saudi Arabia', '2025-05-31 12:05:28'),
(524, 1, 'Saudi Arabia', '2025-05-31 12:05:29'),
(525, 1, 'Saudi Arabia', '2025-05-31 12:05:30'),
(526, 1, 'Saudi Arabia', '2025-05-31 12:05:30'),
(527, 1, 'Saudi Arabia', '2025-05-31 12:05:30'),
(528, 1, 'Saudi Arabia', '2025-05-31 12:05:30'),
(529, 1, 'Saudi Arabia', '2025-05-31 12:05:30'),
(530, 1, 'Saudi Arabia', '2025-05-31 12:05:30'),
(531, 2, 'Saudi Arabia', '2025-05-31 12:05:31'),
(532, 2, 'Saudi Arabia', '2025-05-31 12:05:31'),
(533, 2, 'Saudi Arabia', '2025-05-31 12:05:31'),
(534, 2, 'Saudi Arabia', '2025-05-31 12:05:32'),
(535, 2, 'Saudi Arabia', '2025-05-31 12:05:32'),
(536, 1, 'Saudi Arabia', '2025-05-31 12:05:32'),
(537, 2, 'Saudi Arabia', '2025-05-31 12:05:32'),
(538, 1, 'Saudi Arabia', '2025-05-31 12:05:32'),
(539, 2, 'Saudi Arabia', '2025-05-31 12:05:33'),
(540, 2, 'Saudi Arabia', '2025-05-31 12:05:33'),
(541, 1, 'Saudi Arabia', '2025-05-31 12:05:34'),
(542, 2, 'Saudi Arabia', '2025-05-31 12:05:34'),
(543, 2, 'Saudi Arabia', '2025-05-31 12:05:34'),
(544, 2, 'Saudi Arabia', '2025-05-31 12:05:34'),
(545, 2, 'Saudi Arabia', '2025-05-31 12:05:34'),
(546, 2, 'Saudi Arabia', '2025-05-31 12:05:34'),
(547, 2, 'Saudi Arabia', '2025-05-31 12:05:35'),
(548, 2, 'Saudi Arabia', '2025-05-31 12:05:35'),
(549, 2, 'Saudi Arabia', '2025-05-31 12:05:35'),
(550, 2, 'Saudi Arabia', '2025-05-31 12:05:35'),
(551, 2, 'Saudi Arabia', '2025-05-31 12:05:35'),
(552, 2, 'Saudi Arabia', '2025-05-31 12:05:35'),
(553, 2, 'Saudi Arabia', '2025-05-31 12:05:36'),
(554, 2, 'Saudi Arabia', '2025-05-31 12:05:36'),
(555, 2, 'Saudi Arabia', '2025-05-31 12:05:36'),
(556, 2, 'Saudi Arabia', '2025-05-31 12:05:36'),
(557, 2, 'Saudi Arabia', '2025-05-31 12:05:36'),
(558, 2, 'Saudi Arabia', '2025-05-31 12:05:36'),
(559, 2, 'Saudi Arabia', '2025-05-31 12:05:37'),
(560, 2, 'Saudi Arabia', '2025-05-31 12:05:37'),
(561, 2, 'Saudi Arabia', '2025-05-31 12:05:37'),
(562, 2, 'Saudi Arabia', '2025-05-31 12:05:37'),
(563, 2, 'Saudi Arabia', '2025-05-31 12:05:37'),
(564, 2, 'Saudi Arabia', '2025-05-31 12:05:38'),
(565, 2, 'Saudi Arabia', '2025-05-31 12:05:38'),
(566, 2, 'Saudi Arabia', '2025-05-31 12:05:38'),
(567, 2, 'Saudi Arabia', '2025-05-31 12:05:39'),
(568, 2, 'Saudi Arabia', '2025-05-31 12:05:41'),
(569, 2, 'Saudi Arabia', '2025-05-31 12:05:41'),
(570, 2, 'Saudi Arabia', '2025-05-31 12:05:42'),
(571, 2, 'Saudi Arabia', '2025-05-31 12:05:42'),
(572, 2, 'Saudi Arabia', '2025-05-31 12:05:42'),
(573, 1, 'Saudi Arabia', '2025-05-31 12:05:42'),
(574, 1, 'Saudi Arabia', '2025-05-31 12:05:42'),
(575, 1, 'Saudi Arabia', '2025-05-31 12:05:43'),
(576, 1, 'Saudi Arabia', '2025-05-31 12:05:43'),
(577, 1, 'Saudi Arabia', '2025-05-31 12:05:43'),
(578, 1, 'Saudi Arabia', '2025-05-31 12:05:43'),
(579, 1, 'Saudi Arabia', '2025-05-31 12:05:43'),
(580, 1, 'Saudi Arabia', '2025-05-31 12:05:44'),
(581, 1, 'Saudi Arabia', '2025-05-31 12:05:44'),
(582, 1, 'Saudi Arabia', '2025-05-31 12:05:44'),
(583, 1, 'Saudi Arabia', '2025-05-31 12:05:44'),
(584, 1, 'Saudi Arabia', '2025-05-31 12:05:44'),
(585, 1, 'Saudi Arabia', '2025-05-31 12:05:44'),
(586, 1, 'Saudi Arabia', '2025-05-31 12:05:44'),
(587, 1, 'Saudi Arabia', '2025-05-31 12:05:45'),
(588, 1, 'Saudi Arabia', '2025-05-31 12:05:45'),
(589, 1, 'Saudi Arabia', '2025-05-31 12:05:45'),
(590, 1, 'Saudi Arabia', '2025-05-31 12:05:45'),
(591, 1, 'Saudi Arabia', '2025-05-31 12:05:45'),
(592, 1, 'Saudi Arabia', '2025-05-31 12:05:46'),
(593, 1, 'Saudi Arabia', '2025-05-31 12:05:46'),
(594, 1, 'Saudi Arabia', '2025-05-31 12:05:46'),
(595, 1, 'Saudi Arabia', '2025-05-31 12:05:46'),
(596, 1, 'Saudi Arabia', '2025-05-31 12:05:46'),
(597, 1, 'Saudi Arabia', '2025-05-31 12:05:46'),
(598, 1, 'Saudi Arabia', '2025-05-31 12:05:47'),
(599, 1, 'Saudi Arabia', '2025-05-31 12:05:47'),
(600, 1, 'Saudi Arabia', '2025-05-31 12:05:47'),
(601, 1, 'Saudi Arabia', '2025-05-31 12:05:47'),
(602, 1, 'Saudi Arabia', '2025-05-31 12:05:48'),
(603, 1, 'Saudi Arabia', '2025-05-31 12:31:26'),
(604, 1, 'Saudi Arabia', '2025-05-31 12:31:26'),
(605, 1, 'Saudi Arabia', '2025-05-31 12:31:27'),
(606, 1, 'Saudi Arabia', '2025-05-31 12:31:27'),
(607, 1, 'Saudi Arabia', '2025-05-31 12:31:27'),
(608, 1, 'Saudi Arabia', '2025-05-31 12:31:27'),
(609, 1, 'Saudi Arabia', '2025-05-31 12:31:27'),
(610, 1, 'Saudi Arabia', '2025-05-31 12:31:27'),
(611, 2, 'Saudi Arabia', '2025-05-31 12:31:30'),
(612, 2, 'Saudi Arabia', '2025-05-31 12:31:30'),
(613, 2, 'Saudi Arabia', '2025-05-31 12:31:30'),
(614, 2, 'Saudi Arabia', '2025-05-31 12:31:30'),
(615, 2, 'Saudi Arabia', '2025-05-31 12:31:30'),
(616, 2, 'Saudi Arabia', '2025-05-31 12:31:30'),
(617, 2, 'Saudi Arabia', '2025-05-31 12:31:31'),
(618, 2, 'Saudi Arabia', '2025-05-31 12:31:31'),
(619, 2, 'Saudi Arabia', '2025-05-31 12:31:31'),
(620, 2, 'Saudi Arabia', '2025-05-31 12:31:31'),
(621, 2, 'Saudi Arabia', '2025-05-31 12:31:31'),
(622, 2, 'Saudi Arabia', '2025-05-31 12:31:31'),
(623, 2, 'Saudi Arabia', '2025-05-31 12:31:31'),
(624, 2, 'Saudi Arabia', '2025-05-31 12:31:32'),
(625, 2, 'Saudi Arabia', '2025-05-31 12:31:32'),
(626, 2, 'Saudi Arabia', '2025-05-31 12:31:32'),
(627, 2, 'Saudi Arabia', '2025-05-31 12:31:32'),
(628, 2, 'Saudi Arabia', '2025-05-31 12:31:32'),
(629, 2, 'Saudi Arabia', '2025-05-31 12:31:32'),
(630, 2, 'Saudi Arabia', '2025-05-31 12:31:32'),
(631, 2, 'Saudi Arabia', '2025-05-31 12:31:33'),
(632, 2, 'Saudi Arabia', '2025-05-31 12:31:33'),
(633, 2, 'Saudi Arabia', '2025-05-31 12:31:33'),
(634, 2, 'Saudi Arabia', '2025-05-31 12:31:33'),
(635, 2, 'Saudi Arabia', '2025-05-31 12:31:33'),
(636, 2, 'Saudi Arabia', '2025-05-31 12:31:33'),
(637, 1, 'Saudi Arabia', '2025-05-31 12:31:34'),
(638, 1, 'Saudi Arabia', '2025-05-31 12:31:34'),
(639, 1, 'Saudi Arabia', '2025-05-31 12:31:34'),
(640, 1, 'Saudi Arabia', '2025-05-31 12:31:34'),
(641, 1, 'Saudi Arabia', '2025-05-31 12:31:34'),
(642, 1, 'Saudi Arabia', '2025-05-31 12:31:35'),
(643, 1, 'Saudi Arabia', '2025-05-31 12:31:35'),
(644, 1, 'Saudi Arabia', '2025-05-31 12:31:35'),
(645, 1, 'Saudi Arabia', '2025-05-31 12:31:35'),
(646, 2, 'Saudi Arabia', '2025-05-31 12:31:35'),
(647, 2, 'Saudi Arabia', '2025-05-31 12:31:35'),
(648, 1, 'Saudi Arabia', '2025-05-31 12:31:36'),
(649, 1, 'Saudi Arabia', '2025-05-31 12:31:36'),
(650, 1, 'Saudi Arabia', '2025-05-31 12:31:36'),
(651, 2, 'Saudi Arabia', '2025-05-31 12:31:36'),
(652, 2, 'Saudi Arabia', '2025-05-31 12:31:36'),
(653, 1, 'Saudi Arabia', '2025-05-31 12:31:37'),
(654, 1, 'Saudi Arabia', '2025-05-31 12:31:37'),
(655, 1, 'Saudi Arabia', '2025-05-31 12:31:37'),
(656, 1, 'Saudi Arabia', '2025-05-31 12:31:37'),
(657, 1, 'Saudi Arabia', '2025-05-31 12:31:37'),
(658, 1, 'Saudi Arabia', '2025-05-31 12:31:37'),
(659, 1, 'Saudi Arabia', '2025-05-31 12:31:38'),
(660, 1, 'Saudi Arabia', '2025-05-31 12:31:38'),
(661, 1, 'Saudi Arabia', '2025-05-31 12:31:38'),
(662, 1, 'Saudi Arabia', '2025-05-31 12:31:38'),
(663, 1, 'Saudi Arabia', '2025-05-31 12:31:38'),
(664, 1, 'Saudi Arabia', '2025-05-31 12:31:38'),
(665, 1, 'Saudi Arabia', '2025-05-31 12:31:39'),
(666, 1, 'Saudi Arabia', '2025-05-31 12:31:39'),
(667, 1, 'Saudi Arabia', '2025-05-31 12:31:39'),
(668, 1, 'Saudi Arabia', '2025-05-31 12:31:39'),
(669, 1, 'Saudi Arabia', '2025-05-31 12:31:39'),
(670, 1, 'Saudi Arabia', '2025-05-31 12:31:39'),
(671, 1, 'Saudi Arabia', '2025-05-31 12:31:40'),
(672, 1, 'Saudi Arabia', '2025-05-31 12:31:40'),
(673, 1, 'Saudi Arabia', '2025-05-31 12:31:41'),
(674, 1, 'Saudi Arabia', '2025-05-31 12:31:41'),
(675, 2, 'Saudi Arabia', '2025-05-31 12:31:42'),
(676, 2, 'Saudi Arabia', '2025-05-31 12:31:42'),
(677, 2, 'Saudi Arabia', '2025-05-31 12:31:42'),
(678, 2, 'Saudi Arabia', '2025-05-31 12:31:42'),
(679, 2, 'Saudi Arabia', '2025-05-31 12:31:43'),
(680, 2, 'Saudi Arabia', '2025-05-31 12:31:43'),
(681, 2, 'Saudi Arabia', '2025-05-31 12:31:43'),
(682, 2, 'Saudi Arabia', '2025-05-31 12:31:43'),
(683, 2, 'Saudi Arabia', '2025-05-31 12:31:44'),
(684, 2, 'Saudi Arabia', '2025-05-31 12:31:44'),
(685, 2, 'Saudi Arabia', '2025-05-31 12:31:44'),
(686, 2, 'Saudi Arabia', '2025-05-31 12:31:44'),
(687, 2, 'Saudi Arabia', '2025-05-31 12:31:44'),
(688, 2, 'Saudi Arabia', '2025-05-31 12:31:45'),
(689, 2, 'Saudi Arabia', '2025-05-31 12:31:45'),
(690, 2, 'Saudi Arabia', '2025-05-31 12:31:45'),
(691, 2, 'Saudi Arabia', '2025-05-31 12:31:45'),
(692, 2, 'Saudi Arabia', '2025-05-31 12:31:46'),
(693, 2, 'Saudi Arabia', '2025-05-31 12:31:46'),
(694, 2, 'Saudi Arabia', '2025-05-31 12:31:46'),
(695, 2, 'Saudi Arabia', '2025-05-31 12:31:46'),
(696, 2, 'Saudi Arabia', '2025-05-31 12:31:47'),
(697, 2, 'Saudi Arabia', '2025-05-31 12:31:47'),
(698, 2, 'Saudi Arabia', '2025-05-31 12:31:47'),
(699, 2, 'Saudi Arabia', '2025-05-31 12:31:47'),
(700, 2, 'Saudi Arabia', '2025-05-31 12:31:48'),
(701, 2, 'Saudi Arabia', '2025-05-31 12:31:48'),
(702, 2, 'Saudi Arabia', '2025-05-31 12:31:48'),
(703, 2, 'Saudi Arabia', '2025-05-31 12:31:48'),
(704, 2, 'Saudi Arabia', '2025-05-31 12:31:48'),
(705, 2, 'Saudi Arabia', '2025-05-31 12:31:48'),
(706, 2, 'Saudi Arabia', '2025-05-31 12:31:49'),
(707, 2, 'Saudi Arabia', '2025-05-31 12:31:49'),
(708, 2, 'Saudi Arabia', '2025-05-31 12:31:49'),
(709, 2, 'Saudi Arabia', '2025-05-31 12:31:49'),
(710, 2, 'Saudi Arabia', '2025-05-31 12:31:50'),
(711, 2, 'Saudi Arabia', '2025-05-31 12:31:50'),
(712, 2, 'Saudi Arabia', '2025-05-31 12:31:50'),
(713, 2, 'Saudi Arabia', '2025-05-31 12:31:50'),
(714, 2, 'Saudi Arabia', '2025-05-31 12:31:50'),
(715, 2, 'Saudi Arabia', '2025-05-31 12:31:50'),
(716, 2, 'Saudi Arabia', '2025-05-31 12:31:51'),
(717, 2, 'Saudi Arabia', '2025-05-31 12:31:51'),
(718, 2, 'Saudi Arabia', '2025-05-31 12:31:51'),
(719, 2, 'Saudi Arabia', '2025-05-31 12:31:51'),
(720, 2, 'Saudi Arabia', '2025-05-31 12:31:52'),
(721, 2, 'Saudi Arabia', '2025-05-31 12:31:52'),
(722, 2, 'Saudi Arabia', '2025-05-31 12:31:52'),
(723, 2, 'Saudi Arabia', '2025-05-31 12:31:53'),
(724, 2, 'Saudi Arabia', '2025-05-31 12:31:53'),
(725, 2, 'Saudi Arabia', '2025-05-31 12:31:53'),
(726, 2, 'Saudi Arabia', '2025-05-31 12:31:54'),
(727, 2, 'Saudi Arabia', '2025-05-31 12:31:54'),
(728, 2, 'Saudi Arabia', '2025-05-31 12:31:54'),
(729, 1, 'Saudi Arabia', '2025-05-31 12:31:55'),
(730, 1, 'Saudi Arabia', '2025-05-31 12:31:55'),
(731, 1, 'Saudi Arabia', '2025-05-31 12:31:55'),
(732, 1, 'Saudi Arabia', '2025-05-31 12:31:56'),
(733, 1, 'Saudi Arabia', '2025-05-31 12:31:56'),
(734, 1, 'Saudi Arabia', '2025-05-31 12:31:56'),
(735, 1, 'Saudi Arabia', '2025-05-31 12:31:56'),
(736, 1, 'Saudi Arabia', '2025-05-31 12:31:57'),
(737, 1, 'Saudi Arabia', '2025-05-31 12:31:57'),
(738, 1, 'Saudi Arabia', '2025-05-31 12:31:57'),
(739, 1, 'Saudi Arabia', '2025-05-31 12:31:58'),
(740, 1, 'Saudi Arabia', '2025-05-31 12:31:58'),
(741, 1, 'Saudi Arabia', '2025-05-31 12:31:58'),
(742, 1, 'Saudi Arabia', '2025-05-31 12:31:58'),
(743, 1, 'Saudi Arabia', '2025-05-31 12:31:58'),
(744, 1, 'Saudi Arabia', '2025-05-31 12:31:59'),
(745, 1, 'Saudi Arabia', '2025-05-31 12:31:59'),
(746, 1, 'Saudi Arabia', '2025-05-31 12:31:59'),
(747, 1, 'Saudi Arabia', '2025-05-31 12:31:59'),
(748, 1, 'Saudi Arabia', '2025-05-31 12:31:59'),
(749, 1, 'Saudi Arabia', '2025-05-31 12:31:59'),
(750, 1, 'Saudi Arabia', '2025-05-31 12:32:00'),
(751, 1, 'Saudi Arabia', '2025-05-31 12:32:00'),
(752, 1, 'Saudi Arabia', '2025-05-31 12:32:00'),
(753, 1, 'Saudi Arabia', '2025-05-31 12:32:00'),
(754, 1, 'Saudi Arabia', '2025-05-31 12:32:00'),
(755, 1, 'Saudi Arabia', '2025-05-31 12:32:01'),
(756, 1, 'Saudi Arabia', '2025-05-31 12:32:01'),
(757, 1, 'Saudi Arabia', '2025-05-31 12:32:01'),
(758, 1, 'Saudi Arabia', '2025-05-31 12:32:01'),
(759, 1, 'Saudi Arabia', '2025-05-31 12:32:01'),
(760, 1, 'Saudi Arabia', '2025-05-31 12:32:01'),
(761, 1, 'Saudi Arabia', '2025-05-31 12:32:02'),
(762, 1, 'Saudi Arabia', '2025-05-31 12:32:02'),
(763, 1, 'Saudi Arabia', '2025-05-31 12:32:02'),
(764, 1, 'Saudi Arabia', '2025-05-31 12:32:02'),
(765, 1, 'Saudi Arabia', '2025-05-31 12:32:02'),
(766, 1, 'Saudi Arabia', '2025-05-31 12:32:02'),
(767, 2, 'Saudi Arabia', '2025-05-31 12:32:03'),
(768, 2, 'Saudi Arabia', '2025-05-31 12:32:03'),
(769, 2, 'Saudi Arabia', '2025-05-31 12:32:03'),
(770, 2, 'Saudi Arabia', '2025-05-31 12:32:04'),
(771, 2, 'Saudi Arabia', '2025-05-31 12:33:13'),
(772, 2, 'Saudi Arabia', '2025-05-31 12:33:13'),
(773, 2, 'Saudi Arabia', '2025-05-31 12:33:13'),
(774, 2, 'Saudi Arabia', '2025-05-31 12:33:13'),
(775, 2, 'Saudi Arabia', '2025-05-31 12:33:13'),
(776, 1, 'Saudi Arabia', '2025-05-31 12:33:14'),
(777, 1, 'Saudi Arabia', '2025-05-31 12:33:14'),
(778, 1, 'Saudi Arabia', '2025-05-31 12:33:14'),
(779, 1, 'Saudi Arabia', '2025-05-31 12:33:14'),
(780, 2, 'Saudi Arabia', '2025-05-31 12:33:15'),
(781, 2, 'Saudi Arabia', '2025-05-31 12:33:15'),
(782, 2, 'Saudi Arabia', '2025-05-31 12:33:15'),
(783, 2, 'Saudi Arabia', '2025-05-31 12:33:15'),
(784, 2, 'Saudi Arabia', '2025-05-31 12:33:15'),
(785, 2, 'Saudi Arabia', '2025-05-31 12:33:15'),
(786, 2, 'Saudi Arabia', '2025-05-31 12:33:16'),
(787, 2, 'Saudi Arabia', '2025-05-31 12:33:16'),
(788, 2, 'Saudi Arabia', '2025-05-31 12:33:16'),
(789, 2, 'Saudi Arabia', '2025-05-31 12:33:16'),
(790, 2, 'Saudi Arabia', '2025-05-31 12:33:16'),
(791, 1, 'Saudi Arabia', '2025-05-31 12:33:17'),
(792, 1, 'Saudi Arabia', '2025-05-31 12:33:17'),
(793, 1, 'Saudi Arabia', '2025-05-31 12:33:17'),
(794, 2, 'Saudi Arabia', '2025-05-31 12:33:18'),
(795, 1, 'Saudi Arabia', '2025-05-31 12:33:18'),
(796, 2, 'Saudi Arabia', '2025-05-31 12:33:18'),
(797, 2, 'Saudi Arabia', '2025-05-31 12:33:18'),
(798, 1, 'Saudi Arabia', '2025-05-31 12:33:19'),
(799, 1, 'Saudi Arabia', '2025-05-31 12:33:19'),
(800, 2, 'Saudi Arabia', '2025-05-31 12:33:19'),
(801, 1, 'Saudi Arabia', '2025-05-31 12:33:19'),
(802, 2, 'Saudi Arabia', '2025-05-31 12:33:20'),
(803, 1, 'Saudi Arabia', '2025-05-31 12:33:20'),
(804, 1, 'Saudi Arabia', '2025-05-31 12:33:20'),
(805, 2, 'Saudi Arabia', '2025-05-31 12:33:20'),
(806, 2, 'Saudi Arabia', '2025-05-31 12:33:20'),
(807, 2, 'Saudi Arabia', '2025-05-31 12:33:20'),
(808, 2, 'Saudi Arabia', '2025-05-31 12:33:21'),
(809, 1, 'Saudi Arabia', '2025-05-31 12:33:21'),
(810, 1, 'Saudi Arabia', '2025-05-31 12:33:21'),
(811, 1, 'Saudi Arabia', '2025-05-31 12:33:21'),
(812, 1, 'Saudi Arabia', '2025-05-31 12:33:21'),
(813, 1, 'Saudi Arabia', '2025-05-31 12:34:30'),
(814, 1, 'Saudi Arabia', '2025-05-31 12:34:30'),
(815, 1, 'Saudi Arabia', '2025-05-31 12:34:30'),
(816, 2, 'Saudi Arabia', '2025-05-31 12:34:30'),
(817, 2, 'Saudi Arabia', '2025-05-31 12:34:30'),
(818, 1, 'Saudi Arabia', '2025-05-31 12:34:31'),
(819, 1, 'Saudi Arabia', '2025-05-31 12:34:31'),
(820, 1, 'Saudi Arabia', '2025-05-31 12:34:31'),
(821, 1, 'Saudi Arabia', '2025-05-31 12:34:31'),
(822, 1, 'Saudi Arabia', '2025-05-31 12:34:31'),
(823, 1, 'Saudi Arabia', '2025-05-31 12:34:31'),
(824, 1, 'Saudi Arabia', '2025-05-31 12:34:32'),
(825, 2, 'Saudi Arabia', '2025-05-31 12:34:32'),
(826, 2, 'Saudi Arabia', '2025-05-31 12:34:32'),
(827, 2, 'Saudi Arabia', '2025-05-31 12:34:32'),
(828, 2, 'Saudi Arabia', '2025-05-31 12:34:32'),
(829, 2, 'Saudi Arabia', '2025-05-31 12:34:32'),
(830, 1, 'Saudi Arabia', '2025-05-31 12:34:33'),
(831, 1, 'Saudi Arabia', '2025-05-31 12:34:33'),
(832, 1, 'Saudi Arabia', '2025-05-31 12:34:33'),
(833, 2, 'Saudi Arabia', '2025-05-31 12:34:33'),
(834, 1, 'Saudi Arabia', '2025-05-31 12:34:33'),
(835, 2, 'Saudi Arabia', '2025-05-31 12:34:34'),
(836, 2, 'Saudi Arabia', '2025-05-31 12:34:34'),
(837, 1, 'Saudi Arabia', '2025-05-31 12:34:34'),
(838, 2, 'Saudi Arabia', '2025-05-31 12:34:34'),
(839, 2, 'Saudi Arabia', '2025-05-31 12:34:35'),
(840, 1, 'Saudi Arabia', '2025-05-31 12:34:35'),
(841, 1, 'Saudi Arabia', '2025-05-31 12:34:35'),
(842, 2, 'Saudi Arabia', '2025-05-31 12:34:35'),
(843, 2, 'Saudi Arabia', '2025-05-31 12:34:35'),
(844, 1, 'Saudi Arabia', '2025-05-31 12:34:35'),
(845, 1, 'Saudi Arabia', '2025-05-31 12:34:36'),
(846, 1, 'Saudi Arabia', '2025-05-31 12:34:36'),
(847, 2, 'Saudi Arabia', '2025-05-31 12:34:36'),
(848, 2, 'Saudi Arabia', '2025-05-31 12:34:36'),
(849, 1, 'Saudi Arabia', '2025-05-31 12:34:37'),
(850, 1, 'Saudi Arabia', '2025-05-31 12:34:37'),
(851, 2, 'Saudi Arabia', '2025-05-31 12:34:37'),
(852, 2, 'Saudi Arabia', '2025-05-31 12:34:37'),
(853, 1, 'Saudi Arabia', '2025-05-31 12:34:37'),
(854, 1, 'Saudi Arabia', '2025-05-31 12:34:38'),
(855, 2, 'Saudi Arabia', '2025-05-31 12:34:38'),
(856, 2, 'Saudi Arabia', '2025-05-31 12:34:38'),
(857, 1, 'Saudi Arabia', '2025-05-31 12:34:38'),
(858, 2, 'Saudi Arabia', '2025-05-31 12:34:39'),
(859, 1, 'Saudi Arabia', '2025-05-31 12:34:39'),
(860, 1, 'Saudi Arabia', '2025-05-31 12:34:39'),
(861, 2, 'Saudi Arabia', '2025-05-31 12:34:42'),
(862, 1, 'Saudi Arabia', '2025-05-31 12:34:42'),
(863, 1, 'Saudi Arabia', '2025-05-31 12:34:42'),
(864, 2, 'Saudi Arabia', '2025-05-31 12:34:43'),
(865, 1, 'Saudi Arabia', '2025-05-31 12:34:43'),
(866, 2, 'Saudi Arabia', '2025-05-31 12:34:43'),
(867, 2, 'Saudi Arabia', '2025-05-31 12:34:44'),
(868, 2, 'Saudi Arabia', '2025-05-31 12:34:44'),
(869, 2, 'Saudi Arabia', '2025-05-31 12:34:44'),
(870, 2, 'Saudi Arabia', '2025-05-31 12:34:44'),
(871, 2, 'Saudi Arabia', '2025-05-31 12:34:44'),
(872, 2, 'Saudi Arabia', '2025-05-31 12:34:44'),
(873, 2, 'Saudi Arabia', '2025-05-31 12:34:45'),
(874, 2, 'Saudi Arabia', '2025-05-31 12:34:45'),
(875, 2, 'Saudi Arabia', '2025-05-31 12:34:45'),
(876, 2, 'Saudi Arabia', '2025-05-31 12:34:45'),
(877, 2, 'Saudi Arabia', '2025-05-31 12:34:45'),
(878, 2, 'Saudi Arabia', '2025-05-31 12:34:45'),
(879, 2, 'Saudi Arabia', '2025-05-31 12:34:46'),
(880, 2, 'Saudi Arabia', '2025-05-31 12:34:46'),
(881, 2, 'Saudi Arabia', '2025-05-31 12:34:46'),
(882, 2, 'Saudi Arabia', '2025-05-31 12:34:46'),
(883, 2, 'Saudi Arabia', '2025-05-31 12:34:46'),
(884, 2, 'Saudi Arabia', '2025-05-31 12:34:46'),
(885, 2, 'Saudi Arabia', '2025-05-31 12:34:46'),
(886, 2, 'Saudi Arabia', '2025-05-31 12:34:46'),
(887, 2, 'Saudi Arabia', '2025-05-31 12:34:46'),
(888, 2, 'Saudi Arabia', '2025-05-31 12:34:46'),
(889, 2, 'Saudi Arabia', '2025-05-31 12:34:47'),
(890, 2, 'Saudi Arabia', '2025-05-31 12:34:47'),
(891, 2, 'Saudi Arabia', '2025-05-31 12:34:47'),
(892, 2, 'Saudi Arabia', '2025-05-31 12:34:47'),
(893, 2, 'Saudi Arabia', '2025-05-31 12:34:47'),
(894, 2, 'Saudi Arabia', '2025-05-31 12:34:47'),
(895, 2, 'Saudi Arabia', '2025-05-31 12:34:47'),
(896, 1, 'Saudi Arabia', '2025-05-31 12:34:47'),
(897, 1, 'Saudi Arabia', '2025-05-31 12:34:48'),
(898, 1, 'Saudi Arabia', '2025-05-31 12:34:48'),
(899, 1, 'Saudi Arabia', '2025-05-31 12:34:48'),
(900, 2, 'Saudi Arabia', '2025-05-31 12:34:48'),
(901, 1, 'Saudi Arabia', '2025-05-31 12:34:49'),
(902, 2, 'Saudi Arabia', '2025-05-31 12:34:49'),
(903, 2, 'Saudi Arabia', '2025-05-31 12:34:49'),
(904, 1, 'Saudi Arabia', '2025-05-31 12:34:49'),
(905, 1, 'Saudi Arabia', '2025-05-31 12:34:49'),
(906, 2, 'Saudi Arabia', '2025-05-31 12:34:50'),
(907, 2, 'Saudi Arabia', '2025-05-31 12:43:16'),
(908, 2, 'Saudi Arabia', '2025-05-31 12:43:16'),
(909, 2, 'Saudi Arabia', '2025-05-31 12:43:17'),
(910, 2, 'Saudi Arabia', '2025-05-31 12:43:17'),
(911, 2, 'Saudi Arabia', '2025-05-31 12:43:17'),
(912, 2, 'Saudi Arabia', '2025-05-31 12:43:17'),
(913, 2, 'Saudi Arabia', '2025-05-31 12:43:17'),
(914, 2, 'Saudi Arabia', '2025-05-31 12:43:17'),
(915, 2, 'Saudi Arabia', '2025-05-31 12:43:17'),
(916, 2, 'Saudi Arabia', '2025-05-31 12:43:18'),
(917, 2, 'Saudi Arabia', '2025-05-31 12:43:19'),
(918, 2, 'Saudi Arabia', '2025-05-31 12:43:19'),
(919, 2, 'Saudi Arabia', '2025-05-31 12:43:19'),
(920, 2, 'Saudi Arabia', '2025-05-31 12:43:19'),
(921, 2, 'Saudi Arabia', '2025-05-31 12:43:20'),
(922, 2, 'Saudi Arabia', '2025-05-31 12:43:20'),
(923, 2, 'Saudi Arabia', '2025-05-31 12:43:20'),
(924, 1, 'Saudi Arabia', '2025-05-31 12:43:21'),
(925, 1, 'Saudi Arabia', '2025-05-31 12:43:21'),
(926, 1, 'Saudi Arabia', '2025-05-31 12:43:21'),
(927, 1, 'Saudi Arabia', '2025-05-31 12:43:21'),
(928, 1, 'Saudi Arabia', '2025-05-31 12:43:55'),
(929, 1, 'Saudi Arabia', '2025-05-31 12:43:58'),
(930, 1, 'Saudi Arabia', '2025-05-31 12:43:58'),
(931, 1, 'Saudi Arabia', '2025-05-31 12:43:58'),
(932, 1, 'Saudi Arabia', '2025-05-31 12:43:58'),
(933, 1, 'Saudi Arabia', '2025-05-31 12:43:58'),
(934, 1, 'Saudi Arabia', '2025-05-31 12:43:59'),
(935, 1, 'Saudi Arabia', '2025-05-31 12:43:59'),
(936, 1, 'Saudi Arabia', '2025-05-31 12:43:59'),
(937, 1, 'Saudi Arabia', '2025-05-31 12:43:59'),
(938, 1, 'Saudi Arabia', '2025-05-31 12:43:59'),
(939, 1, 'Saudi Arabia', '2025-05-31 12:44:00'),
(940, 2, 'Saudi Arabia', '2025-05-31 12:44:00'),
(941, 2, 'Saudi Arabia', '2025-05-31 12:44:00'),
(942, 2, 'Saudi Arabia', '2025-05-31 12:44:00'),
(943, 2, 'Saudi Arabia', '2025-05-31 12:44:01'),
(944, 2, 'Saudi Arabia', '2025-05-31 12:44:01'),
(945, 2, 'Saudi Arabia', '2025-05-31 12:44:01'),
(946, 2, 'Saudi Arabia', '2025-05-31 12:44:01'),
(947, 2, 'Saudi Arabia', '2025-05-31 12:44:01'),
(948, 2, 'Saudi Arabia', '2025-05-31 12:44:02'),
(949, 1, 'Saudi Arabia', '2025-05-31 12:44:09'),
(950, 1, 'Saudi Arabia', '2025-05-31 12:44:09'),
(951, 1, 'Saudi Arabia', '2025-05-31 12:44:09'),
(952, 1, 'Saudi Arabia', '2025-05-31 12:44:09'),
(953, 1, 'Saudi Arabia', '2025-05-31 12:44:10'),
(954, 1, 'Saudi Arabia', '2025-05-31 12:44:10'),
(955, 1, 'Saudi Arabia', '2025-05-31 12:44:10'),
(956, 2, 'Saudi Arabia', '2025-05-31 12:44:10'),
(957, 2, 'Saudi Arabia', '2025-05-31 12:44:11'),
(958, 2, 'Saudi Arabia', '2025-05-31 12:44:11');

-- --------------------------------------------------------

--
-- Table structure for table `click_tracking`
--

CREATE TABLE `click_tracking` (
  `id` int(11) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `image_id` int(11) NOT NULL,
  `country` varchar(100) DEFAULT NULL,
  `clicked_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `click_tracking`
--

INSERT INTO `click_tracking` (`id`, `ip_address`, `image_id`, `country`, `clicked_at`) VALUES
(3051, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:40'),
(3052, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:40'),
(3053, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:40'),
(3054, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:40'),
(3055, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:41'),
(3056, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:41'),
(3057, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:41'),
(3058, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:41'),
(3059, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:41'),
(3060, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:42'),
(3061, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:42'),
(3062, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:42'),
(3063, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:43'),
(3064, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:43'),
(3065, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:44'),
(3066, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:44'),
(3067, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:45'),
(3068, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:45'),
(3069, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:46'),
(3070, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:46'),
(3071, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:47'),
(3072, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:47'),
(3073, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:47'),
(3074, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:47'),
(3075, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:48'),
(3076, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:48'),
(3077, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:48'),
(3078, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:48'),
(3079, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:48'),
(3080, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:49'),
(3081, '::1', 2, 'Saudi Arabia', '2025-06-05 11:11:49'),
(3082, '::1', 1, 'Saudi Arabia', '2025-06-05 11:31:12'),
(3083, '::1', 1, 'Saudi Arabia', '2025-06-05 11:31:12'),
(3084, '::1', 1, 'Saudi Arabia', '2025-06-05 11:31:13'),
(3085, '::1', 1, 'Saudi Arabia', '2025-06-05 11:31:13'),
(3086, '::1', 1, 'Saudi Arabia', '2025-06-05 11:31:14'),
(3087, '::1', 1, 'Saudi Arabia', '2025-06-05 11:31:14'),
(3088, '::1', 1, 'Saudi Arabia', '2025-06-05 11:31:14'),
(3089, '::1', 1, 'Saudi Arabia', '2025-06-05 11:31:14'),
(3090, '::1', 1, 'Saudi Arabia', '2025-06-05 11:31:15'),
(3091, '::1', 1, 'Saudi Arabia', '2025-06-05 11:31:15'),
(3092, '::1', 1, 'Saudi Arabia', '2025-06-05 11:31:15'),
(3093, '::1', 1, 'Saudi Arabia', '2025-06-05 11:31:15'),
(3094, '::1', 1, 'Saudi Arabia', '2025-06-05 11:31:15'),
(3095, '::1', 1, 'Saudi Arabia', '2025-06-05 11:31:15'),
(3096, '::1', 2, 'Saudi Arabia', '2025-06-05 11:31:17'),
(3097, '::1', 2, 'Saudi Arabia', '2025-06-05 11:31:17'),
(3098, '::1', 2, 'Saudi Arabia', '2025-06-05 11:31:18'),
(3099, '::1', 2, 'Saudi Arabia', '2025-06-05 11:31:18'),
(3100, '::1', 2, 'Saudi Arabia', '2025-06-05 11:31:18'),
(3101, '::1', 2, 'Saudi Arabia', '2025-06-05 11:31:18'),
(3102, '::1', 2, 'Saudi Arabia', '2025-06-05 11:31:19'),
(3103, '::1', 2, 'Saudi Arabia', '2025-06-05 11:31:19'),
(3104, '::1', 1, 'Unknown', '2025-06-05 11:31:21'),
(3105, '::1', 2, 'Unknown', '2025-06-05 11:31:22'),
(3106, '::1', 1, 'Unknown', '2025-06-05 11:31:24'),
(3107, '::1', 2, 'Unknown', '2025-06-05 11:31:25'),
(3108, '::1', 2, 'Unknown', '2025-06-05 11:31:25'),
(3109, '::1', 2, 'Unknown', '2025-06-05 11:31:26'),
(3110, '::1', 2, 'Unknown', '2025-06-05 11:31:26'),
(3111, '::1', 2, 'Unknown', '2025-06-05 11:31:27'),
(3112, '::1', 2, 'Unknown', '2025-06-05 11:31:27'),
(3113, '::1', 2, 'Unknown', '2025-06-05 11:31:27'),
(3114, '::1', 1, 'Unknown', '2025-06-05 11:31:33'),
(3115, '::1', 2, 'Unknown', '2025-06-05 11:31:33'),
(3116, '::1', 1, 'Saudi Arabia', '2025-06-05 11:31:37'),
(3117, '::1', 2, 'Saudi Arabia', '2025-06-05 11:31:38'),
(3118, '::1', 2, 'Saudi Arabia', '2025-06-05 11:31:38'),
(3119, '::1', 2, 'Saudi Arabia', '2025-06-05 11:31:39'),
(3120, '::1', 2, 'Saudi Arabia', '2025-06-05 11:31:39'),
(3121, '::1', 2, 'Saudi Arabia', '2025-06-05 11:31:39'),
(3122, '::1', 2, 'Saudi Arabia', '2025-06-05 11:31:40'),
(3123, '::1', 2, 'Saudi Arabia', '2025-06-05 11:31:40'),
(3124, '::1', 2, 'Saudi Arabia', '2025-06-05 11:31:40'),
(3125, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:17'),
(3126, '::1', 2, 'Saudi Arabia', '2025-06-05 11:32:17'),
(3127, '::1', 2, 'Saudi Arabia', '2025-06-05 11:32:17'),
(3128, '::1', 2, 'Saudi Arabia', '2025-06-05 11:32:18'),
(3129, '::1', 2, 'Saudi Arabia', '2025-06-05 11:32:18'),
(3130, '::1', 2, 'Saudi Arabia', '2025-06-05 11:32:18'),
(3131, '::1', 2, 'Saudi Arabia', '2025-06-05 11:32:18'),
(3132, '::1', 2, 'Saudi Arabia', '2025-06-05 11:32:18'),
(3133, '::1', 2, 'Saudi Arabia', '2025-06-05 11:32:18'),
(3134, '::1', 2, 'Saudi Arabia', '2025-06-05 11:32:18'),
(3135, '::1', 2, 'Saudi Arabia', '2025-06-05 11:32:19'),
(3136, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:19'),
(3137, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:19'),
(3138, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:19'),
(3139, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:19'),
(3140, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:20'),
(3141, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:20'),
(3142, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:20'),
(3143, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:21'),
(3144, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:21'),
(3145, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:21'),
(3146, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:21'),
(3147, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:22'),
(3148, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:22'),
(3149, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:22'),
(3150, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:22'),
(3151, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:22'),
(3152, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:22'),
(3153, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:22'),
(3154, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:23'),
(3155, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:23'),
(3156, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:23'),
(3157, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:23'),
(3158, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:23'),
(3159, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:23'),
(3160, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:24'),
(3161, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:24'),
(3162, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:24'),
(3163, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:24'),
(3164, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:24'),
(3165, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:25'),
(3166, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:25'),
(3167, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:25'),
(3168, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:25'),
(3169, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:25'),
(3170, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:25'),
(3171, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:25'),
(3172, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:26'),
(3173, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:26'),
(3174, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:26'),
(3175, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:26'),
(3176, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:26'),
(3177, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:26'),
(3178, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:27'),
(3179, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:27'),
(3180, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:27'),
(3181, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:27'),
(3182, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:27'),
(3183, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:28'),
(3184, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:28'),
(3185, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:28'),
(3186, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:28'),
(3187, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:28'),
(3188, '::1', 1, 'Saudi Arabia', '2025-06-05 11:32:32'),
(3189, '::1', 2, 'Saudi Arabia', '2025-06-05 11:32:33'),
(3190, '::1', 1, 'Saudi Arabia', '2025-06-05 11:33:22'),
(3191, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:23'),
(3192, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:45'),
(3193, '::1', 1, 'Saudi Arabia', '2025-06-05 11:33:46'),
(3194, '::1', 1, 'Saudi Arabia', '2025-06-05 11:33:46'),
(3195, '::1', 1, 'Saudi Arabia', '2025-06-05 11:33:46'),
(3196, '::1', 1, 'Saudi Arabia', '2025-06-05 11:33:47'),
(3197, '::1', 1, 'Saudi Arabia', '2025-06-05 11:33:47'),
(3198, '::1', 1, 'Saudi Arabia', '2025-06-05 11:33:47'),
(3199, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:48'),
(3200, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:48'),
(3201, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:48'),
(3202, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:49'),
(3203, '::1', 1, 'Saudi Arabia', '2025-06-05 11:33:49'),
(3204, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:49'),
(3205, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:50'),
(3206, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:50'),
(3207, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:50'),
(3208, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:50'),
(3209, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:50'),
(3210, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:50'),
(3211, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:51'),
(3212, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:51'),
(3213, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:51'),
(3214, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:51'),
(3215, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:51'),
(3216, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:51'),
(3217, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:51'),
(3218, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:52'),
(3219, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:52'),
(3220, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:52'),
(3221, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:52'),
(3222, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:52'),
(3223, '::1', 2, 'Saudi Arabia', '2025-06-05 11:33:52'),
(3224, '::1', 1, 'Saudi Arabia', '2025-06-05 11:35:02'),
(3225, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:03'),
(3226, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:03'),
(3227, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:04'),
(3228, '::1', 1, 'Saudi Arabia', '2025-06-05 11:35:05'),
(3229, '::1', 1, 'Saudi Arabia', '2025-06-05 11:35:05'),
(3230, '::1', 1, 'Saudi Arabia', '2025-06-05 11:35:06'),
(3231, '::1', 1, 'Saudi Arabia', '2025-06-05 11:35:06'),
(3232, '::1', 1, 'Saudi Arabia', '2025-06-05 11:35:06'),
(3233, '::1', 1, 'Saudi Arabia', '2025-06-05 11:35:06'),
(3234, '::1', 1, 'Saudi Arabia', '2025-06-05 11:35:07'),
(3235, '::1', 1, 'Saudi Arabia', '2025-06-05 11:35:07'),
(3236, '::1', 1, 'Saudi Arabia', '2025-06-05 11:35:07'),
(3237, '::1', 1, 'Saudi Arabia', '2025-06-05 11:35:07'),
(3238, '::1', 1, 'Saudi Arabia', '2025-06-05 11:35:08'),
(3239, '::1', 1, 'Saudi Arabia', '2025-06-05 11:35:08'),
(3240, '::1', 1, 'Saudi Arabia', '2025-06-05 11:35:08'),
(3241, '::1', 1, 'Saudi Arabia', '2025-06-05 11:35:08'),
(3242, '::1', 1, 'Saudi Arabia', '2025-06-05 11:35:08'),
(3243, '::1', 1, 'Saudi Arabia', '2025-06-05 11:35:09'),
(3244, '::1', 1, 'Saudi Arabia', '2025-06-05 11:35:09'),
(3245, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:09'),
(3246, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:09'),
(3247, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:09'),
(3248, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:09'),
(3249, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:10'),
(3250, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:10'),
(3251, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:10'),
(3252, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:10'),
(3253, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:10'),
(3254, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:10'),
(3255, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:11'),
(3256, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:11'),
(3257, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:11'),
(3258, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:11'),
(3259, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:11'),
(3260, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:12'),
(3261, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:12'),
(3262, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:12'),
(3263, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:12'),
(3264, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:12'),
(3265, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:12'),
(3266, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:13'),
(3267, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:13'),
(3268, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:13'),
(3269, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:13'),
(3270, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:14'),
(3271, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:14'),
(3272, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:15'),
(3273, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:15'),
(3274, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:15'),
(3275, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:15'),
(3276, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:15'),
(3277, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:15'),
(3278, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:16'),
(3279, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:16'),
(3280, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:16'),
(3281, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:17'),
(3282, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:17'),
(3283, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:17'),
(3284, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:17'),
(3285, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:17'),
(3286, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:18'),
(3287, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:18'),
(3288, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:18'),
(3289, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:19'),
(3290, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:19'),
(3291, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:19'),
(3292, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:19'),
(3293, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:19'),
(3294, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:19'),
(3295, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:20'),
(3296, '::1', 2, 'Saudi Arabia', '2025-06-05 11:35:20'),
(3297, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:45'),
(3298, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:45'),
(3299, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:45'),
(3300, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:46'),
(3301, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:46'),
(3302, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:46'),
(3303, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:46'),
(3304, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:46'),
(3305, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:46'),
(3306, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:46'),
(3307, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:47'),
(3308, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:47'),
(3309, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:47'),
(3310, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:47'),
(3311, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:47'),
(3312, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:47'),
(3313, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:48'),
(3314, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:48'),
(3315, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:48'),
(3316, '::1', 1, 'Saudi Arabia', '2025-06-05 11:48:48'),
(3317, '::1', 2, 'Saudi Arabia', '2025-06-05 11:48:57'),
(3318, '::1', 2, 'Saudi Arabia', '2025-06-05 11:48:58'),
(3319, '::1', 2, 'Saudi Arabia', '2025-06-05 11:48:58'),
(3320, '::1', 2, 'Saudi Arabia', '2025-06-05 11:48:58'),
(3321, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:01'),
(3322, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:01'),
(3323, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:01'),
(3324, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:01'),
(3325, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:01'),
(3326, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:02'),
(3327, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:02'),
(3328, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:02'),
(3329, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:02'),
(3330, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:02'),
(3331, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:02'),
(3332, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:02'),
(3333, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:03'),
(3334, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:03'),
(3335, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:03'),
(3336, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:03'),
(3337, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:03'),
(3338, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:03'),
(3339, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:04'),
(3340, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:04'),
(3341, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:04'),
(3342, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:08'),
(3343, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:09'),
(3344, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:09'),
(3345, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:09'),
(3346, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:09'),
(3347, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:10'),
(3348, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:10'),
(3349, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:10'),
(3350, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:10'),
(3351, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:10'),
(3352, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:10'),
(3353, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:10'),
(3354, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:12'),
(3355, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:13'),
(3356, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:13'),
(3357, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:14'),
(3358, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:14'),
(3359, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:14'),
(3360, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:15'),
(3361, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:15'),
(3362, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:15'),
(3363, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:15'),
(3364, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:15'),
(3365, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:16'),
(3366, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:16'),
(3367, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:16'),
(3368, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:17'),
(3369, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:17'),
(3370, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:17'),
(3371, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:17'),
(3372, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:18'),
(3373, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:18'),
(3374, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:18'),
(3375, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:18'),
(3376, '::1', 1, 'Saudi Arabia', '2025-06-05 11:49:18'),
(3377, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:19'),
(3378, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:20'),
(3379, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:20'),
(3380, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:20'),
(3381, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:20'),
(3382, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:21'),
(3383, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:21'),
(3384, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:21'),
(3385, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:22'),
(3386, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:22'),
(3387, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:22'),
(3388, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:23'),
(3389, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:23'),
(3390, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:23'),
(3391, '::1', 2, 'Saudi Arabia', '2025-06-05 11:49:24'),
(3392, '::1', 1, 'Saudi Arabia', '2025-06-05 12:11:12'),
(3393, '::1', 1, 'Saudi Arabia', '2025-06-05 12:11:13'),
(3394, '::1', 1, 'Saudi Arabia', '2025-06-05 12:11:13'),
(3395, '::1', 1, 'Saudi Arabia', '2025-06-05 12:11:13'),
(3396, '::1', 1, 'Saudi Arabia', '2025-06-05 12:11:13'),
(3397, '::1', 1, 'Saudi Arabia', '2025-06-05 12:11:13'),
(3398, '::1', 1, 'Saudi Arabia', '2025-06-05 12:11:13'),
(3399, '::1', 1, 'Saudi Arabia', '2025-06-05 12:11:14'),
(3400, '::1', 1, 'Saudi Arabia', '2025-06-05 12:11:14'),
(3401, '::1', 1, 'Saudi Arabia', '2025-06-05 12:11:14'),
(3402, '::1', 1, 'Saudi Arabia', '2025-06-05 12:11:15'),
(3403, '::1', 1, 'Saudi Arabia', '2025-06-05 12:11:15'),
(3404, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:18'),
(3405, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:18'),
(3406, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:18'),
(3407, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:19'),
(3408, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:19'),
(3409, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:19'),
(3410, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:19'),
(3411, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:19'),
(3412, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:19'),
(3413, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:19'),
(3414, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:20'),
(3415, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:20'),
(3416, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:20'),
(3417, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:20'),
(3418, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:20'),
(3419, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:20'),
(3420, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:21'),
(3421, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:21'),
(3422, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:21'),
(3423, '::1', 2, 'Saudi Arabia', '2025-06-05 12:11:21');

-- --------------------------------------------------------

--
-- Table structure for table `country_stats`
--

CREATE TABLE `country_stats` (
  `id` int(11) NOT NULL,
  `image_id` int(11) NOT NULL,
  `country` varchar(100) NOT NULL,
  `clicks` bigint(20) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `country_stats`
--

INSERT INTO `country_stats` (`id`, `image_id`, `country`, `clicks`) VALUES
(11716, 1, 'Saudi Arabia', 426),
(11717, 2, 'Saudi Arabia', 458),
(12292, 1, 'Unknown', 3),
(12293, 2, 'Unknown', 9);

-- --------------------------------------------------------

--
-- Table structure for table `image_stats`
--

CREATE TABLE `image_stats` (
  `image_id` int(11) NOT NULL,
  `total_clicks` bigint(20) DEFAULT 0,
  `image_path` varchar(255) DEFAULT NULL,
  `pressed_image_path` varchar(255) DEFAULT NULL,
  `sound_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `image_stats`
--

INSERT INTO `image_stats` (`image_id`, `total_clicks`, `image_path`, `pressed_image_path`, `sound_path`) VALUES
(1, 429, '/uploads/images/image-1748868981902-848456258.png', '/uploads/images/image-1748868982645-963881384.png', '/uploads/sounds/sound-1748779326701-249730836.wav'),
(2, 467, '/uploads/images/image-1748868980900-226805559.png', '/uploads/images/image-1748868980140-91019025.png', '/uploads/sounds/sound-1748779378134-790225109.wav');

-- --------------------------------------------------------

--
-- Table structure for table `suspicious_clicks_log`
--

CREATE TABLE `suspicious_clicks_log` (
  `id` int(11) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `user_agent` text DEFAULT NULL,
  `image_id` int(11) NOT NULL,
  `click_type` enum('untrusted','rate_limit_exceeded','automated_pattern') NOT NULL COMMENT 'نوع النقرة المشبوهة',
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'تفاصيل إضافية' CHECK (json_valid(`details`)),
  `blocked_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suspicious_clicks_log`
--

INSERT INTO `suspicious_clicks_log` (`id`, `ip_address`, `user_agent`, `image_id`, `click_type`, `details`, `blocked_at`) VALUES
(26, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872046667}', '2025-06-02 13:47:26'),
(27, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872046791}', '2025-06-02 13:47:26'),
(28, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872046916}', '2025-06-02 13:47:26'),
(29, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872047042}', '2025-06-02 13:47:27'),
(30, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872047166}', '2025-06-02 13:47:27'),
(31, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872047291}', '2025-06-02 13:47:27'),
(32, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872047423}', '2025-06-02 13:47:27'),
(33, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872047548}', '2025-06-02 13:47:27'),
(34, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872047673}', '2025-06-02 13:47:27'),
(35, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872047795}', '2025-06-02 13:47:27'),
(36, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872047922}', '2025-06-02 13:47:27'),
(37, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872048047}', '2025-06-02 13:47:28'),
(38, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872048172}', '2025-06-02 13:47:28'),
(39, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872048297}', '2025-06-02 13:47:28'),
(40, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872048430}', '2025-06-02 13:47:28'),
(41, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872048554}', '2025-06-02 13:47:28'),
(42, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872048679}', '2025-06-02 13:47:28'),
(43, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872048803}', '2025-06-02 13:47:28'),
(44, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872048928}', '2025-06-02 13:47:28'),
(45, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872049057}', '2025-06-02 13:47:29'),
(46, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872049186}', '2025-06-02 13:47:29'),
(47, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872049308}', '2025-06-02 13:47:29'),
(48, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872049442}', '2025-06-02 13:47:29'),
(49, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872049560}', '2025-06-02 13:47:29'),
(50, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872049684}', '2025-06-02 13:47:29'),
(51, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872049812}', '2025-06-02 13:47:29'),
(52, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872049941}', '2025-06-02 13:47:29'),
(53, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872050073}', '2025-06-02 13:47:30'),
(54, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872050191}', '2025-06-02 13:47:30'),
(55, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872050314}', '2025-06-02 13:47:30'),
(56, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872050441}', '2025-06-02 13:47:30'),
(57, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872050572}', '2025-06-02 13:47:30'),
(58, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872050694}', '2025-06-02 13:47:30'),
(59, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872050818}', '2025-06-02 13:47:30'),
(60, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872050947}', '2025-06-02 13:47:30'),
(61, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872051072}', '2025-06-02 13:47:31'),
(62, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872051197}', '2025-06-02 13:47:31'),
(63, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872051328}', '2025-06-02 13:47:31'),
(64, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872051450}', '2025-06-02 13:47:31'),
(65, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872051578}', '2025-06-02 13:47:31'),
(66, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872051703}', '2025-06-02 13:47:31'),
(67, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872051828}', '2025-06-02 13:47:31'),
(68, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872051954}', '2025-06-02 13:47:31'),
(69, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872052078}', '2025-06-02 13:47:32'),
(70, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872052210}', '2025-06-02 13:47:32'),
(71, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872052335}', '2025-06-02 13:47:32'),
(72, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872052457}', '2025-06-02 13:47:32'),
(73, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872052584}', '2025-06-02 13:47:32'),
(74, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872052709}', '2025-06-02 13:47:32'),
(75, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872052834}', '2025-06-02 13:47:32'),
(76, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872052960}', '2025-06-02 13:47:32'),
(77, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872053090}', '2025-06-02 13:47:33'),
(78, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872053215}', '2025-06-02 13:47:33'),
(79, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872053338}', '2025-06-02 13:47:33'),
(80, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872099570}', '2025-06-02 13:48:19'),
(81, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872099691}', '2025-06-02 13:48:19'),
(82, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872099823}', '2025-06-02 13:48:19'),
(83, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872099947}', '2025-06-02 13:48:19'),
(84, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872100071}', '2025-06-02 13:48:20'),
(85, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872100195}', '2025-06-02 13:48:20'),
(86, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872100328}', '2025-06-02 13:48:20'),
(87, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872100448}', '2025-06-02 13:48:20'),
(88, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872100577}', '2025-06-02 13:48:20'),
(89, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872100701}', '2025-06-02 13:48:20'),
(90, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872100826}', '2025-06-02 13:48:20'),
(91, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872100959}', '2025-06-02 13:48:20'),
(92, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872101085}', '2025-06-02 13:48:21'),
(93, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872101208}', '2025-06-02 13:48:21'),
(94, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872101331}', '2025-06-02 13:48:21'),
(95, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872101456}', '2025-06-02 13:48:21'),
(96, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872101582}', '2025-06-02 13:48:21'),
(97, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872101707}', '2025-06-02 13:48:21'),
(98, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872101834}', '2025-06-02 13:48:21'),
(99, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872101960}', '2025-06-02 13:48:21'),
(100, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872102088}', '2025-06-02 13:48:22'),
(101, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872102214}', '2025-06-02 13:48:22'),
(102, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872102338}', '2025-06-02 13:48:22'),
(103, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872102471}', '2025-06-02 13:48:22'),
(104, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872102598}', '2025-06-02 13:48:22'),
(105, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872102720}', '2025-06-02 13:48:22'),
(106, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872102842}', '2025-06-02 13:48:22'),
(107, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872102968}', '2025-06-02 13:48:22'),
(108, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872103094}', '2025-06-02 13:48:23'),
(109, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872103222}', '2025-06-02 13:48:23'),
(110, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872103345}', '2025-06-02 13:48:23'),
(111, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872103473}', '2025-06-02 13:48:23'),
(112, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872103604}', '2025-06-02 13:48:23'),
(113, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872103728}', '2025-06-02 13:48:23'),
(114, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872103854}', '2025-06-02 13:48:23'),
(115, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872103978}', '2025-06-02 13:48:23'),
(116, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872104104}', '2025-06-02 13:48:24'),
(117, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872104230}', '2025-06-02 13:48:24'),
(118, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872104353}', '2025-06-02 13:48:24'),
(119, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872104485}', '2025-06-02 13:48:24'),
(120, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872104604}', '2025-06-02 13:48:24'),
(121, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872104733}', '2025-06-02 13:48:24'),
(122, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872104859}', '2025-06-02 13:48:24'),
(123, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872104988}', '2025-06-02 13:48:24'),
(124, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872105112}', '2025-06-02 13:48:25'),
(125, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872105236}', '2025-06-02 13:48:25'),
(126, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872105363}', '2025-06-02 13:48:25'),
(127, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872105488}', '2025-06-02 13:48:25'),
(128, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872105613}', '2025-06-02 13:48:25'),
(129, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872105739}', '2025-06-02 13:48:25'),
(130, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872105869}', '2025-06-02 13:48:25'),
(131, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872105995}', '2025-06-02 13:48:25'),
(132, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872106120}', '2025-06-02 13:48:26'),
(133, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872106244}', '2025-06-02 13:48:26'),
(134, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872106369}', '2025-06-02 13:48:26'),
(135, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872106496}', '2025-06-02 13:48:26'),
(136, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872106626}', '2025-06-02 13:48:26'),
(137, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872106754}', '2025-06-02 13:48:26'),
(138, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872106875}', '2025-06-02 13:48:26'),
(139, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872107000}', '2025-06-02 13:48:27'),
(140, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872107128}', '2025-06-02 13:48:27'),
(141, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872107255}', '2025-06-02 13:48:27'),
(142, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872107378}', '2025-06-02 13:48:27'),
(143, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872107503}', '2025-06-02 13:48:27'),
(144, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872107631}', '2025-06-02 13:48:27'),
(145, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872107756}', '2025-06-02 13:48:27'),
(146, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872107881}', '2025-06-02 13:48:27'),
(147, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872108006}', '2025-06-02 13:48:28'),
(148, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872108138}', '2025-06-02 13:48:28'),
(149, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872108260}', '2025-06-02 13:48:28'),
(150, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872108388}', '2025-06-02 13:48:28'),
(151, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872108512}', '2025-06-02 13:48:28'),
(152, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872108638}', '2025-06-02 13:48:28'),
(153, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872108764}', '2025-06-02 13:48:28'),
(154, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872108894}', '2025-06-02 13:48:28'),
(155, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872109017}', '2025-06-02 13:48:29'),
(156, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872109144}', '2025-06-02 13:48:29'),
(157, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872109266}', '2025-06-02 13:48:29'),
(158, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'untrusted', '{\"message\":\"Click event is not trusted\",\"timestamp\":1748872109399}', '2025-06-02 13:48:29'),
(159, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'rate_limit_exceeded', '{\"clickCount\":200,\"maxAllowed\":200,\"timeWindow\":60}', '2025-06-02 14:22:11'),
(160, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'rate_limit_exceeded', '{\"clickCount\":200,\"maxAllowed\":200,\"timeWindow\":60}', '2025-06-02 14:23:27'),
(161, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'rate_limit_exceeded', '{\"clickCount\":200,\"maxAllowed\":200,\"timeWindow\":60}', '2025-06-02 14:24:07'),
(162, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 2, 'rate_limit_exceeded', '{\"clickCount\":200,\"maxAllowed\":200,\"timeWindow\":10}', '2025-06-02 14:29:21'),
(163, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 1, 'rate_limit_exceeded', '{\"clickCount\":10,\"maxAllowed\":10,\"timeWindow\":1}', '2025-06-02 14:30:31');

-- --------------------------------------------------------

--
-- Table structure for table `user_click_tracking`
--

CREATE TABLE `user_click_tracking` (
  `id` int(11) NOT NULL,
  `ip_address` varchar(45) NOT NULL COMMENT 'عنوان IP',
  `user_agent` text DEFAULT NULL COMMENT 'معلومات المتصفح',
  `click_count` int(11) DEFAULT 0 COMMENT 'عدد النقرات',
  `first_click_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'أول نقرة',
  `last_click_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'آخر نقرة',
  `is_blocked` tinyint(1) DEFAULT 0 COMMENT 'هل المستخدم محظور',
  `block_expires_at` timestamp NULL DEFAULT NULL COMMENT 'انتهاء الحظر',
  `suspicious_activity_count` int(11) DEFAULT 0 COMMENT 'عدد الأنشطة المشبوهة',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_click_tracking`
--

INSERT INTO `user_click_tracking` (`id`, `ip_address`, `user_agent`, `click_count`, `first_click_at`, `last_click_at`, `is_blocked`, `block_expires_at`, `suspicious_activity_count`, `created_at`) VALUES
(2, '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36', 4, '2025-06-02 13:18:32', '2025-06-05 12:11:21', 0, NULL, 0, '2025-06-02 13:18:32');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `admin_otps`
--
ALTER TABLE `admin_otps`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `anti_click_bot_settings`
--
ALTER TABLE `anti_click_bot_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `banned_ips`
--
ALTER TABLE `banned_ips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ip_active` (`ip_address`,`is_active`),
  ADD KEY `idx_expires` (`expires_at`);

--
-- Indexes for table `ban_settings`
--
ALTER TABLE `ban_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `challenge_settings`
--
ALTER TABLE `challenge_settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `click_events`
--
ALTER TABLE `click_events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `click_tracking`
--
ALTER TABLE `click_tracking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ip_time` (`ip_address`,`clicked_at`),
  ADD KEY `idx_cleanup` (`clicked_at`);

--
-- Indexes for table `country_stats`
--
ALTER TABLE `country_stats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `image_id` (`image_id`,`country`);

--
-- Indexes for table `image_stats`
--
ALTER TABLE `image_stats`
  ADD PRIMARY KEY (`image_id`);

--
-- Indexes for table `suspicious_clicks_log`
--
ALTER TABLE `suspicious_clicks_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ip_address` (`ip_address`),
  ADD KEY `idx_blocked_at` (`blocked_at`);

--
-- Indexes for table `user_click_tracking`
--
ALTER TABLE `user_click_tracking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_ip_address` (`ip_address`),
  ADD KEY `idx_last_click` (`last_click_at`),
  ADD KEY `idx_blocked` (`is_blocked`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `admin_otps`
--
ALTER TABLE `admin_otps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `anti_click_bot_settings`
--
ALTER TABLE `anti_click_bot_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `banned_ips`
--
ALTER TABLE `banned_ips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `ban_settings`
--
ALTER TABLE `ban_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `challenge_settings`
--
ALTER TABLE `challenge_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `click_events`
--
ALTER TABLE `click_events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=959;

--
-- AUTO_INCREMENT for table `click_tracking`
--
ALTER TABLE `click_tracking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3424;

--
-- AUTO_INCREMENT for table `country_stats`
--
ALTER TABLE `country_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12612;

--
-- AUTO_INCREMENT for table `suspicious_clicks_log`
--
ALTER TABLE `suspicious_clicks_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=164;

--
-- AUTO_INCREMENT for table `user_click_tracking`
--
ALTER TABLE `user_click_tracking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_otps`
--
ALTER TABLE `admin_otps`
  ADD CONSTRAINT `admin_otps_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
