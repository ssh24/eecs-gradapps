-- This SQL file is copyright for the EECS graduate program application --
-- Latest MySQL working version for this file: 5.7.21 --

SET GLOBAL max_allowed_packet=10000000;

-- faculty_member table
-- @fm_Id: unique auto incremental primary key for each faculty member
-- @fm_Lname: last name of the faculty member
-- @fm_Fname: first name of the faculty member
-- @fm_Email: email of the faculty member
-- @fm_Roles: list of roles for the faculty member
-- @presetProf: preset filters for the role of a prof
-- @presetCommittee: preset filters for the role of a committee
-- @presetAdmin: preset filters for the role of an admin

CREATE TABLE `faculty_member` (
    `fm_Id` INT NOT NULL AUTO_INCREMENT,
    `fm_Username` VARCHAR(50) UNIQUE NOT NULL,
    `fm_Lname` VARCHAR(50) NOT NULL,
    `fm_Fname` VARCHAR(50) NOT NULL,
    `fm_Email` VARCHAR(255) DEFAULT NULL,
    `fm_Roles` JSON DEFAULT NULL,
    `presetProf` JSON DEFAULT NULL,
    `presetCommittee` JSON DEFAULT NULL,
    `presetAdmin` JSON DEFAULT NULL,
    PRIMARY KEY(`fm_Id`)
) ENGINE=INNODB;


-- application table
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

CREATE TABLE `application` (
    `app_Id` INT NOT NULL AUTO_INCREMENT,
    `student_Id` BIGINT(9) NOT NULL,
    `app_Date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `app_Session` VARCHAR(50) NOT NULL,
    `LName` VARCHAR(50) NOT NULL,
    `FName` VARCHAR(50) NOT NULL,
    `Email` VARCHAR(255) NOT NULL,
    `Gender` VARCHAR(2) DEFAULT NULL,
    `GPA` VARCHAR(2) DEFAULT NULL,
    `GPA_FINAL` TINYINT(1) DEFAULT 0,
    `GRE` VARCHAR(20) DEFAULT NULL,
    `TOEFL` INT DEFAULT NULL,
    `IELTS` FLOAT DEFAULT NULL,
    `YELT` INT DEFAULT NULL,
    `Degree` VARCHAR(50) DEFAULT NULL,
    `VStatus` VARCHAR(50) NOT NULL,
    `Rank` JSON DEFAULT NULL,
    `committeeReviewed` TINYINT(1) NOT NULL DEFAULT 0,
    `FOI` JSON DEFAULT NULL,
    `prefProfs` JSON DEFAULT NULL,
    `profContacted` JSON DEFAULT NULL,
    `profRequested` JSON DEFAULT NULL,
    `letterDate` DATETIME DEFAULT NULL,
    `programDecision` VARCHAR(50) DEFAULT NULL,
    `studentDecision` VARCHAR(50) DEFAULT NULL,
    `declineReason` LONGTEXT DEFAULT NULL,
    `ygsAwarded` TINYINT(1) NOT NULL DEFAULT 0,
    `app_file` LONGBLOB,
    PRIMARY KEY(`app_Id`, `student_Id`)
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

CREATE TABLE `application_review` (
    `committeeId` INT NOT NULL,
    `appId` INT NOT NULL,
    `assignDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `PreviousInst` JSON DEFAULT NULL,
    `UniAssessment` JSON DEFAULT NULL,
    `Background` LONGTEXT DEFAULT NULL,
    `researchExp` LONGTEXT DEFAULT NULL,
    `Letter` LONGTEXT DEFAULT NULL,
    `Comments` LONGTEXT DEFAULT NULL,
    `c_Rank` VARCHAR(2) DEFAULT NULL,
    `Status` VARCHAR(50) NOT NULL,
    `lastReminded` DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(`committeeId`, `appId`),
    FOREIGN KEY (`committeeId`) REFERENCES `faculty_member`(`fm_Id`) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (`appId`) REFERENCES `application`(`app_Id`) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=INNODB;


-- APPLICATION_SEEN table
-- @fmId: professor id
-- @appId: application id
-- @seen: application is seen by the professor

CREATE TABLE `application_seen` (
    `fmId` INT NOT NULL,
    `appId` INT NOT NULL,
    `seen` TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY(`fmId`, `appId`),
    FOREIGN KEY (`fmId`) REFERENCES `faculty_member`(`fm_Id`) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (`appId`) REFERENCES `application`(`app_Id`) 
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=INNODB;


-- UNIVERSITY table
-- @u_Id: unique auto incremental primary key for each university
-- @u_Name: full accredited name of the university
-- @u_Assessments: list of assessments for the university

CREATE TABLE `university` (
    `u_Id` INT NOT NULL AUTO_INCREMENT,
    `u_Name` VARCHAR(50) NOT NULL,
    `u_Assessments` JSON DEFAULT NULL,
    PRIMARY KEY(`u_Id`, `u_Name`)
) ENGINE=INNODB;


-- FOI table
-- @field_Id: unique auto incremental primary key for each field of interest
-- @field_Name: full name of the field

CREATE TABLE `foi` (
    `field_Id` INT NOT NULL AUTO_INCREMENT,
    `field_Name` VARCHAR(50) NOT NULL,
    PRIMARY KEY(`field_Id`)
) ENGINE=INNODB;

-- GPA table
-- @letter_grade: letter grade corressponding to the York University scale
-- @grade_point: grade point corresponding to the York University scale

CREATE TABLE `GPA` (
    `letter_grade` ENUM('A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E', 'F') NOT NULL,
    `grade_point` INT NOT NULL,
    PRIMARY KEY(`letter_grade`)
) ENGINE=INNODB;

-- SESSIONS table
-- @session_id: unique session id
-- @expires: time milliseconds of the session expiry
-- @data: json data of the cookie

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Source all trigger files
SET autocommit=0;
source test/lib/database/trigger/application_rev.trigger.sql;COMMIT;
SET autocommit=0;
source test/lib/database/trigger/application_seen.trigger.sql;COMMIT;

-- Source all the data sql files
SET autocommit=0; source test/lib/database/data/foi.data.sql; COMMIT;
SET autocommit=0; source test/lib/database/data/test.fm.data.sql; COMMIT;
SET autocommit=0; source test/lib/database/data/actual.fm.data.sql; COMMIT;
SET autocommit=0; source test/lib/database/data/application.data.sql; COMMIT;
SET autocommit=0; source test/lib/database/data/university.data.sql; COMMIT;
SET autocommit=0; source test/lib/database/data/gpa.data.sql; COMMIT;
SET autocommit=0; source test/lib/database/data/application_rev.data.sql; COMMIT;
SET autocommit=0; source test/lib/database/data/application_seen.data.sql; COMMIT;
