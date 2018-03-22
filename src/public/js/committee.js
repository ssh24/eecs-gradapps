"use strict";

$(document).ready(function() {
  $('#review-form').areYouSure(
    {
      message: 'It looks like you have been editing something. '
             + 'If you leave before saving, your changes will be lost.'
    }
  );
  
  //allows table to be sorted.
  $("#applicant-table").tablesorter({
    dateFormat: "uk"
  });

    //The below is meant to keep track of the columns selected and their order.
    var colOrder = [];
    $("#div_col button").click(function() {
      $(this).toggleClass("active");
      if ($(this).hasClass("active")) {
        colOrder.push(this.id);
        $(this).append(" <span class='label label-primary'>" + colOrder.length + "</span>");
      } else {
        //remove the element that was clicked...
        var index = colOrder.indexOf(this.id);
        if (index !== -1) {
          colOrder.splice(index, 1);
          //removes the span element.
          $("#" + this.id).children().remove();
          //update the order here...
          for (var i = index; i < colOrder.length; i++) {
            $("#" + colOrder[i]).children().remove();
            $("#" + colOrder[i]).append(" <span class='label label-primary'>" + (i + 1) + "</span>");
          }
        }
      }
    });
  
    //The below is meant to keep track of the filters selected and the values.
    var filters = [];
    $("#div_filt select").change(function() {
      var selectedOption = $(this).find("option:selected").text();
      //remove the filter that was clicked.
      //if it exists in the array.
      var index = filters.indexOf(this.id);
      if (index !== -1) {
        filters.splice(index, 1);
      }
  
      if (selectedOption !== '' && selectedOption !== 'Any') {
        filters.push(this.id);
      }
      //update string
      var filterText = '';
      //change the below for gpa and committe once merged.
      for (var i = 0; i < filters.length; i++) {
        if (filters[i] === "btn_filter_name") {
          filterText += "Name = ";
        } else if (filters[i] === "btn_filter_degree") {
          filterText += "Degree Applied For = ";
        } else if (filters[i] === "btn_filter_review") {
          filterText += "My Review Status = ";
        }
        filterText += $("#" + filters[i]).find("option:selected").text();
        if (i + 1 < filters.length) {
          filterText += " <span style=\"color:red\">AND</span> ";
        }
      }
      $("#selectedFilter").html(filterText);
    });
  
    //submit the form with the selected columns.
    $("#filterForm").submit(function(e) {
      for (var i = 0; i < colOrder.length; i++) {
        $(this).append('<input type="hidden" name="selectedCol[]" value="' + colOrder[i] + '">');
      }
    });

    /** university descriptions **/
    var descriptions = JSON.parse($('#all_desc').text());

    function hideErrorMessages() {
      // hide all error messages
      $("#inst_exists").attr("hidden", "hidden");
      $("#assmt_exists").attr("hidden", "hidden");
      $("#rank_exists").attr("hidden", "hidden");
    }

    function getSelectedUnis() {
      var selected_unis = [];
      // for each selected university add the university to an array and return it
      $("#prev_uni :selected").each(function() {
        selected_unis.push($(this).val()); 
      });
      return selected_unis;
    }

    function setAssessmentUnis(selected_unis) {
      var option = '';
      // for each selected unis
      $.each(selected_unis, function(index, value) {
        // for the first element, select it
        if (index === 0) {
          option += '<option selected="selected">'+selected_unis[index]+'</option>';
        } else { // all other element, do not select it
          option += '<option>'+selected_unis[index]+'</option>';
        }
      });
  
      // add the options to the university dropdown parent and refresh the picker
      $('#select_add_assessment').html(option);
      $('#select_add_assessment').selectpicker('refresh');
    }

    function setAssessments(selected_unis) {
      // get all listed universities in the description dropdown
      var assessments = $('#uni_desc optgroup');
      var listed_unis = [];
      $.each(assessments, function(index, value) {
        listed_unis.push(assessments[index]['label']);
      });
     
      // for each select university
      for(var i = 0; i < selected_unis.length; i++) {
        var option = '';
        
        if (!listed_unis.includes(selected_unis[i])) {
          // create an optgroup for the university
          option += '<optgroup label="' + selected_unis[i] + '">';
          // for each university description
          $.each(descriptions, function(index, value) {
            // get the assessment of the university
            var assessments = value['u_Assessments'];
            // if the university name matches for the selected university
            if (value['u_Name'] === selected_unis[i]) {
              // for each assessment add an option
              $.each(assessments, function(index, value) {
                option += '<option>'+assessments[index]+'</option>';
              });
            }
          });
          option += '</optgroup>';

          // add the options to the university assessment parent and refresh the picker
          $("#uni_desc").append(option);
          $('#uni_desc').selectpicker('refresh');
        }
      }
    }

    function removeAssessments(selected_unis) {
      // get all listed universities in the description dropdown
      var assessments = $('#uni_desc optgroup');
      var listed_unis = [];
      $.each(assessments, function(index, value) {
        listed_unis.push(assessments[index]['label']);
      });

      // for all listed universities
      for(var i = 0; i < listed_unis.length; i++) {
        // if listed university of i is not selected, remove it from listed
        if (!selected_unis.includes(listed_unis[i])) {
          $('#uni_desc optgroup[label="' + listed_unis[i] + '"').remove();
          $('#uni_desc').selectpicker('refresh');
        }
      }
    }

    function createUniAssessmentObject() {
      var selectedValues = []; 
      $("#uni_desc :selected").each(function(){
        selectedValues.push($(this).val()); 
      });

      var selected_unis = getSelectedUnis();

      var obj = [];
      
      $.each(descriptions, function(index, value) {
        if (selected_unis.includes(value['u_Name'])) {
          var newObj = {};
          newObj.u_Name = value['u_Name'];
          newObj.u_Assessments = [];
          $.each(value['u_Assessments'], function(index, value) {
            if (selectedValues.includes(value)) {
              newObj.u_Assessments.push(value);
            }
          });   
          obj.push(newObj);
        }
      });
      obj = JSON.stringify(obj);
      $('#review-save').attr('value', obj);
      $('#review-submit').attr('value', obj);
    }

    // checkbox for adding new university
    $("#new_uni").change(function() {
      // hide all error messages on button toggles
      hideErrorMessages();

      // if checkbox is unchecked
      if(this.checked) {
        // make new_uni checkbox and new_uni textbox enabled
        $("#new_uni_name").removeAttr("disabled"); 
        $("#new_uni_btn").removeAttr("disabled"); 
      } else { // if checkbox is unchecked new_uni checkbox and new_uni textbox disabled
        $("#new_uni_name").attr("disabled", "disabled");
        $("#new_uni_name").val(''); 
        $("#new_uni_btn").attr("disabled", "disabled"); 
      }
    });

    // adding a new university
    $("#new_uni_btn").click(function() {
      // hide all error messages on button toggles
      hideErrorMessages();

      // user input university name
      var uni = $("#new_uni_name").val();

      // if name is not empty
      if (uni != '') {
        var exists = false;

        // iterate through all existing names to see if university already exists
        $('#prev_uni option').each(function() {
          if (this.value === uni) exists = true;
        });

        // if university does not exist
        if (!exists) {
          // create option for university
          var option = {
            text: uni,
            selected: "selected"
          };
          // append option to select picker for picking university and refresh the picker
          $('#prev_uni').append($('<option>', option));
          $('#prev_uni').selectpicker('refresh');

          // append option to select picker for adding assessment for an university and refresh the picker
          $('#select_add_assessment').append($('<option>', {
            text: uni
          }));
          $('#select_add_assessment').selectpicker('refresh');

          // set an description picker for the university
          $("#uni_desc").removeAttr("disabled");
          $('#uni_desc').selectpicker('refresh');
        } else { // if university does exist give a reasonable message
          $('#inst_exists').removeAttr('hidden');
          $('#inst_exists').text('Institution ' + $("#new_uni_name").val() + ' exists. Please select from the menu.');
        }
      } else { // if name is empty give a reasonable message
        $('#inst_exists').removeAttr('hidden');
        $('#inst_exists').text('Invalid name. Please try again.');
      }

      // reset all adding new university fields
      $('#new_uni').prop('checked', false);
      $("#new_uni_name").attr("disabled", "disabled"); 
      $("#new_uni_name").val(''); 
      $("#new_uni_btn").attr("disabled", "disabled");
      
      // set adding assessment field to enabled
      $('#add_assessment').removeAttr("disabled");
      $('#add_assessment').prop('checked', false);
    });

    // selecting an university
    // loads the assessment for the university
    $("#prev_uni").change(function() {
      // hide all error messages on button toggles
      hideErrorMessages();

      // get all selected universities
      var selected_unis = getSelectedUnis();

      // set new uni checkbox and new uni button to unchecked and disabled
      $('#new_uni').prop('checked', false);
      $("#new_uni_btn").attr("disabled", "disabled");

      // set add assessment chechbox to unchecked and texbox value to empty
      $('#add_assessment').prop('checked', false);
      $('#assessment').val('');

      // set selecting uni for assessment to disabled
      $('#select_add_assessment').attr("disabled", "disabled");

      // if no university is selected
      if (selected_unis.length === 0) {
        // set uni descriptions to disabled and adding assessment to disabled
        $('#uni_desc').attr("disabled", "disabled");
        $('#add_assessment').attr("disabled", "disabled");
      } else { // if university is selected set uni descriptions and adding assessment to enabled
        $('#uni_desc').removeAttr("disabled");
        $('#add_assessment').removeAttr("disabled");
      }
  
      // set assessment universities for the selected unis
      setAssessmentUnis(selected_unis);
      // set assessment for the selected unis
      setAssessments(selected_unis);
      // remove assessments that are not needed
      removeAssessments(selected_unis);
    });

    // selecting a university assessment
    $("#uni_desc").change(function() {
      // hide all error messages on button toggles
      hideErrorMessages();

      // if assessment is not empty
      if($('#assessment').val != '') {
        /** create object to save key value pairs of assessments **/
        createUniAssessmentObject();
      }
    });

    // adding an assessment
    $('#add_assessment').click(function() {
      // hide all error messages on button toggles
      hideErrorMessages();

      // set assessment text box empty
      $('#assessment').val('');

      // if add assessment buttton is checked
      if(this.checked) {
        // set university selection dropdown enabled
        $('#select_add_assessment').removeAttr('disabled');
        $('#select_add_assessment').selectpicker('refresh');

        // set assessment enabled and make the assessment button enabled
        $('#assessment').removeAttr("disabled"); 
        $('#assessment_btn').removeAttr("disabled"); 
      } else { // if add assessment button is not checked
        // set university selection dropdown disabled
        $('#select_add_assessment').attr('disabled', 'disabled');
        $('#select_add_assessment').selectpicker('refresh');

        // set assessment box disabled and make the assessment button disabled
        $('#assessment').attr("disabled", "disabled");
        $('#assessment_btn').attr("disabled", "disabled");
      }
    });

    // assessment button actions
    $('#assessment_btn').click(function() {
      // hide all error messages on button toggles
      hideErrorMessages();

      // new assessment
      var assessment = $('#assessment').val();

      // if assessment text is not empty
      if (assessment != '') {
        var exists = false;

        // university chosen to add the assessment
        var forUni = $('#select_add_assessment').val();

        // list of all universities
        var universities = $('#uni_desc optgroup');

        // for each university, iteratre through to check if the assessment already exists
        $.each(universities, function(index, value) {
          if (universities[index]['label'] === forUni) {
            var options = $('#uni_desc optgroup[label="' + universities[index]['label'] + '"] option');
            $.each(options, function(index, value) {
              if (options[index]['value'] === assessment) exists = true;
            })
          }
        });

        // if assessment does not exist
        if (!exists) {
          var uniFound = false;
          // for each descriptions, check to see if the university assessment object exists
          $.each(descriptions, function(index, value) {
            if (value['u_Name'] === forUni) {
              uniFound = true;
              value['u_Assessments'].push(assessment);
            }
          });
          
          // if university does not exist
          if (!uniFound) {
            // create an optgroup for the university
            var uniopt = $('#uni_desc');
            var optgroup = '<optgroup label="' + forUni + '" name="' + forUni + '"> <option selected="selected">' + assessment + '</option> </optgroup>';
            uniopt.append(optgroup);

            // push the changes into local descriptions object
            descriptions.push({
              u_Name: forUni, 
              u_Assessments: [assessment]
            });
          } else { // if university does exist, just append the assessment as an option
            var uni = $('#uni_desc optgroup[label="' + forUni + '"]');
            var option = '<option selected="selected">' + assessment + '</option>';
            uni.append(option);
          }
        } else { // if assessment exists, show error message
          $('#assmt_exists').removeAttr('hidden');
          $('#assmt_exists').text('Exact match of assessment found. Please select from the menu.');
        }
      } else { // if assessment is invalid, show error message
        $('#assmt_exists').removeAttr('hidden');
        $('#assmt_exists').text('Invalid assessment. Please try again.');
      }

      // refresh teh university assessment picker
      $('#uni_desc').selectpicker('refresh');

      // reset adding assessment components
      $('#add_assessment').prop("checked", false);
      $('#assessment').val('');
      $('#assessment_btn').attr("disabled", "disabled");
      $('#assessment').attr("disabled", "disabled");

      // set university selection assessment to disabled
      $('#select_add_assessment').attr("disabled", "disabled");
      $('#select_add_assessment').selectpicker('refresh');

      /** create object to save key value pairs of assessments **/
      createUniAssessmentObject();
    });

    // if previous university dropdown is not empty and not disabled (when loaded data)
    if ($('#prev_uni').val() != '' && !$('#prev_uni').prop('disabled')) {
      // make add assessment checkbox enabled, and uncheck the assessment checkbox and set assessment text empty
      $('#add_assessment').removeAttr("disabled");
      $('#add_assessment').prop('checked', false);
      $('#assessment').val('');

      // make assessment dropdown enabled
      $('#uni_desc').removeAttr('disabled');

      // get all selected universities
      var selected_unis = getSelectedUnis();
      setAssessments(selected_unis);
    }

    $('#gre').click(function() {
      // hide all error messages on button toggles
      hideErrorMessages();
    });

    $('#background').click(function() {
      // hide all error messages on button toggles
      hideErrorMessages();
    });

    $('#research').click(function() {
      // hide all error messages on button toggles
      hideErrorMessages();
    });
  
    $('#comments').click(function() {
      // hide all error messages on button toggles
      hideErrorMessages();
    });

    // when selecting a rank
    $('#rank').change(function() {
      // hide all error messages on button toggles
      hideErrorMessages();

      // selected rank is not a valid rank
      if ($('#rank').val() === '-') {
        // set review submit button disabled
        $('#review-submit').attr('disabled', 'disabled');
      } else { // if it is a valid rank
        // set review submit button enabled
        $('#review-submit').removeAttr('disabled');
      }
      // create uni assessment object
      createUniAssessmentObject();
    });

    // review form submit
    $('#review-submit').click(function() {
      var isRankError = false;
      // get the selected rank
      $("#rank :selected").each(function() {
        if ($(this).val() === '-') isRankError = true; 
      });
      // if an invalid rank is selected
      if (isRankError) {
        // set rank error message
        $("#rank_exists").removeAttr("hidden");
        $('#rank_exists').text('Please select a valid rank before submitting review.');
        // set review submit button disabled
        $('#review-submit').attr('disabled', 'disabled');
      }
    });

    // if a rank is loaded, submit button should be disabled
    if ($('#rank').val() != '-') {
      $('#review-submit').removeAttr('disabled');
    }
    // create uni assessment object
    createUniAssessmentObject();
});
