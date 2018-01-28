-- This SQL file is copyright for the EECS graduate program application --
-- Latest MySQL working version for this file: 5.7.21 --

DELIMITER //

---- This trigger checks if the application seen status on `APPLICATION_SEEN` 
---- table upon an insert is for an already reviewed application.
DROP TRIGGER IF EXISTS applicationSeenOnInsert //
CREATE TRIGGER applicationSeenOnInsert BEFORE INSERT ON `APPLICATION_SEEN`
    FOR EACH ROW
        BEGIN
            IF (New.seen = 1) THEN
                IF ((SELECT COUNT(*) FROM `APPLICATION` WHERE app_Id = 
                    New.appId AND committeeReviewed = 1) = 0) THEN
                    SIGNAL SQLSTATE '45000' SET 
                    MESSAGE_TEXT = 'Cannot insert non-reviewed application as seen';
                END IF;
            END IF;
        END //

---- This trigger checks if the application seen status on `APPLICATION_SEEN` 
---- table upon an update is for an already reviewed application.
DROP TRIGGER IF EXISTS applicationSeenOnUpdate //
CREATE TRIGGER applicationSeenOnUpdate BEFORE UPDATE ON `APPLICATION_SEEN`
    FOR EACH ROW
        BEGIN
            IF (Old.seen = 0 AND New.seen = 1) THEN
                -- if app is not reviewed yet, throw err
                IF ((SELECT COUNT(*) FROM `APPLICATION` WHERE app_Id = 
                    New.appId AND committeeReviewed = 1) = 0) THEN
                    SIGNAL SQLSTATE '45000' SET 
                    MESSAGE_TEXT = 'Cannot update non-reviewed application as seen';
                END IF;
                -- else if app is reviewed update the row
            END IF;
        END //

DELIMITER ;
