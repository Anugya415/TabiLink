-- =====================================================
-- TabiLink Database Schema
-- MySQL 8.0+ Compatible
-- Generated from Sequelize Models
-- =====================================================

-- Create database (uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS tabilink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE tabilink;

-- =====================================================
-- Table: users
-- =====================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NULL,
  `avatar` VARCHAR(500) NULL,
  `role` ENUM('user', 'admin', 'super_admin') NOT NULL DEFAULT 'user',
  `isEmailVerified` TINYINT(1) NOT NULL DEFAULT 0,
  `emailVerificationToken` VARCHAR(255) NULL,
  `passwordResetToken` VARCHAR(255) NULL,
  `passwordResetExpires` DATETIME NULL,
  `memberSince` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `membershipTier` ENUM('Silver', 'Gold', 'Platinum') NOT NULL DEFAULT 'Silver',
  `totalTrips` INT UNSIGNED NOT NULL DEFAULT 0,
  `totalSpent` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `loyaltyPoints` INT UNSIGNED NOT NULL DEFAULT 0,
  `preferences` JSON NOT NULL DEFAULT ('{"currency":"USD","language":"en","notifications":{"email":true,"sms":false,"push":true}}'),
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `lastLogin` DATETIME NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_role` (`role`),
  KEY `idx_isActive` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: hotels
-- =====================================================
CREATE TABLE IF NOT EXISTS `hotels` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `location_city` VARCHAR(100) NOT NULL,
  `location_country` VARCHAR(100) NOT NULL,
  `location_address` VARCHAR(500) NOT NULL,
  `location_coordinates` JSON NULL,
  `location_distance_from_center` VARCHAR(50) NULL,
  `description` TEXT NOT NULL,
  `images` JSON NOT NULL DEFAULT ('[]'),
  `category` ENUM('luxury', 'beach', 'business', 'boutique', 'mountain', 'resort') NOT NULL,
  `amenities` JSON NOT NULL DEFAULT ('[]'),
  `price` DECIMAL(10, 2) NOT NULL,
  `original_price` DECIMAL(10, 2) NULL,
  `discount` DECIMAL(5, 2) NULL,
  `rating` DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
  `review_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `rooms` JSON NOT NULL DEFAULT ('[]'),
  `policies` JSON NOT NULL DEFAULT ('{"checkIn":"14:00","checkOut":"11:00","cancellation":"Free cancellation up to 24 hours before check-in","petsAllowed":false,"smokingAllowed":false}'),
  `contact` JSON NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `is_popular` TINYINT(1) NOT NULL DEFAULT 0,
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_location` (`location_city`, `location_country`),
  KEY `idx_category_active` (`category`, `is_active`),
  KEY `idx_price_rating` (`price`, `rating`),
  KEY `idx_popular_featured` (`is_popular`, `featured`),
  KEY `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: travel_packages
-- =====================================================
CREATE TABLE IF NOT EXISTS `travel_packages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `destination` JSON NOT NULL DEFAULT ('[]'),
  `description` TEXT NOT NULL,
  `images` JSON NOT NULL DEFAULT ('[]'),
  `duration` JSON NOT NULL DEFAULT ('{"days":1,"nights":0}'),
  `includes` JSON NOT NULL DEFAULT ('[]'),
  `price` DECIMAL(10, 2) NOT NULL,
  `original_price` DECIMAL(10, 2) NULL,
  `discount` DECIMAL(5, 2) NULL,
  `rating` DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
  `review_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `itinerary` JSON NOT NULL DEFAULT ('[]'),
  `highlights` JSON NOT NULL DEFAULT ('[]'),
  `exclusions` JSON NOT NULL DEFAULT ('[]'),
  `terms_and_conditions` JSON NOT NULL DEFAULT ('[]'),
  `category` ENUM('adventure', 'beach', 'cultural', 'family', 'luxury', 'romantic') NOT NULL,
  `max_travelers` INT UNSIGNED NOT NULL DEFAULT 10,
  `min_travelers` INT UNSIGNED NOT NULL DEFAULT 1,
  `availability` JSON NOT NULL DEFAULT ('[]'),
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `is_popular` TINYINT(1) NOT NULL DEFAULT 0,
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category_active` (`category`, `is_active`),
  KEY `idx_price_rating` (`price`, `rating`),
  KEY `idx_popular_featured` (`is_popular`, `featured`),
  KEY `idx_title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: bookings
-- =====================================================
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` VARCHAR(100) NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `type` ENUM('hotel', 'travel') NOT NULL,
  `hotel_id` INT UNSIGNED NULL,
  `travel_package_id` INT UNSIGNED NULL,
  `check_in` DATETIME NULL,
  `check_out` DATETIME NULL,
  `travelers` INT UNSIGNED NOT NULL,
  `guests` JSON NULL,
  `subtotal` DECIMAL(10, 2) NOT NULL,
  `tax` DECIMAL(10, 2) NOT NULL,
  `discount` DECIMAL(10, 2) NULL,
  `total` DECIMAL(10, 2) NOT NULL,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'USD',
  `status` ENUM('pending', 'confirmed', 'cancelled', 'completed', 'refunded') NOT NULL DEFAULT 'pending',
  `payment_status` ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  `payment_method` ENUM('card', 'paypal', 'bank_transfer') NULL,
  `payment_intent_id` VARCHAR(255) NULL,
  `transaction_id` VARCHAR(100) NULL,
  `cancellation_reason` TEXT NULL,
  `cancelled_at` DATETIME NULL,
  `special_requests` TEXT NULL,
  `booking_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmation_email_sent` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `booking_id` (`booking_id`),
  KEY `idx_user_booking_date` (`user_id`, `booking_date`),
  KEY `idx_status_payment_status` (`status`, `payment_status`),
  KEY `idx_createdAt` (`createdAt`),
  CONSTRAINT `fk_bookings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_bookings_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_bookings_travel_package` FOREIGN KEY (`travel_package_id`) REFERENCES `travel_packages` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: reviews
-- =====================================================
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `booking_id` INT UNSIGNED NOT NULL,
  `type` ENUM('hotel', 'travel') NOT NULL,
  `hotel_id` INT UNSIGNED NULL,
  `travel_package_id` INT UNSIGNED NULL,
  `rating` INT UNSIGNED NOT NULL,
  `title` VARCHAR(200) NULL,
  `comment` TEXT NOT NULL,
  `images` JSON NULL,
  `verified` TINYINT(1) NOT NULL DEFAULT 0,
  `helpful` INT UNSIGNED NOT NULL DEFAULT 0,
  `reported` TINYINT(1) NOT NULL DEFAULT 0,
  `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_hotel_status_created` (`hotel_id`, `status`, `createdAt`),
  KEY `idx_travel_status_created` (`travel_package_id`, `status`, `createdAt`),
  KEY `idx_user_type` (`user_id`, `type`),
  KEY `idx_rating_status` (`rating`, `status`),
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_reviews_travel_package` FOREIGN KEY (`travel_package_id`) REFERENCES `travel_packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: payments
-- =====================================================
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'USD',
  `status` ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled') NOT NULL DEFAULT 'pending',
  `payment_method` ENUM('card', 'paypal', 'bank_transfer') NOT NULL,
  `payment_intent_id` VARCHAR(255) NULL,
  `transaction_id` VARCHAR(100) NOT NULL,
  `stripe_charge_id` VARCHAR(255) NULL,
  `card_details` JSON NULL,
  `refund_amount` DECIMAL(10, 2) NULL,
  `refund_reason` TEXT NULL,
  `refunded_at` DATETIME NULL,
  `metadata` JSON NULL DEFAULT ('{}'),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  KEY `idx_user_created` (`user_id`, `createdAt`),
  KEY `idx_status_created` (`status`, `createdAt`),
  KEY `idx_payment_intent_id` (`payment_intent_id`),
  CONSTRAINT `fk_payments_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_payments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: favorites
-- =====================================================
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `type` ENUM('hotel', 'travel') NOT NULL,
  `hotel_id` INT UNSIGNED NULL,
  `travel_package_id` INT UNSIGNED NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_hotel` (`user_id`, `hotel_id`),
  UNIQUE KEY `unique_user_travel` (`user_id`, `travel_package_id`),
  KEY `idx_user_type` (`user_id`, `type`),
  CONSTRAINT `fk_favorites_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_favorites_hotel` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_favorites_travel_package` FOREIGN KEY (`travel_package_id`) REFERENCES `travel_packages` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
  -- Note: Application logic should ensure only one of hotel_id or travel_package_id is set based on type
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: contacts
-- =====================================================
CREATE TABLE IF NOT EXISTS `contacts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `subject` VARCHAR(200) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('new', 'read', 'replied', 'archived') NOT NULL DEFAULT 'new',
  `replied_at` DATETIME NULL,
  `reply_message` TEXT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_status_created` (`status`, `createdAt`),
  KEY `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: discounts
-- =====================================================
CREATE TABLE IF NOT EXISTS `discounts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `discount_type` ENUM('percentage', 'fixed') NOT NULL,
  `discount_value` DECIMAL(10, 2) NOT NULL,
  `min_purchase_amount` DECIMAL(10, 2) NULL,
  `max_discount_amount` DECIMAL(10, 2) NULL,
  `applicable_to` ENUM('all', 'hotel', 'travel') NOT NULL DEFAULT 'all',
  `applicable_hotel_ids` JSON NULL,
  `applicable_travel_package_ids` JSON NULL,
  `start_date` DATETIME NOT NULL,
  `end_date` DATETIME NOT NULL,
  `usage_limit` INT UNSIGNED NULL,
  `usage_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `user_usage_limit` INT UNSIGNED NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`),
  KEY `idx_code` (`code`),
  KEY `idx_is_active_dates` (`is_active`, `start_date`, `end_date`),
  KEY `idx_applicable_to` (`applicable_to`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: rewards
-- =====================================================
CREATE TABLE IF NOT EXISTS `rewards` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `category` ENUM('discount', 'cashback', 'voucher', 'upgrade', 'freebie') NOT NULL,
  `points_required` INT UNSIGNED NOT NULL,
  `discount_type` ENUM('percentage', 'fixed') NULL,
  `discount_value` DECIMAL(10, 2) NULL,
  `cashback_amount` DECIMAL(10, 2) NULL,
  `voucher_code` VARCHAR(100) NULL,
  `max_redemptions` INT UNSIGNED NULL,
  `redemption_count` INT UNSIGNED NOT NULL DEFAULT 0,
  `valid_from` DATETIME NOT NULL,
  `valid_until` DATETIME NOT NULL,
  `applicable_to` ENUM('all', 'hotel', 'travel') NULL,
  `min_purchase_amount` DECIMAL(10, 2) NULL,
  `image` VARCHAR(500) NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_is_active_dates` (`is_active`, `valid_from`, `valid_until`),
  KEY `idx_points_required` (`points_required`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Table: redemptions
-- =====================================================
CREATE TABLE IF NOT EXISTS `redemptions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `reward_id` INT UNSIGNED NOT NULL,
  `points_used` INT UNSIGNED NOT NULL,
  `status` ENUM('pending', 'completed', 'cancelled', 'expired') NOT NULL DEFAULT 'pending',
  `discount_code` VARCHAR(50) NULL,
  `voucher_code` VARCHAR(100) NULL,
  `cashback_amount` DECIMAL(10, 2) NULL,
  `applied_to_booking_id` INT UNSIGNED NULL,
  `expires_at` DATETIME NULL,
  `redeemed_at` DATETIME NULL,
  `cancelled_at` DATETIME NULL,
  `cancellation_reason` TEXT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_reward_id` (`reward_id`),
  KEY `idx_status` (`status`),
  KEY `idx_createdAt` (`createdAt`),
  CONSTRAINT `fk_redemptions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_redemptions_reward` FOREIGN KEY (`reward_id`) REFERENCES `rewards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_redemptions_booking` FOREIGN KEY (`applied_to_booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Indexes Summary
-- =====================================================
-- users:
--   - PRIMARY KEY: id
--   - UNIQUE: email
--   - INDEX: role, isActive
--
-- hotels:
--   - PRIMARY KEY: id
--   - INDEX: (location_city, location_country), (category, is_active), (price, rating), (is_popular, featured), name
--
-- travel_packages:
--   - PRIMARY KEY: id
--   - INDEX: (category, is_active), (price, rating), (is_popular, featured), title
--
-- bookings:
--   - PRIMARY KEY: id
--   - UNIQUE: booking_id
--   - INDEX: (user_id, booking_date), (status, payment_status), createdAt
--   - FOREIGN KEYS: user_id -> users.id, hotel_id -> hotels.id, travel_package_id -> travel_packages.id
--
-- reviews:
--   - PRIMARY KEY: id
--   - INDEX: (hotel_id, status, createdAt), (travel_package_id, status, createdAt), (user_id, type), (rating, status)
--   - FOREIGN KEYS: user_id -> users.id, booking_id -> bookings.id, hotel_id -> hotels.id, travel_package_id -> travel_packages.id
--
-- payments:
--   - PRIMARY KEY: id
--   - UNIQUE: transaction_id
--   - INDEX: (user_id, createdAt), (status, createdAt), payment_intent_id
--   - FOREIGN KEYS: booking_id -> bookings.id, user_id -> users.id
--
-- favorites:
--   - PRIMARY KEY: id
--   - UNIQUE: (user_id, hotel_id), (user_id, travel_package_id)
--   - INDEX: (user_id, type)
--   - FOREIGN KEYS: user_id -> users.id, hotel_id -> hotels.id, travel_package_id -> travel_packages.id
--
-- contacts:
--   - PRIMARY KEY: id
--   - INDEX: (status, createdAt), email
--
-- discounts:
--   - PRIMARY KEY: id
--   - UNIQUE: code
--   - INDEX: code, (is_active, start_date, end_date), applicable_to
--
-- rewards:
--   - PRIMARY KEY: id
--   - INDEX: category, (is_active, valid_from, valid_until), points_required
--
-- redemptions:
--   - PRIMARY KEY: id
--   - INDEX: user_id, reward_id, status, createdAt
--   - FOREIGN KEYS: user_id -> users.id, reward_id -> rewards.id, applied_to_booking_id -> bookings.id

-- =====================================================
-- Notes
-- =====================================================
-- 1. All tables use InnoDB engine for foreign key support
-- 2. All tables use utf8mb4 charset for full Unicode support
-- 3. JSON columns require MySQL 5.7.8+ or MariaDB 10.2.7+
-- 4. Timestamps are automatically managed (createdAt, updatedAt)
-- 5. Foreign keys use CASCADE for deletes/updates where appropriate
-- 6. Unique constraints prevent duplicate favorites per user
-- 7. Indexes are optimized for common query patterns
-- 8. All monetary values use DECIMAL(10, 2) for precision
-- 9. ENUM types match the Sequelize model definitions
-- 10. Default values match the Sequelize model defaults

