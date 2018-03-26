-- This SQL file is copyright for the EECS graduate program application --
-- Latest MySQL working version for this file: 5.7.21 --

---- Committee Reviewed Applications (15) ----


-- Accepted by University, Accepted by Student
INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `letterDate`, 
    `programDecision`, `studentDecision`, `ygsAwarded`) VALUES 
    (212123456, 'Fall', 'Rubina', 'Went', 'rwent0@discovery.com', 'F', 'A', 1, 'MASc',
    'Visa', '["A"]', 1, 
    '["Artificial Intelligence", "Embedded Systems", "Data Mining"]', 
    '["Sheff Boneham", "Buiron Truran"]', '["Sheff Boneham"]', 
    '["Sheff Boneham"]', CURRENT_TIMESTAMP, 'Accepted', 'Accepted', 1);

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `letterDate`, 
    `programDecision`, `studentDecision`, `ygsAwarded`) VALUES  
    (212123455, 'Fall', 'Genni', 'Bittlestone', 'gbittlestone1@telegraph.co.uk', 'F', 'A', 
    1, 'PhD', 'Visa', '["A+"]', 1, '["Human-Computer Interaction", 
    "Micro/Nano Electronic Systems", "Software Engineering"]', 
    '["Susanna Chesher", "Chad Donaghie"]', '["Chad Donaghie"]', 
    '["Chad Donaghie"]', CURRENT_TIMESTAMP, 'Accepted', 'Accepted', 1);

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `letterDate`, 
    `programDecision`, `studentDecision`, `ygsAwarded`) VALUES  
    (212123454, 'Winter', 'Cirstoforo', 'Truett', 'ctruett2@nasa.gov', 'M', 'A+', 1, 
    'PhD', 'Visa', '["A"]', 1, '["Human-Computer Interaction", 
    "Micro/Nano Electronic Systems", "Software Engineering"]', 
    '["Susanna Chesher", "Chad Donaghie"]', 
    '["Chad Donaghie", "Susanna Chesher"]', 
    '["Susanna Chesher"]', CURRENT_TIMESTAMP, 'Accepted', 'Accepted', 1);

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `letterDate`, 
    `programDecision`, `studentDecision`, `ygsAwarded`) VALUES 
    (212123453, 'Winter', 'Birgitta', 'Bohlsen', 'bbohlsenk@cafepress.com', 'F', 'A', 0,
    'MSc', 'Visa', '["B+"]', 1, 
    '["Bioinformatics", "Embedded Systems", "Data Mining"]', 
    '["Sheff Boneham", "Buiron Truran", "Reamonn Cleef"]', '["Reamonn Cleef"]', 
    '["Reamonn Cleef"]', CURRENT_TIMESTAMP, 'Accepted', 'Accepted', 0);

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `letterDate`, 
    `programDecision`, `studentDecision`, `ygsAwarded`) VALUES 
    (212123452, 'Summer', 'Dave', 'Goutcher', 'dgoutcherr@godaddy.com', 'M', 'A+', 0, 
    'PhD', 'Domestic', '["A+", "B+"]', 1, '["Artificial Intelligence", "Graph Mining"]',
    '["Winny Dalyell", "Buiron Truran"]', '["Winny Dalyell", "Buiron Truran"]', 
    '["Buiron Truran"]', CURRENT_TIMESTAMP, 'Accepted', 'Accepted', 1);

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `letterDate`, 
    `programDecision`, `studentDecision`, `ygsAwarded`) VALUES  
    (212123451, 'Summer', 'Panchito', 'Barnett', 'pbarnett13@guardian.co.uk', 'M', 'B+', 
    1, 'MASc', 'Visa', '["B+"]', 1, '["Artificial Intelligence", "Graph Mining"]',
    '["Winny Dalyell", "Buiron Truran"]', '["Winny Dalyell", "Buiron Truran"]', 
    '["Buiron Truran"]', CURRENT_TIMESTAMP, 'Accepted', 'Accepted', 0);

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `letterDate`, 
    `programDecision`, `studentDecision`, `ygsAwarded`) VALUES 
    (212123450, 'Fall', 'Krishnah', 'Estick', 'kestick1c@hubpages.com', 'M', 'B+', 1, 
    'MSc', 'Domestic', '["B+", "A"]', 1, 
    '["Distributed Computing", "Performance Engineering", "Computer Vision"]',
    '["Winny Dalyell", "Buiron Truran", "Susanna Chesher"]', 
    '["Winny Dalyell", "Buiron Truran"]', 
    '["Buiron Truran"]', CURRENT_TIMESTAMP, 'Accepted', 'Accepted', 0);


