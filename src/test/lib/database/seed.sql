-- This SQL file is copyright for the EECS graduate program application --
-- Latest MySQL working version for this file: 5.7.21 --

-- Create the database

DROP DATABASE IF EXISTS `testdb`;
CREATE DATABASE `testdb`;

-- Select the database

USE `testdb`;

-- FACULTY_MEMBER table
-- @fm_Id: unique auto incremental primary key for each faculty member
-- @fm_Lname: last name of the faculty member
-- @fm_Fname: first name of the faculty member
-- @fm_Email: email of the faculty member
-- @fm_Roles: list of roles for the faculty member
-- @presetProf: preset filters for the role of a prof
-- @presetCommittee: preset filters for the role of a committee
-- @presetAdmin: preset filters for the role of an admin

CREATE TABLE `FACULTY_MEMBER` (
    `fm_Id` INT NOT NULL AUTO_INCREMENT,
    `fm_Username` VARCHAR(50) UNIQUE DEFAULT NULL,
    `fm_Lname` VARCHAR(50) NOT NULL,
    `fm_Fname` VARCHAR(50) NOT NULL,
    `fm_Email` VARCHAR(255) DEFAULT NULL,
    `fm_Roles` JSON DEFAULT NULL,
    `presetProf` JSON DEFAULT NULL,
    `presetCommittee` JSON DEFAULT NULL,
    `presetAdmin` JSON DEFAULT NULL,
    `is_LoggedIn` TINYINT(0) DEFAULT 0,
    `selectedRole` ENUM('Admin', 'Professor', 'Committee Member') DEFAULT NULL,
    PRIMARY KEY(`fm_Id`)
) ENGINE=INNODB;


-- APPLICATION table
-- @app_Id: unique auto incremental primary key for each application
-- @app_Date: creation date of the application
-- @app_Session: the session of the student application
-- @LName: last name of the student
-- @FName: first name of the student
-- @Email: email of the student
-- @Gender: gender of the student
-- @GPA: grade point average of the student prior to applying
-- @GPA_FINAL: is the GPA applied with the final gpa
-- @GRE: gre score of the applicant
-- @Rank: committee rank of the student application
-- @Degree: degree the student applied to
-- @VStatus: visa status of the student
-- @FOI: list of field of interest for the student
-- @prefProfs: list of preferred professors for the student
-- @profContacted: list of professors who has contacted the student
-- @profRequested: list of professors who has requested the student
-- @letterDate: date of the letter of acceptance sent out
-- @programDecision: decision of the program
-- @studentDecision: decision of the student
-- @declineReason: reason for decline
-- @ygsAwarded: ygs awarded to the student
-- @app_Comments: additional comments for the application
-- @committeeReviewed: boolean value to state if all the committee reviews are in

