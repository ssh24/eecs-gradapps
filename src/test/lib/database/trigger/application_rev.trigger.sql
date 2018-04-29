-- This SQL file is copyright for the EECS graduate program application --
-- Latest MySQL working version for this file: 5.7.21 --

DELIMITER //

---- This trigger updates the committee review status on `application` table 
---- upon an insert on the `application_review` table iff there has been two 
---- reviewes submitted.
DROP TRIGGER IF EXISTS committeeReviewOnInsert //
CREATE TRIGGER committeeReviewOnInsert AFTER INSERT ON `application_review`
    FOR EACH ROW
        BEGIN
            IF ((SELECT COUNT(*) FROM `application` WHERE app_Id = New.appId 
            AND VStatus = "Visa") = 1) THEN
                IF ((SELECT COUNT(*) FROM `application_review` WHERE appId = 
                New.appId AND Status = 'Submitted') = 1) THEN
                    UPDATE `application` SET committeeReviewed = 1 WHERE 
                    app_Id = NEW.appId;
                END IF;
            ELSEIF ((SELECT COUNT(*) FROM `application` WHERE app_Id = New.appId 
            AND VStatus = "Domestic") = 1) THEN
                IF ((SELECT COUNT(*) FROM `application_review` WHERE appId = 
                New.appId AND Status = 'Submitted') = 2) THEN
                    UPDATE `application` SET committeeReviewed = 1 WHERE 
                    app_Id = NEW.appId;
                END IF;
            END IF;
        END //

---- This trigger updates the committee review status on `application` table 
---- upon an update on the `application_review` table iff there has been two 
---- reviewes submitted.
DROP TRIGGER IF EXISTS committeeReviewOnUpdate //
CREATE TRIGGER committeeReviewOnUpdate AFTER UPDATE ON `application_review`
    FOR EACH ROW
        BEGIN
            IF ((SELECT COUNT(*) FROM `application` WHERE app_Id = New.appId 
            AND VStatus = "Visa") = 1) THEN
                IF ((SELECT COUNT(*) FROM `application_review` WHERE appId = 
                New.appId AND Status = 'Submitted') = 1) THEN
                    UPDATE `application` SET committeeReviewed = 1 WHERE 
                    app_Id = NEW.appId;
                END IF;
            ELSEIF ((SELECT COUNT(*) FROM `application` WHERE app_Id = New.appId 
            AND VStatus = "Domestic") = 1) THEN
                IF ((SELECT COUNT(*) FROM `application_review` WHERE appId = 
                New.appId AND Status = 'Submitted') = 2) THEN
                    UPDATE `application` SET committeeReviewed = 1 WHERE 
                    app_Id = NEW.appId;
                END IF;
            END IF;
        END //

---- This trigger deletes the committee review status on `application` table 
---- upon a delete on the `APPLICATION_REVIEW` table.
DROP TRIGGER IF EXISTS committeeReviewOnDelete //
CREATE TRIGGER committeeReviewOnDelete AFTER DELETE ON `application_review`
    FOR EACH ROW
        BEGIN
            UPDATE `application` SET committeeReviewed = 0 WHERE 
                app_Id = Old.appId;
        END //

DELIMITER ;
