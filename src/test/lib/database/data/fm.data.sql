-- This SQL file is copyright for the EECS graduate program application --
-- Latest MySQL working version for this file: 5.7.21 --

/****************** Insertion into `FACULTY_MEMBER` table ******************/

/****************** FAKE FACULTY MEMBER DATA ******************/

---- ONLY ADMIN ROLE ----

INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('arri', 'Cristofolo', 'Arri', 'acristofolo0@furl.net', '["Admin"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('sophey', 'Dearlove', 'Sophey', 'sdearlove1@usnews.com', '["Admin"]');


---- ONLY PROFESSOR ROLE ----

INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('sboneham', 'Boneham', 'Sheff', 'sboneham2@aol.com', '["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('bpoole', 'Poole', 'Bronny', 'bpoole3@ifeng.com', '["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('wdalyell', 'Dalyell', 'Winny', 'wdalyell4@yellowbook.com', '["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('askerrit', 'Skerritt', 'Ame', 'askerritt5@guardian.co.uk', '["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('cdonaghie', 'Donaghie', 'Chad', 'cdonaghie6@sourceforge.net', '["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('rcleef', 'Cleef', 'Reamonn', 'rcleef7@umich.edu', '["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('btruran', 'Truran', 'Buiron', 'btruran8@mashable.com', '["Professor"]');


---- ONLY COMMITTEE MEMBER ROLE ----

INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('jedgeon', 'Edgeon', 'Joeann', 'jedgeon9@reverbnation.com', '["Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('ballbones', 'Allbones', 'Byrom', 'ballbonesa@cam.ac.uk', '["Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('hlaville', 'Laville', 'Hillier', 'hlavilleb@hc360.com', '["Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('asatteford', 'Satteford', 'Alida', 'asattefordc@cnet.com', '["Committee Member"]');


---- ADMIN & PROFESSOR ROLE ----

INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('scheser', 'Chesher', 'Susanna', 'schesherd@scientificamerican.com',
    '["Admin", "Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('jkubera', 'Kubera', 'Jenna', 'jkuberae@techcrunch.com', '["Admin", "Professor"]');

---- ADMIN & COMMITTEE MEMBER ROLE ----

INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('von', 'Brakespear', 'Von', 'vbrakespearf@e-recht24.de', '["Admin", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('davine', 'Dahlen', 'Davine', 'ddahleng@odnoklassniki.ru', '["Admin", "Committee Member"]');

---- PROFESSOR & COMMITTEE MEMBER ROLE ----

INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('mmahomet', 'Mahomet', 'Moyna', 'mmahometh@rediff.com', '["Professor", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('wbennough', 'Bennough', 'Willamina', 'wbennoughi@jigsy.com', '["Professor", "Committee Member"]');


---- ADMIN & PROFESSOR & COMMITTEE MEMBER ROLE ----

INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`,
    `fm_Roles`) VALUES ('admin', 'Doe', 'John', 'john_doe@example.com',
    '["Admin", "Professor", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`,
    `fm_Roles`) VALUES ('admin2', 'Roberston',
    'John', 'john_r@example.com', '["Admin", "Professor", "Committee Member"]');


/****************** ACTUAL FACULTY MEMBER DATA ******************/

---- ADMIN ROLE ----
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('ouma', 'Jaipaul-Gill', 'Ouma', 'gradasst@eecs.yorku.ca', '["Admin"]');

---- ADMIN, PROFESSOR, COMMITTEE MEMBER ROLE ----
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`)
    VALUES ('franck', 'van Breugel', 'Franck', 'franck@eecs.yorku.ca',
    '["Admin", "Professor", "Committee Member"]');

---- PROFESSOR & COMMITTEE MEMBER ROLE ----
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('papaggel', 'Papangelis', 'Emmanouil','["Professor", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('jxu', 'Xu', 'Jia','["Professor", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('mkyan', 'Kyan', 'Matthew J','["Professor", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('lesperan', 'Lesperance', 'Yves','["Professor", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('mbrown', 'Brown', 'Michael S.','["Professor", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('hossein', 'Kassiri', 'Hossein','["Professor", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('johnlam', 'Lam', 'John','["Professor", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('zmjiang', 'Jiang', 'Zhen Ming','["Professor", "Committee Member"]');

---- PROFESSOR ROLE ----
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('aboelaze', 'Aboelaze', 'Mokhtar','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('ifruend', 'Fruend', 'Ingo','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('hmkim', 'Kim', 'Henry M','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('rfm', 'Murray', 'Richard F','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('mab', 'Brubaker', 'Marcus','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('hefarag', 'Farag', 'Hany E. Z.','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('egz', 'Ghafar-Zadeh', 'Ebrahim','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('grau', 'Grau', 'Gerd','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('hooshyar', 'Hooshyar', 'Ali','["Professor"]');

/*INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES ('Lee', 'Regina S. K.','["Professor"]');*/

INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('pisana', 'Pisana', 'Simone','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('rezaei', 'Rezaei Zare', 'Afshin','["Professor"]');

/*INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES ('Sadeghi-Naini', 'Ali','["Professor"]');*/

INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('sodagar', 'Sodagar', 'Amir','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('tsotsos', 'Tsotsos', 'John K','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('ruth', 'Urner', 'Ruth','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('vlajic', 'Vlajic', 'Natalija','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
('grrrwaaa', 'Wakefield', 'Graham','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('allison', 'Allison', 'Robert S','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('aan', 'An', 'Aijun','["Professor"]');

INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('mb', 'Balijko', 'Melanie A','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('datta', 'Datta', 'Suprakash','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('patrick', 'Dymond', 'Patrick','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('aeckford', 'Eckford', 'Andrew W.','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('jeff', 'Edmonds', 'Jeffrey A','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
('jelder', 'Elder', 'James Harvey','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('pfal', 'Faloutsos', 'Petros','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('godfrey', 'Godfrey', 'Parke Tremayne','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('jarek', 'Gryz', 'Jarek','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('hornsey', 'Hornsey', 'Richard I','["Professor"]');

INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('jhuang', 'Huang', 'Xiangji','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('jenkin', 'Jenkin', 'Michael R','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('hj', 'Jiang', 'Hui','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('peterlian', 'Lian', 'Yong Peter','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('liaskos', 'Liaskos', 'Sotirios','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('mlitoiu','Litoiu', 'Marin','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('burton', 'Ma', 'Burton','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('mack', 'MacKenzie', 'I Scott','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('magiero', 'Magierowski', 'Sebastian','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('utn', 'Nguyen', 'Uyen T','["Professor"]');

INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('jonathan', 'Ostroff', 'Jonathan','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('ruppert', 'Ruppert', 'Eric','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('zbigniew', 'Stachniak', 'Zbigniew','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('gt', 'Tourlakis', 'George','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('bil', 'Tzerpos', 'Vassilios','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('wildes', 'Wildes', 'Richard P','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES
    ('xhyu', 'Yu', 'Xiaohui','["Professor"]');