CREATE TABLE `APPLICATION` (
    `app_Id` INT NOT NULL AUTO_INCREMENT,
    `app_Date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `app_Session` ENUM('Fall', 'Winter', 'Summer') NOT NULL,
    `LName` VARCHAR(50) NOT NULL,
    `FName` VARCHAR(50) NOT NULL,
    `Email` VARCHAR(255) NOT NULL,
    `Gender` ENUM('M', 'F') DEFAULT NULL,
    `GPA` ENUM('A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E', 'F') DEFAULT NULL,
    `GPA_FINAL` TINYINT(1) DEFAULT 0,
    `GRE` INT DEFAULT NULL,
    `Degree` ENUM('PhD', 'MSc', 'MASc') DEFAULT NULL,
    `VStatus` ENUM('Domestic', 'Visa') NOT NULL,
    `Rank` JSON DEFAULT NULL,
    `committeeReviewed` TINYINT(1) NOT NULL DEFAULT 0,
    `FOI` JSON DEFAULT NULL,
    `prefProfs` JSON DEFAULT NULL,
    `profContacted` JSON DEFAULT NULL,
    `profRequested` JSON DEFAULT NULL,
    `letterDate` DATETIME DEFAULT NULL,
    `programDecision` ENUM('Accepted', 'Declined') DEFAULT NULL,
    `studentDecision` ENUM('Accepted', 'Declined') DEFAULT NULL,
    `declineReason` VARCHAR(1024) DEFAULT NULL,
    `ygsAwarded` TINYINT(1) NOT NULL DEFAULT 0,
    `app_Comments` VARCHAR(1024) DEFAULT NULL,
    PRIMARY KEY(`app_Id`)
) ENGINE=INNODB;


-- APPLICATION_REVIEW table
-- @committeeId: committee member id
-- @appId: application id
-- @Background: background of the student applicant
-- @researchExp: research experience of the student applicant
-- @Comments: comments on the application
-- @Rank: committee rank of the student application
-- @Status: status of the application review
-- @lastReminded: date when the committee member was last reminded for the review

CREATE TABLE `APPLICATION_REVIEW` (
    `committeeId` INT NOT NULL,
    `appId` INT NOT NULL,
    `assignDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `Background` VARCHAR(2048) DEFAULT NULL,
    `researchExp` VARCHAR(2048) DEFAULT NULL,
    `Comments` VARCHAR(1024) DEFAULT NULL,
    `c_Rank` ENUM('A+', 'A', 'B+', 'B', 'C') DEFAULT NULL,
    `Status` ENUM('New', 'Draft', 'In-Progress', 'Reviewed', 'Submitted') NOT NULL,
    `lastReminded` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`committeeId`, `appId`),
    FOREIGN KEY (`committeeId`) REFERENCES `FACULTY_MEMBER`(`fm_Id`) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (`appId`) REFERENCES `APPLICATION`(`app_Id`) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=INNODB;


-- APPLICATION_SEEN table
-- @fmId: professor id
-- @appId: application id
-- @seen: application is seen by the professor

CREATE TABLE `APPLICATION_SEEN` (
    `fmId` INT NOT NULL,
    `appId` INT NOT NULL,
    `seen` TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY(`fmId`, `appId`),
    FOREIGN KEY (`fmId`) REFERENCES `FACULTY_MEMBER`(`fm_Id`) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (`appId`) REFERENCES `APPLICATION`(`app_Id`) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=INNODB;


-- UNIVERSITY table
-- @u_Id: unique auto incremental primary key for each university
-- @u_Name: full accredited name of the university
-- @u_Assessments: list of assessments for the university

CREATE TABLE `UNIVERSITY` (
    `u_Id` INT NOT NULL AUTO_INCREMENT,
    `u_Name` VARCHAR(50) NOT NULL,
    `u_Assessments` JSON DEFAULT NULL,
    PRIMARY KEY(`u_Id`)
) ENGINE=INNODB;


-- FOI table
-- @field_Id: unique auto incremental primary key for each field of interest
-- @field_Name: full name of the field

CREATE TABLE `FOI` (
    `field_Id` INT NOT NULL AUTO_INCREMENT,
    `field_Name` VARCHAR(50) NOT NULL,
    PRIMARY KEY(`field_Id`)
) ENGINE=INNODB;

-- Source all trigger files
SET autocommit=0;
source test/lib/database/trigger/application_rev.trigger.sql;COMMIT;
SET autocommit=0;
source test/lib/database/trigger/application_seen.trigger.sql;COMMIT;


-- Source all the data sql files
SET autocommit=0; source test/lib/database/data/foi.data.sql; COMMIT;
SET autocommit=0; source test/lib/database/data/fm.data.sql; COMMIT;
SET autocommit=0; source test/lib/database/data/application.data.sql; COMMIT;
SET autocommit=0; source test/lib/database/data/university.data.sql; COMMIT;
SET autocommit=0; source test/lib/database/data/application_rev.data.sql; COMMIT;
SET autocommit=0; source test/lib/database/data/application_seen.data.sql; COMMIT;
