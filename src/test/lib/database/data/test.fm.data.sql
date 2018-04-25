-- This SQL file is copyright for the EECS graduate program application --
-- Latest MySQL working version for this file: 5.7.21 --

/****************** Insertion into `FACULTY MEMBER` table ******************/

/****************** FAKE FACULTY MEMBER DATA ******************/

---- ONLY ADMIN ROLE ----

INSERT INTO `faculty_member` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('arri', 'Cristofolo', 'Arri', 'acristofolo0@furl.net', '["Admin"]');
INSERT INTO `faculty_member` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('sophey', 'Dearlove', 'Sophey', 'sdearlove1@usnews.com', '["Admin"]');


---- ONLY PROFESSOR ROLE ----

INSERT INTO `faculty_member` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Boneham', 'Sheff', 'sboneham2@aol.com', '["Professor"]');
INSERT INTO `faculty_member` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Poole', 'Bronny', 'bpoole3@ifeng.com', '["Professor"]');
INSERT INTO `faculty_member` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Dalyell', 'Winny', 'wdalyell4@yellowbook.com', '["Professor"]');
INSERT INTO `faculty_member` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Skerritt', 'Ame', 'askerritt5@guardian.co.uk', '["Professor"]');
INSERT INTO `faculty_member` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Donaghie', 'Chad', 'cdonaghie6@sourceforge.net', '["Professor"]');
INSERT INTO `faculty_member` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Cleef', 'Reamonn', 'rcleef7@umich.edu', '["Professor"]');
INSERT INTO `faculty_member` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Truran', 'Buiron', 'btruran8@mashable.com', '["Professor"]');


---- ONLY COMMITTEE MEMBER ROLE ----

INSERT INTO `faculty_member` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Edgeon', 'Joeann', 'jedgeon9@reverbnation.com', '["Committee Member"]');
INSERT INTO `faculty_member` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Allbones', 'Byrom', 'ballbonesa@cam.ac.uk', '["Committee Member"]');
INSERT INTO `faculty_member` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Laville', 'Hillier', 'hlavilleb@hc360.com', '["Committee Member"]');
INSERT INTO `faculty_member` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Satteford', 'Alida', 'asattefordc@cnet.com', '["Committee Member"]');


---- ADMIN & PROFESSOR ROLE ----

INSERT INTO `faculty_member` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Chesher', 'Susanna', 'schesherd@scientificamerican.com', 
    '["Admin", "Professor"]');
INSERT INTO `faculty_member` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Kubera', 'Jenna', 'jkuberae@techcrunch.com', '["Admin", "Professor"]');

---- ADMIN & COMMITTEE MEMBER ROLE ----

INSERT INTO `faculty_member` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('von', 'Brakespear', 'Von', 'vbrakespearf@e-recht24.de', '["Admin", "Committee Member"]');
INSERT INTO `faculty_member` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Dahlen', 'Davine', 'ddahleng@odnoklassniki.ru', '["Admin", "Committee Member"]');

---- PROFESSOR & COMMITTEE MEMBER ROLE ----

INSERT INTO `faculty_member` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Mahomet', 'Moyna', 'mmahometh@rediff.com', '["Professor", "Committee Member"]');
INSERT INTO `faculty_member` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Bennough', 'Willamina', 'wbennoughi@jigsy.com', '["Professor", "Committee Member"]');


---- ADMIN & PROFESSOR & COMMITTEE MEMBER ROLE ----

INSERT INTO `faculty_member` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, 
    `fm_Roles`) VALUES ('admin', 'Doe', 'John', 'john_doe@example.com', 
    '["Admin", "Professor", "Committee Member"]');
INSERT INTO `faculty_member` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, 
    `fm_Roles`) VALUES ('admin2', 'Roberston', 
    'John', 'john_r@example.com', '["Admin", "Professor", "Committee Member"]');
