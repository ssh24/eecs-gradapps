$('#password, #confirm_password').on('keyup', function () {
    if ($('#password').val() != '' && $('#password').val() == $('#confirm_password').val()) {
      $("#register-btn").prop('disabled', false);
      $('#pass-message').html('Password matches').css('color', 'green');
    } else {
      $("#register-btn").prop('disabled', true);
      $('#pass-message').html('Password does not match').css('color', 'red');
    } 
  });
