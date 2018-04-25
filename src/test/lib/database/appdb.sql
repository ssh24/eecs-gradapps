-- Create the database

DROP DATABASE IF EXISTS `gradapps`;
CREATE DATABASE `gradapps`;

-- Select the database

USE `gradapps`;

-- Source seed file
SET autocommit=0; source test/lib/database/seed.sql; COMMIT;
