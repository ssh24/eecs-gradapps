-- Create the database

DROP DATABASE IF EXISTS `testdb`;
CREATE DATABASE `testdb`;

-- Select the database

USE `testdb`;

-- Source seed file
SET autocommit=0; source test/lib/database/seed.sql; COMMIT;
