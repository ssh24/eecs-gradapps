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

INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (10, 1, 'B', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (12, 2, 'B+', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (13, 3, 'A', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (16, 4, 'B+', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (17, 6, 'A+', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (10, 8, 'B', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (11, 11, 'B', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');

INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (11, 12, 'B', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (11, 14, 'C', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');

INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (11, 15, 'A+', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');

INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`) 
    VALUES (10, 16, 'A', 'New');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`) 
    VALUES (11, 16, 'B+', 'Submitted');

INSERT INTO `application_review` (`assignDate`, `committeeId`, `appId`, `Status`) 
    VALUES ('2018-02-23', 16, 17, 'New');

INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`) 
    VALUES (16, 18, 'C', 'Submitted');

INSERT INTO `application_review` (`assignDate`, `committeeId`, `appId`, `Status`) 
    VALUES ('2018-03-01', 16, 19, 'Draft');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`) 
    VALUES (17, 19, 'C', 'Submitted');

INSERT INTO `application_review` (`committeeId`, `appId`, `Status`) 
    VALUES (16, 20, 'New');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`) 
    VALUES (17, 20, 'B', 'Draft');

INSERT INTO `application_review` (`committeeId`, `appId`, `Status`) 
    VALUES (16, 21, 'New');

INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`) 
    VALUES (18, 25, 'C', 'Draft');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`) 
    VALUES (19, 25, 'B', 'Submitted');

INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (10, 26, 'B', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (12, 26, 'B', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');

INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (12, 27, 'B+', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');

INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (13, 28, 'A', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');

INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (16, 29, 'B+', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (10, 29, 'B+', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');

INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (17, 30, 'A+', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (11, 30, 'A+', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');

INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (10, 31, 'B', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');


INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (11, 32, 'B', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');

INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (10, 33, 'B', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (11, 33, 'B', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');

INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (10, 34, 'B', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (11, 34, 'B', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');

INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (10, 35, 'B', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (11, 35, 'B', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');
