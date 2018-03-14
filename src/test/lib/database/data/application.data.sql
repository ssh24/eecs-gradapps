-- This SQL file is copyright for the EECS graduate program application --
-- Latest MySQL working version for this file: 5.7.21 --

---- Committee Reviewed Applications (15) ----


-- Accepted by University, Accepted by Student
INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `letterDate`, 
    `programDecision`, `studentDecision`, `ygsAwarded`) VALUES 
    ('Fall', 'Rubina', 'Went', 'rwent0@discovery.com', 'F', 'A', 1, 'MASc',
    'Visa', '["A"]', 1, 
    '["Artificial Intelligence", "Embedded Systems", "Data Mining"]', 
    '["Sheff Boneham", "Buiron Truran"]', '["Sheff Boneham"]', 
    '["Sheff Boneham"]', CURRENT_TIMESTAMP, 'Accepted', 'Accepted', 1);

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `letterDate`, 
    `programDecision`, `studentDecision`, `ygsAwarded`) VALUES  
    ('Fall', 'Genni', 'Bittlestone', 'gbittlestone1@telegraph.co.uk', 'F', 'A', 
    1, 'PhD', 'Visa', '["A+"]', 1, '["Human-Computer Interaction", 
    "Micro/Nano Electronic Systems", "Software Engineering"]', 
    '["Susanna Chesher", "Chad Donaghie"]', '["Chad Donaghie"]', 
    '["Chad Donaghie"]', CURRENT_TIMESTAMP, 'Accepted', 'Accepted', 1);

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `letterDate`, 
    `programDecision`, `studentDecision`, `ygsAwarded`) VALUES  
    ('Winter', 'Cirstoforo', 'Truett', 'ctruett2@nasa.gov', 'M', 'A+', 1, 
    'PhD', 'Visa', '["A"]', 1, '["Human-Computer Interaction", 
    "Micro/Nano Electronic Systems", "Software Engineering"]', 
    '["Susanna Chesher", "Chad Donaghie"]', 
    '["Chad Donaghie", "Susanna Chesher"]', 
    '["Susanna Chesher"]', CURRENT_TIMESTAMP, 'Accepted', 'Accepted', 1);

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `letterDate`, 
    `programDecision`, `studentDecision`, `ygsAwarded`) VALUES 
    ('Winter', 'Birgitta', 'Bohlsen', 'bbohlsenk@cafepress.com', 'F', 'A', 0,
    'MSc', 'Visa', '["B+"]', 1, 
    '["Bioinformatics", "Embedded Systems", "Data Mining"]', 
    '["Sheff Boneham", "Buiron Truran", "Reamonn Cleef"]', '["Reamonn Cleef"]', 
    '["Reamonn Cleef"]', CURRENT_TIMESTAMP, 'Accepted', 'Accepted', 0);

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `letterDate`, 
    `programDecision`, `studentDecision`, `ygsAwarded`) VALUES 
    ('Summer', 'Dave', 'Goutcher', 'dgoutcherr@godaddy.com', 'M', 'A+', 0, 
    'PhD', 'Domestic', '["A+", "B+"]', 1, '["Artificial Intelligence", "Graph Mining"]',
    '["Winny Dalyell", "Buiron Truran"]', '["Winny Dalyell", "Buiron Truran"]', 
    '["Buiron Truran"]', CURRENT_TIMESTAMP, 'Accepted', 'Accepted', 1);

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `letterDate`, 
    `programDecision`, `studentDecision`, `ygsAwarded`) VALUES  
    ('Summer', 'Panchito', 'Barnett', 'pbarnett13@guardian.co.uk', 'M', 'B+', 
    1, 'MASc', 'Visa', '["B+"]', 1, '["Artificial Intelligence", "Graph Mining"]',
    '["Winny Dalyell", "Buiron Truran"]', '["Winny Dalyell", "Buiron Truran"]', 
    '["Buiron Truran"]', CURRENT_TIMESTAMP, 'Accepted', 'Accepted', 0);

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `letterDate`, 
    `programDecision`, `studentDecision`, `ygsAwarded`) VALUES 
    ('Fall', 'Krishnah', 'Estick', 'kestick1c@hubpages.com', 'M', 'B+', 1, 
    'MSc', 'Domestic', '["B+", "A"]', 1, 
    '["Distributed Computing", "Performance Engineering", "Computer Vision"]',
    '["Winny Dalyell", "Buiron Truran", "Susanna Chesher"]', 
    '["Winny Dalyell", "Buiron Truran"]', 
    '["Buiron Truran"]', CURRENT_TIMESTAMP, 'Accepted', 'Accepted', 0);


