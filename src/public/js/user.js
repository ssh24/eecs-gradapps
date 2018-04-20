'use strict';

$(document).ready(function() {
    var MAX_LENGTH = 8;
    var new_password = 'New Password';
    var required_delim = '*';

    function randomPassword(length) {
        var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
        var pass = "";
        for (var x = 0; x < length; x++) {
            var i = Math.floor(Math.random() * chars.length);
            pass += chars.charAt(i);
        }
        return pass;
    }

    $('#gen-pass').click(function() {
        var pass = randomPassword(MAX_LENGTH);
        $('#set-pass').val(pass);
    });

    $('#copy-pass').click(function() {
        var copyText = $("#set-pass");
        copyText.select();
        document.execCommand("Copy");
    });

    // checker for attempting to leave the form without saving it
    $('#new-user-form').areYouSure(
        {
            message: 'It looks like you have been editing something. '+ 
                'If you leave before saving, your changes will be lost.'
        });

    // checker for attempting to leave the form without saving it
    $('#edit-user-form').areYouSure(
        {
            message: 'It looks like you have been editing something. '+ 
                'If you leave before saving, your changes will be lost.'
        });

    $('#delete-user').click(function(e) {
        var check = confirm("You chose to delete the user. Are you sure?");
        if (!check) e.preventDefault();
    });

    $('#fm_Roles').change(function() {
        if ($("#fm_Roles option:selected").length === 0) {
            $('#roles-message').html('Need to select a minimum of one role').css('color', 'red');
            $('#edit-submit').prop('disabled', true);
        } else {
            $('#roles-message').html('');
            $('#edit-submit').prop('disabled', false);
        }
    });

    $('#set-pass').on('keyup', function() {
        if ($('#set-pass').val() != '') {
            $('#set-pass').prop('required', true);
            $('#h-set-pass').text(new_password + required_delim);
        } else {
            $('#set-pass').prop('required', false);
            $('#h-set-pass').text(new_password);
        }
    });
});