-- Accepted by University, Reject by Student
INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `programDecision`, 
    `studentDecision`, `declineReason`) VALUES 
    (212123446, 'Winter', 'Tricia', 'Kesey', 'tkesey9@wp.com', 'F', 'B+', 1, 'MSc', 
    'Visa', '["B+"]', 1, 
    '["Artificial Intelligence", "Embedded Systems", "Data Mining"]',
    '["Sheff Boneham", "Buiron Truran"]', '["Sheff Boneham"]', 
    '["Sheff Boneham"]', 'Accepted', 'Declined', 'N/A');

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `programDecision`, 
    `studentDecision`, `declineReason`) VALUES 
    (212123436, 'Fall', 'Caryl', 'Strongitharm', 'cstrongitharmg@foxnews.com', 'M', 'B+', 
    0, 'MASc', 'Domestic', '["B+", "B+"]', 1, 
    '["Artificial Intelligence", "Graph Mining"]',
    '["Winny Dalyell", "Buiron Truran"]', '["Winny Dalyell", "Buiron Truran"]', 
    '["Buiron Truran"]', 'Accepted', 'Declined', 
    'Accepted offer from other university.');

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `profContacted`, `profRequested`, `programDecision`, 
    `studentDecision`, `declineReason`) VALUES  
    (212123426, 'Summer', 'Aurelea', 'Gerrill', 'agerrillt@addtoany.com', 'F', 'B+', 0, 
    'PhD', 'Domestic', '["B+", "A"]', 1, 
    '["Bioinformatics", "Embedded Systems", "Data Mining"]', 
    '["Sheff Boneham", "Buiron Truran", "Reamonn Cleef"]', '["Reamonn Cleef"]', 
    '["Reamonn Cleef"]', 'Accepted', 'Declined', 
    'Not interested in the university anymore.');


-- Declined by University --
INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `programDecision`, `declineReason`) VALUES 
    (212123416, 'Winter', 'O''Halloran', 'Carley', 'cohalloran1@cargocollective.com', 
    'F', 'D+', 0, 'MSc', 'Visa', '["C"]', 1, 
    '["Artificial Intelligence", "Embedded Systems", "Data Mining"]',
    '["Sheff Boneham", "Buiron Truran"]', 'Declined',
    'GPA is below minimum requirement.');

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `programDecision`, `declineReason`) VALUES 
    (212123406, 'Winter', 'McQuade', 'Perry', 'pmcquade4@tiny.cc', 'M', 'C+', 1, 'MSc', 
    'Visa', '["C"]', 1, '["Data Mining"]', '["Bronny Poole"]', 'Declined',
    'GPA is below minimum requirement.');

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `programDecision`, `declineReason`) VALUES 
    (212123356, 'Fall', 'Really', 'Chrysa', 'creally5@live.com', 'F', 'E', 0, 'PhD', 
    'Domestic', '["C", "B"]', 1, 
    '["Bioinformatics", "Embedded Systems", "Data Mining"]', 
    '["Sheff Boneham", "Buiron Truran", "Reamonn Cleef"]', 'Declined',
    'GPA is below minimum requirement.');

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `programDecision`, `declineReason`) VALUES 
    (212123256, 'Winter', 'De Hoogh', 'Alexandro', 'adehoogh8@uiuc.edu', 'M', 'C+', 1, 
    'PhD', 'Visa', '["C"]', 1, 
    '["Machine Learning", "Data Mining"]', 
    '["Jenna Kubera", "Buiron Truran", "Reamonn Cleef"]', 'Declined',
    'GPA is below minimum requirement.');

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `Rank`, `committeeReviewed`, `FOI`, 
    `prefProfs`, `programDecision`, `declineReason`) VALUES (212123156, 'Winter', 
    'Thaxton', 'Delilah', 'dthaxton9@delicious.com', 'F', 'C', 0, 'MSc', 
    'Domestic', '["C", "B"]', 1, 
    '["Biomedical Engineering", "Software Engineering", "Graph Mining"]', 
    '["Sheff Boneham", "Jenna Kubera", "Reamonn Cleef"]', 'Declined',
    'GPA is below minimum requirement.');