-- Accepted by University, Reject by Student
INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `programDecision`, 
    `studentDecision`, `declineReason`) VALUES 
    ('Winter', 'Tricia', 'Kesey', 'tkesey9@wp.com', 'F', 'B+', 1, 'MSc', 
    'Visa', '["B+"]', 1, 
    '["Artificial Intelligence", "Embedded Systems", "Data Mining"]',
    '["Sheff Boneham", "Buiron Truran"]', '["Sheff Boneham"]', 
    '["Sheff Boneham"]', 'Accepted', 'Declined', 'N/A');

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `programDecision`, 
    `studentDecision`, `declineReason`) VALUES 
    ('Fall', 'Caryl', 'Strongitharm', 'cstrongitharmg@foxnews.com', 'M', 'B+', 
    0, 'MASc', 'Domestic', '["B+", "B+"]', 1, 
    '["Artificial Intelligence", "Graph Mining"]',
    '["Winny Dalyell", "Buiron Truran"]', '["Winny Dalyell", "Buiron Truran"]', 
    '["Buiron Truran"]', 'Accepted', 'Declined', 
    'Accepted offer from other university.');

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `programDecision`, 
    `studentDecision`, `declineReason`) VALUES  
    ('Summer', 'Aurelea', 'Gerrill', 'agerrillt@addtoany.com', 'F', 'B+', 0, 
    'PhD', 'Domestic', '["B+", "A"]', 1, 
    '["Bioinformatics", "Embedded Systems", "Data Mining"]', 
    '["Sheff Boneham", "Buiron Truran", "Reamonn Cleef"]', '["Reamonn Cleef"]', 
    '["Reamonn Cleef"]', 'Accepted', 'Declined', 
    'Not interested in the university anymore.');


-- Declined by University --
INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `programDecision`, `declineReason`) VALUES 
    ('Winter', 'O''Halloran', 'Carley', 'cohalloran1@cargocollective.com', 
    'F', 'D+', 0, 'MSc', 'Visa', '["C"]', 1, 
    '["Artificial Intelligence", "Embedded Systems", "Data Mining"]',
    '["Sheff Boneham", "Buiron Truran"]', 'Declined',
    'GPA is below minimum requirement.');

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `programDecision`, `declineReason`) VALUES 
    ('Winter', 'McQuade', 'Perry', 'pmcquade4@tiny.cc', 'M', 'C+', 1, 'MSc', 
    'Visa', '["C"]', 1, '["Data Mining"]', '["Bronny Poole"]', 'Declined',
    'GPA is below minimum requirement.');

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `programDecision`, `declineReason`) VALUES 
    ('Fall', 'Really', 'Chrysa', 'creally5@live.com', 'F', 'E', 0, 'PhD', 
    'Domestic', '["C", "B"]', 1, 
    '["Bioinformatics", "Embedded Systems", "Data Mining"]', 
    '["Sheff Boneham", "Buiron Truran", "Reamonn Cleef"]', 'Declined',
    'GPA is below minimum requirement.');

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `programDecision`, `declineReason`) VALUES 
    ('Winter', 'De Hoogh', 'Alexandro', 'adehoogh8@uiuc.edu', 'M', 'C+', 1, 
    'PhD', 'Visa', '["C"]', 1, 
    '["Machine Learning", "Data Mining"]', 
    '["Jenna Kubera", "Buiron Truran", "Reamonn Cleef"]', 'Declined',
    'GPA is below minimum requirement.');

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `programDecision`, `declineReason`) VALUES ('Winter', 
    'Thaxton', 'Delilah', 'dthaxton9@delicious.com', 'F', 'C', 0, 'MSc', 
    'Domestic', '["C", "B"]', 1, 
    '["Biomedical Engineering", "Software Engineering", "Graph Mining"]', 
    '["Sheff Boneham", "Jenna Kubera", "Reamonn Cleef"]', 'Declined',
    'GPA is below minimum requirement.');



