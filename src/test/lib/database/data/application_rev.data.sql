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


/*Committee Review = 1, Visa application so it requires one submitted review.
1 - done
2 - done
3 - done
4 - done
6 - done
8 - done
11 - done
12 - done
14 - done
*/

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

/*Committee Reviewed = 1, Domestic so requires two submitted reviews
5
7
9
10
13
15 -done
*/

/*CommitteeIds
11
12
13
16
17
18
19
20
21
23
24
25
26
27
28
29
30
31
*/

INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (11, 15, 'A+', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`, `Background`, `researchExp`, `Letter`, `Comments`)
    VALUES (10, 15, 'A', 'Submitted', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus aliquam sollicitudin. Mauris ullamcorper.');



/* Committee Review = 0, Visa
23
 */
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`)
   VALUES (11, 23, 'A', 'New');
/* Committee Review = 0, Domestic
16 - done
17 - done
18 - done
19 - done
20 - done
21 - done
22 - done
24 - done
25 - done
*/


/*Awaiting second submission*/
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
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`)
    VALUES (19, 19, 'A+', 'Draft');

INSERT INTO `application_review` (`committeeId`, `appId`, `Status`)
    VALUES (16, 20, 'New');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`)
    VALUES (17, 20, 'B', 'Draft');

INSERT INTO `application_review` (`committeeId`, `appId`, `Status`)
    VALUES (16, 21, 'New');

INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`)
    VALUES (18, 24, 'C', 'Draft');

INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`)
    VALUES (18, 25, 'C', 'Draft');
INSERT INTO `application_review` (`committeeId`, `appId`, `c_Rank`, `Status`)
    VALUES (19, 25, 'B', 'Submitted');
