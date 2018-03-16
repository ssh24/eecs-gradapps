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

    // checkbox for adding new university
    $("#new_uni").change(function() {
      $("#inst_exists").attr("hidden", "hidden");
      $("#assmt_exists").attr("hidden", "hidden");
      $("#rank_exists").attr("hidden", "hidden");
      if(this.checked) {
        $("#new_uni_name").removeAttr("disabled"); 
        $("#new_uni_btn").removeAttr("disabled"); 
      } else {
        $("#new_uni_name").attr("disabled", "disabled");
        $("#new_uni_name").val(''); 
        $("#new_uni_btn").attr("disabled", "disabled"); 
      }
    });

    // adding a new university
    $("#new_uni_btn").click(function() {
      $("#inst_exists").attr("hidden", "hidden");
      $("#assmt_exists").attr("hidden", "hidden");
      $("#rank_exists").attr("hidden", "hidden");
      if ($("#new_uni_name").val() != '') {
        var exists = false;
        $('#prev_uni option').each(function() {
          if (this.value === $("#new_uni_name").val()) exists = true;
        });
        if (!exists) {
          $('#prev_uni').append($('<option>', {
            text: $("#new_uni_name").val(),
            selected: "selected"
          }));
          $('#prev_uni').selectpicker('refresh');
          $("#uni_desc").html('');
          $("#uni_desc").removeAttr("disabled");
          $('#uni_desc').selectpicker('refresh');
        } else {
          $('#inst_exists').removeAttr('hidden');
          $('#inst_exists').text('Institution ' + $("#new_uni_name").val() + ' exists. Please select from the menu above.');
        }
      } else {
        $('#inst_exists').removeAttr('hidden');
        $('#inst_exists').text('Invalid name. Please try again.');
      }
      $('#new_uni').prop('checked', false);
      $("#new_uni_name").attr("disabled", "disabled"); 
      $("#new_uni_name").val(''); 
      $("#new_uni_btn").attr("disabled", "disabled"); 
      $('#add_assessment').removeAttr("disabled");
      $('#add_assessment').prop('checked', false);
      $('#assessment_txt').text('');
    });

    // selecting an university
    // loads the assessment for the university
    var descriptions = JSON.parse($('#all_desc').text());
    $("#prev_uni").change(function() {
      $("#inst_exists").attr("hidden", "hidden");
      $("#assmt_exists").attr("hidden", "hidden");
      $("#rank_exists").attr("hidden", "hidden");
      if ($('#prev_uni').val() === '-') {
        $("#uni_desc").html('');
        $('#uni_desc').selectpicker('refresh');

        $('#add_assessment').attr("disabled", "disabled");
        $('#add_assessment').prop('checked', false);

        $('#assessment_btn').attr("disabled", "disabled");
        $('#assessment').attr("disabled", "disabled");
        $('#assessment').val('');
      } else {
        $("#uni_desc").removeAttr("disabled"); 
        var option = '';
        $.each(descriptions, function(index, value) {
          var assessments = value['u_Assessments'];
          if (value['u_Name'] === $("#prev_uni").val()) {
            $.each(assessments, function(index, value) {
              if (index === 0) {
                option += '<option selected="selected">'+assessments[index]+'</option>';
              } else {
                option += '<option>'+assessments[index]+'</option>';
              }
            })
          }
        });
        $("#uni_desc").html(option);
        $('#uni_desc').selectpicker('refresh');

        $('#add_assessment').removeAttr("disabled");
        $('#add_assessment').prop('checked', false);

        $('#assessment').val('');
      }
      var selectedValues = []; 
      $("#uni_desc :selected").each(function() {
        if ($(this).val() != '-') selectedValues.push($(this).val()); 
      });
      var regex = new RegExp(',', 'g');
      selectedValues = selectedValues.toString().replace(regex, '\n');
      $('#assessment_txt').text(selectedValues);
    });

    // selecting a university assessment
    $("#uni_desc").change(function() {
      $("#inst_exists").attr("hidden", "hidden");
      $("#assmt_exists").attr("hidden", "hidden");
      $("#rank_exists").attr("hidden", "hidden");
      if($('#assessment').val != '') {
        var selectedValues = [];    
        $("#uni_desc :selected").each(function(){
          selectedValues.push($(this).val()); 
        });
        var regex = new RegExp(',', 'g');
        selectedValues = selectedValues.toString().replace(regex, '\n');
        $('#assessment_txt').text(selectedValues);
      }
    });

    // adding an assessment
    $('#add_assessment').click(function() {
      $("#inst_exists").attr("hidden", "hidden");
      $("#assmt_exists").attr("hidden", "hidden");
      $("#rank_exists").attr("hidden", "hidden");
      if(this.checked) {
        $('#assessment').val('');
        $('#assessment').removeAttr("disabled"); 
        $('#assessment_btn').removeAttr("disabled"); 
      } else {
        $('#assessment').attr("disabled", "disabled");
        $('#assessment_btn').attr("disabled", "disabled");
      }
    });

    // assessment button actions
    $('#assessment_btn').click(function() {
      $("#inst_exists").attr("hidden", "hidden");
      $("#assmt_exists").attr("hidden", "hidden");
      $("#rank_exists").attr("hidden", "hidden");

      // adding a new assessment
      if ($('#assessment').val() != '') {
        var exists = false;
        $('#uni_desc option').each(function() {
          if (this.value === $('#assessment').val()) exists = true;
        });

        if (!exists) {
          var uniFound = false;
          $.each(descriptions, function(index, value) {
            if (value['u_Name'] === $("#prev_uni").val()) {
              uniFound = true;
              value['u_Assessments'].push($('#assessment').val());
            }
          });
          if (!uniFound) {
            descriptions.push({
              u_Name: $("#prev_uni").val(), 
              u_Assessments: [$('#assessment').val()]
            });
          }
          var option = document.createElement("option");
          option.text =  $('#assessment').val();
          var select = document.getElementById("uni_desc");
          select.appendChild(option);
        } else {
          $('#assmt_exists').removeAttr('hidden');
          $('#assmt_exists').text('Exact match of assessment found. Please select from the menu above.');
        }
      } else {
        $('#assmt_exists').removeAttr('hidden');
        $('#assmt_exists').text('Invalid assessment. Please try again.');
      }
      $('#uni_desc').selectpicker('refresh');
      $('#add_assessment').prop("checked", false);
      $('#assessment').val('');
      $('#assessment_btn').attr("disabled", "disabled");
    });

    if ($('#prev_uni').val() != '-' && !$('#prev_uni').prop('disabled')) {
      $('#add_assessment').removeAttr("disabled");
      $('#add_assessment').prop('checked', false);
      $('#assessment').val('');
    }

    $('#gre').click(function() {
      $("#inst_exists").attr("hidden", "hidden");
      $("#assmt_exists").attr("hidden", "hidden");
      $("#rank_exists").attr("hidden", "hidden");
    });

    $('#background').click(function() {
      $("#inst_exists").attr("hidden", "hidden");
      $("#assmt_exists").attr("hidden", "hidden");
      $("#rank_exists").attr("hidden", "hidden");
    });

    $('#research').click(function() {
      $("#inst_exists").attr("hidden", "hidden");
      $("#assmt_exists").attr("hidden", "hidden");
      $("#rank_exists").attr("hidden", "hidden");
    });
  
    $('#comments').click(function() {
      $("#inst_exists").attr("hidden", "hidden");
      $("#assmt_exists").attr("hidden", "hidden");
      $("#rank_exists").attr("hidden", "hidden");
    });

    $('#rank').change(function() {
      if ($('#rank').val() === '-') {
        $('#review-submit').attr('disabled', 'disabled');
      } else {
        $('#review-submit').removeAttr('disabled');
      }
      $("#inst_exists").attr("hidden", "hidden");
      $("#assmt_exists").attr("hidden", "hidden");
      $("#rank_exists").attr("hidden", "hidden");
    });

    $('#review-submit').click(function() {
      var isRankError = false;
      $("#rank :selected").each(function() {
        if ($(this).val() === '-') isRankError = true; 
      });
      if (isRankError) {
        $("#rank_exists").removeAttr("hidden");
        $('#rank_exists').text('Please select a valid rank before submitting review.');
        $('#review-submit').attr('disabled', 'disabled');
      }
    });
});
