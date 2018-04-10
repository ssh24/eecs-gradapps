'use strict';

$(document).ready(function() {
    var MAX_SIZE = 20;
    var FILE_TYPE = 'application/pdf';

    // checker for attempting to leave the form without saving it
    $('#new-app-form').areYouSure(
        {
            message: 'It looks like you have been editing something. '+ 
            'If you leave before saving, your changes will be lost.'
        }
    );

    // checker for attempting to leave the form without saving it
    $('#edit-app-form').areYouSure(
        {
            message: 'It looks like you have been editing something. '+ 
            'If you leave before saving, your changes will be lost.'
        }
    );

    // when selecting a new file: file size and file type checkers
    $('#app_file').bind('change', function() {
        $('#error-file').attr('hidden', 'hidden');
        $('#new-submit').removeAttr('disabled');
        $('#edit-submit').attr('disabled', 'disabled');

        var size = Math.round(this.files[0].size / (1024 * 1024));
        var type = this.files[0].type;
        $('#error-file').text('');

        if (size > MAX_SIZE) {
            $('#error-file').append('File too large. Accepted file size: <= ' + 
                MAX_SIZE + 'MB');
            $('#error-file').removeAttr('hidden');
            $('#new-submit').attr('disabled', 'disabled');
            $('#edit-submit').attr('disabled', 'disabled');
        }
        if (type !== FILE_TYPE) {
            $('#error-file').append('\nIncorrect file type. Accepted file type: ' + 
                FILE_TYPE);
            $('#error-file').removeAttr('hidden');
            $('#new-submit').attr('disabled', 'disabled');
            $('#edit-submit').attr('disabled', 'disabled');
        }
    });
});