---- Committee Non-Reviewed Applications (10) ----

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES 
    ('Summer', 'Borrel', 'Glennis', 'gborrela@shinystat.com', 'F', 'A', 0, 'MSc', 
    'Domestic', 0, '["Machine Learning", "Data Mining"]', 
    '["Jenna Kubera", "Buiron Truran", "Reamonn Cleef"]');

INSERT INTO `APPLICATION` (`app_Session`, `app_Date`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES  
    ('Fall', '2018/03/05', 'Tirte', 'Igor', 'itirteb@ifeng.com', 'M', 'C+', 0, 'MSc', 
    'Domestic', 0, '["Data Mining"]', '["Bronny Poole"]');

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES ('Winter',
    'Oakwell', 'Fulvia', 'foakwelld@examiner.com', 'F', 'D+', 0, 'MSc', 
    'Domestic', 0, '["Artificial Intelligence", "Graph Mining"]',
    '["Winny Dalyell", "Buiron Truran"]');

INSERT INTO `APPLICATION` (`app_Session`, `app_Date`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES ('Fall', '2018/06/30',
    'Enbury', 'Ciro', 'cenburye@jigsy.com', 'M', 'F', 0, 'MASc', 'Domestic', 
    0, '["Human-Computer Interaction", 
    "Micro/Nano Electronic Systems", "Software Engineering"]', 
    '["Susanna Chesher", "Chad Donaghie"]');

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES ('Fall', 
    'Sywell', 'Celestine', 'csywellg@guardian.co.uk', 'F', 'A', 1, 'PhD', 
    'Domestic', 0, '["Bioinformatics", "Embedded Systems", "Data Mining"]', 
    '["Sheff Boneham", "Buiron Truran", "Reamonn Cleef"]');

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES  ('Fall', 'Poag', 'Cos', 'cpoagj@imdb.com', 'M', 'C', 1, 
    'PhD', 'Domestic', 0, 
    '["Distributed Computing", "Performance Engineering", "Computer Vision"]',
    '["Winny Dalyell", "Buiron Truran", "Susanna Chesher"]');

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES  
    ('Winter', 'Foxen', 'Fleurette', 'ffoxen0@google.it', 'F', 'A+', 1, 'MSc', 
    'Domestic', 0, '["Artificial Intelligence", "Graph Mining"]',
    '["Winny Dalyell", "Buiron Truran"]');

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES
    ('Winter', 'Shorey', 'Erica', 'eshorey2@slate.com', 'F', 'A+', 0, 'MASc', 
    'Visa', 0, '["Machine Learning", "Data Mining"]', 
    '["Jenna Kubera", "Buiron Truran", "Reamonn Cleef"]');

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES ('Summer', 
    'Orta', 'Hazel', 'horta3@hp.com', 'F', 'C+', 0, 'PhD', 'Domestic', 0, 
    '["Biomedical Engineering", "Software Engineering", "Graph Mining"]', 
    '["Sheff Boneham", "Jenna Kubera", "Reamonn Cleef"]');

INSERT INTO `APPLICATION` (`app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES
    ('Summer', 'Sautter', 'Doy', 'dsautter6@bbb.org', 'M', 'C', 1, 'MASc', 
    'Domestic', 0, '["Machine Learning", "Data Mining"]', 
    '["Jenna Kubera", "Buiron Truran", "Reamonn Cleef"]');
