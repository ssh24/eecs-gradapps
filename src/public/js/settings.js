'use strict';

$(document).ready(function() {
    var new_password = 'New Password';
    var confirm_password = 'Confirm New Password';
    var required_delim = '*';

    // checker for attempting to leave the form without saving it
    $('#user-settings-form').areYouSure(
        {
            message: 'It looks like you have been editing something. '+ 
                'If you leave before saving, your changes will be lost.'
        });

    $('#set-pass-1, #set-pass-2').on('keyup', function () {
        if ($('#set-pass-1').val() != '' && $('#set-pass-1').val() != $('#set-pass-2').val()) {
            $('#pass-message').html('Password does not match').css('color', 'red');
            $('#edit-submit').prop('disabled', true);
        } else {
            $('#pass-message').html('Password matches').css('color', 'green');
            $('#edit-submit').prop('disabled', false);
        }
    });

    $('#set-pass-1').on('keyup', function() {
        if ($('#set-pass-1').val() != '') {
            $('#set-pass-2').prop('disabled', false);

            $('#set-pass-2').prop('required', true);
            $('#set-pass-1').prop('required', true);

            $('#h-set-pass-1').text(new_password + required_delim);
            $('#h-set-pass-2').text(confirm_password + required_delim);
        } else {
            $('#set-pass-2').prop('disabled', true);
            $('#pass-message').html('');

            $('#set-pass-2').prop('required', false);
            $('#set-pass-1').prop('required', false);

            $('#h-set-pass-1').text(new_password);
            $('#h-set-pass-2').text(confirm_password);
        }
    });
});