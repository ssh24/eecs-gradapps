-- This SQL file is copyright for the EECS graduate program application --
-- Latest MySQL working version for this file: 5.7.21 --

/** For simplicity, 
i) whenever TWO review's are submitted the Application is updated 
(i.e `committeeReviewed` becomes 1), however to calculate the average 
rank grade, a more sophisticated logic is needed and hence needs to be done 
in Node.js logic.
ii) whenever a new application is sent out for review, the logic to check if the
user is a committee member needs to be done in programatical logic rather than 
trigger. This is because writing triggers for such logics become extremely 
complicated.
**/

INSERT INTO `APPLICATION_REVIEW` (`committeeId`, `appId`, `c_Rank`, `Status`) 
    VALUES (11, 12, 'B', 'Submitted');

INSERT INTO `APPLICATION_REVIEW` (`committeeId`, `appId`, `c_Rank`, `Status`) 
    VALUES (11, 15, 'A+', 'Submitted');

INSERT INTO `APPLICATION_REVIEW` (`committeeId`, `appId`, `c_Rank`, `Status`) 
    VALUES (10, 16, 'A', 'New');
INSERT INTO `APPLICATION_REVIEW` (`committeeId`, `appId`, `c_Rank`, `Status`) 
    VALUES (11, 16, 'B+', 'Submitted');

INSERT INTO `APPLICATION_REVIEW` (`assignDate`, `committeeId`, `appId`, `Status`) 
    VALUES ('2018-02-23', 16, 17, 'New');

INSERT INTO `APPLICATION_REVIEW` (`committeeId`, `appId`, `c_Rank`, `Status`) 
    VALUES (16, 18, 'C', 'Submitted');

INSERT INTO `APPLICATION_REVIEW` (`assignDate`, `committeeId`, `appId`, `Status`) 
    VALUES ('2018-03-01', 16, 19, 'Draft');
INSERT INTO `APPLICATION_REVIEW` (`committeeId`, `appId`, `c_Rank`, `Status`) 
    VALUES (17, 19, 'C', 'Submitted');
INSERT INTO `APPLICATION_REVIEW` (`committeeId`, `appId`, `c_Rank`, `Status`) 
    VALUES (19, 19, 'A+', 'Draft');

INSERT INTO `APPLICATION_REVIEW` (`committeeId`, `appId`, `Status`) 
    VALUES (16, 20, 'New');
INSERT INTO `APPLICATION_REVIEW` (`committeeId`, `appId`, `c_Rank`, `Status`) 
    VALUES (17, 20, 'B', 'Draft');

INSERT INTO `APPLICATION_REVIEW` (`committeeId`, `appId`, `Status`) 
    VALUES (16, 21, 'New');


INSERT INTO `APPLICATION_REVIEW` (`committeeId`, `appId`, `c_Rank`, `Status`) 
    VALUES (18, 25, 'C', 'Draft');
INSERT INTO `APPLICATION_REVIEW` (`committeeId`, `appId`, `c_Rank`, `Status`) 
    VALUES (19, 25, 'B', 'Submitted');
