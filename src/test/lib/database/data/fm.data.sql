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

INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Boneham', 'Sheff', 'sboneham2@aol.com', '["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Poole', 'Bronny', 'bpoole3@ifeng.com', '["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Dalyell', 'Winny', 'wdalyell4@yellowbook.com', '["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Skerritt', 'Ame', 'askerritt5@guardian.co.uk', '["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Donaghie', 'Chad', 'cdonaghie6@sourceforge.net', '["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Cleef', 'Reamonn', 'rcleef7@umich.edu', '["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Truran', 'Buiron', 'btruran8@mashable.com', '["Professor"]');


---- ONLY COMMITTEE MEMBER ROLE ----

INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Edgeon', 'Joeann', 'jedgeon9@reverbnation.com', '["Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Allbones', 'Byrom', 'ballbonesa@cam.ac.uk', '["Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Laville', 'Hillier', 'hlavilleb@hc360.com', '["Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Satteford', 'Alida', 'asattefordc@cnet.com', '["Committee Member"]');


---- ADMIN & PROFESSOR ROLE ----

INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Chesher', 'Susanna', 'schesherd@scientificamerican.com', 
    '["Admin", "Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Kubera', 'Jenna', 'jkuberae@techcrunch.com', '["Admin", "Professor"]');

---- ADMIN & COMMITTEE MEMBER ROLE ----

INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Brakespear', 'Von', 'vbrakespearf@e-recht24.de', '["Admin", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Dahlen', 'Davine', 'ddahleng@odnoklassniki.ru', '["Admin", "Committee Member"]');

---- PROFESSOR & COMMITTEE MEMBER ROLE ----

INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Mahomet', 'Moyna', 'mmahometh@rediff.com', '["Professor", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Bennough', 'Willamina', 'wbennoughi@jigsy.com', '["Professor", "Committee Member"]');


---- ADMIN & PROFESSOR & COMMITTEE MEMBER ROLE ----

INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, 
    `fm_Roles`) VALUES ('admin', 'Doe', 'John', 'john_doe@example.com', 
    '["Admin", "Professor", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, 
    `fm_Roles`, `is_LoggedIn`, `selectedRole`) VALUES ('admin2', 'Roberston', 
    'John', 'john_r@example.com', '["Admin", "Professor", "Committee Member"]', 
    1, 'Professor');


/****************** ACTUAL FACULTY MEMBER DATA ******************/

---- ADMIN ROLE ----
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('Jaipaul-Gill', 'Ouma', 'gradasst@eecs.yorku.ca', '["Admin"]');

---- ADMIN, PROFESSOR, COMMITTEE MEMBER ROLE ----
INSERT INTO `FACULTY_MEMBER` (`fm_Username`, `fm_Lname`, `fm_Fname`, `fm_Email`, `fm_Roles`) 
    VALUES ('franck', 'van Breugel', 'Franck', 'franck@eecs.yorku.ca', 
    '["Admin", "Professor", "Committee Member"]');

---- PROFESSOR & COMMITTEE MEMBER ROLE ----
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Papangelis', 'Emmanouil','["Professor", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Xu', 'Jia','["Professor", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Kyan', 'Matthew J','["Professor", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Lesperance', 'Yves','["Professor", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Brown', 'Michael S.','["Professor", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Kassiri', 'Hossein','["Professor", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Lam', 'John','["Professor", "Committee Member"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Jiang', 'Zhen Ming','["Professor", "Committee Member"]');

---- PROFESSOR ROLE ----
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Aboelaze', 'Mokhtar','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Fruend', 'Ingo','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Kim', 'Henry M','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Murray', 'Richard F','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Brubaker', 'Marcus','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Farag', 'Hany E. Z.','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Ghafar-Zadeh', 'Ebrahim','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Grau', 'Gerd','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Hooshyar', 'Ali','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Lee', 'Regina S. K.','["Professor"]');

INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Pisana', 'Simone','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Rezaei Zare', 'Afshin','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Sadeghi-Naini', 'Ali','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Sodagar', 'Amir','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Tsotsos', 'John K','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Urner', 'Ruth','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Vlajic', 'Natalija','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Wakefield', 'Graham','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Allison', 'Robert S','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('An', 'Aijun','["Professor"]');

INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Balijko', 'Melanie A','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Datta', 'Suprakash','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Dymond', 'Patrick','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Eckford', 'Andrew W.','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Edmonds', 'Jeffrey A','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Elder', 'James Harvey','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Faloutsos', 'Petros','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Godfrey', 'Parke Tremayne','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Gryz', 'Jarek','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Hornsey', 'Richard I','["Professor"]');

INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Huang', 'Xiangji','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Jenkin', 'Michael R','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Jiang', 'Hui','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Lian', 'Yong Peter','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Liaskos', 'Sotirios','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Litoiu', 'Marin','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Ma', 'Burton','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('MacKenzie', 'I Scott','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Magierowski', 'Sebastian','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Nguyen', 'Uyen T','["Professor"]');

INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Ostroff', 'Jonathan','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Ruppert', 'Eric','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Stachniak', 'Zbigniew','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Tourlakis', 'George','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Tzerpos', 'Vassilios','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Wildes', 'Richard P','["Professor"]');
INSERT INTO `FACULTY_MEMBER` (`fm_Lname`, `fm_Fname`, `fm_Roles`) VALUES 
    ('Yu', 'Xiaohui','["Professor"]');