---- Committee Non-Reviewed Applications (10) ----

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES 
    (212123056, 'Summer', 'Borrel', 'Glennis', 'gborrela@shinystat.com', 'F', 'A', 0, 'MSc', 
    'Domestic', 0, '["Machine Learning", "Data Mining"]', 
    '["Jenna Kubera", "Buiron Truran", "Reamonn Cleef"]');

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES  
    (212122456, 'Fall', 'Tirte', 'Igor', 'itirteb@ifeng.com', 'M', 'C+', 0, 'MSc', 
    'Domestic', 0, '["Data Mining"]', '["Bronny Poole"]');

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES (212121456, 'Winter',
    'Oakwell', 'Fulvia', 'foakwelld@examiner.com', 'F', 'D+', 0, 'MSc', 
    'Domestic', 0, '["Artificial Intelligence", "Graph Mining"]',
    '["Winny Dalyell", "Buiron Truran"]');

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES (212120456, 'Fall',
    'Enbury', 'Ciro', 'cenburye@jigsy.com', 'M', 'F', 0, 'MASc', 'Domestic', 
    0, '["Human-Computer Interaction", 
    "Micro/Nano Electronic Systems", "Software Engineering"]', 
    '["Susanna Chesher", "Chad Donaghie"]');

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES (212113456, 'Fall', 
    'Sywell', 'Celestine', 'csywellg@guardian.co.uk', 'F', 'A', 1, 'PhD', 
    'Domestic', 0, '["Bioinformatics", "Embedded Systems", "Data Mining"]', 
    '["Sheff Boneham", "Buiron Truran", "Reamonn Cleef"]');

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES  (212103456, 'Fall', 'Poag', 'Cos', 'cpoagj@imdb.com', 'M', 'C', 1, 
    'PhD', 'Domestic', 0, 
    '["Distributed Computing", "Performance Engineering", "Computer Vision"]',
    '["Winny Dalyell", "Buiron Truran", "Susanna Chesher"]');

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES  
    (212023456, 'Winter', 'Foxen', 'Fleurette', 'ffoxen0@google.it', 'F', 'A+', 1, 'MSc', 
    'Domestic', 0, '["Artificial Intelligence", "Graph Mining"]',
    '["Winny Dalyell", "Buiron Truran"]');

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES
    (212423456, 'Winter', 'Shorey', 'Erica', 'eshorey2@slate.com', 'F', 'A+', 0, 'MASc', 
    'Visa', 0, '["Machine Learning", "Data Mining"]', 
    '["Jenna Kubera", "Buiron Truran", "Reamonn Cleef"]');

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES (212523456,'Summer', 
    'Orta', 'Hazel', 'horta3@hp.com', 'F', 'C+', 0, 'PhD', 'Domestic', 0, 
    '["Biomedical Engineering", "Software Engineering", "Graph Mining"]', 
    '["Sheff Boneham", "Jenna Kubera", "Reamonn Cleef"]');

INSERT INTO `APPLICATION` (`student_Id`, `app_Session`, `LName`, `FName`, `Email`, `Gender`, 
    `GPA`, `GPA_FINAL`, `Degree`, `VStatus`, `committeeReviewed`, `FOI`, 
    `prefProfs`) VALUES
    (212623456, 'Summer', 'Sautter', 'Doy', 'dsautter6@bbb.org', 'M', 'C', 1, 'MASc', 
    'Domestic', 0, '["Machine Learning", "Data Mining"]', 
    '["Jenna Kubera", "Buiron Truran", "Reamonn Cleef"]');
