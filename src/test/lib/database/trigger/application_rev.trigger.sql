-- This SQL file is copyright for the EECS graduate program application --
-- Latest MySQL working version for this file: 5.7.21 --

DELIMITER //

---- This trigger updates the committee review status on `APPLICATION` table 
---- upon an insert on the `APPLICATION_REVIEW` table iff there has been two 
---- reviewes submitted.
DROP TRIGGER IF EXISTS committeeReviewOnInsert //
CREATE TRIGGER committeeReviewOnInsert AFTER INSERT ON `APPLICATION_REVIEW`
    FOR EACH ROW
        BEGIN
            IF ((SELECT COUNT(*) FROM `APPLICATION` WHERE app_Id = New.appId 
            AND VStatus = "Visa") = 1) THEN
                IF ((SELECT COUNT(*) FROM `APPLICATION_REVIEW` WHERE appId = 
                New.appId AND Status = 'Submitted') = 1) THEN
                    UPDATE `APPLICATION` SET committeeReviewed = 1 WHERE 
                    app_Id = NEW.appId;
                END IF;
            ELSEIF ((SELECT COUNT(*) FROM `APPLICATION` WHERE app_Id = New.appId 
            AND VStatus = "Domestic") = 1) THEN
                IF ((SELECT COUNT(*) FROM `APPLICATION_REVIEW` WHERE appId = 
                New.appId AND Status = 'Submitted') = 2) THEN
                    UPDATE `APPLICATION` SET committeeReviewed = 1 WHERE 
                    app_Id = NEW.appId;
                END IF;
            END IF;
        END //

---- This trigger updates the committee review status on `APPLICATION` table 
---- upon an update on the `APPLICATION_REVIEW` table iff there has been two 
---- reviewes submitted.
DROP TRIGGER IF EXISTS committeeReviewOnUpdate //
CREATE TRIGGER committeeReviewOnUpdate AFTER UPDATE ON `APPLICATION_REVIEW`
    FOR EACH ROW
        BEGIN
            IF ((SELECT COUNT(*) FROM `APPLICATION` WHERE app_Id = New.appId 
            AND VStatus = "Visa") = 1) THEN
                IF ((SELECT COUNT(*) FROM `APPLICATION_REVIEW` WHERE appId = 
                New.appId AND Status = 'Submitted') = 1) THEN
                    UPDATE `APPLICATION` SET committeeReviewed = 1 WHERE 
                    app_Id = NEW.appId;
                END IF;
            ELSEIF ((SELECT COUNT(*) FROM `APPLICATION` WHERE app_Id = New.appId 
            AND VStatus = "Domestic") = 1) THEN
                IF ((SELECT COUNT(*) FROM `APPLICATION_REVIEW` WHERE appId = 
                New.appId AND Status = 'Submitted') = 2) THEN
                    UPDATE `APPLICATION` SET committeeReviewed = 1 WHERE 
                    app_Id = NEW.appId;
                END IF;
            END IF;
        END //

DELIMITER ;
