-- This SQL file is copyright for the EECS graduate program application --
-- Latest MySQL working version for this file: 5.7.21 --

/** For simplicity, 
i) whenever an application is seen, the logic to check if the
user is a professor needs to be done in programatical logic rather than 
trigger. This is because writing triggers for such logics become extremely 
complicated.
**/

INSERT INTO `application_seen` (`fmId`, `appId`, `seen`) 
    VALUES (3, 15, 1);
INSERT INTO `application_seen` (`fmId`, `appId`, `seen`) 
    VALUES (3, 9, 1);
INSERT INTO `application_seen` (`fmId`, `appId`, `seen`) 
    VALUES (5, 9, 1);
INSERT INTO `application_seen` (`fmId`, `appId`, `seen`) 
    VALUES (6, 15, 0);
INSERT INTO `application_seen` (`fmId`, `appId`, `seen`) 
    VALUES (3, 8, 0);
INSERT INTO `application_seen` (`fmId`, `appId`, `seen`) 
    VALUES (4, 9, 1);
INSERT INTO `application_seen` (`fmId`, `appId`, `seen`) 
    VALUES (7, 15, 0);
INSERT INTO `application_seen` (`fmId`, `appId`, `seen`) 
    VALUES (7, 20, 0);
