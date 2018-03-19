"use strict";
//once the page is ready
$(document).ready(function() {
  //add our custom parser for grades
  $.tablesorter.addParser({
    // use a unique id
    id: 'grades',
    is: function(s, table, cell, $cell) {
      // s is the text from the cell
      // table is the current table (as a DOM element; not jQuery object)
      // cell is the current table cell (DOM element)
      // $cell is the current table cell (jQuery object; added v2.18.0)
      // return false if you don't want this parser to be auto detected
      return false;
    },
    format: function(s, table, cell, cellIndex) {
      // s is the text from the cell
      // table is the current table (as a DOM element; not jQuery object)
      // cell is the current table cell (DOM element)
      // cellIndex is the current cell's column index
      // format your data for normalization
      // (i.e. do something to get and/or modify your data, then return it)
      var patt_Aplus = /\w*A\+\w*/i;
      var patt_A = /\w*A\w*/i;
      var patt_Bplus = /\w*B\+\w*/i;
      var patt_B = /\w*B\w*/i;
      var patt_Cplus = /\w*C\+\w*/i;
      var patt_C = /\w*C\w*/i;
      var patt_Dplus = /\w*D\+\w*/i;
      var patt_D = /\w*D\w*/i;
      var patt_E = /\w*E\w*/i;
      var patt_F = /\w*F\w*/i;

      if (patt_Aplus.test(s)) {
        s = 9;
      } else if (patt_A.test(s)) {
        s = 8;
      } else if (patt_Bplus.test(s)) {
        s = 7;
      } else if (patt_B.test(s)) {
        s = 6;
      } else if (patt_Cplus.test(s)) {
        s = 5;
      } else if (patt_C.test(s)) {
        s = 4;
      } else if (patt_Dplus.test(s)) {
        s = 3;
      } else if (patt_D.test(s)) {
        s = 2;
      } else if (patt_E.test(s)) {
        s = 1;
      } else if (patt_F.test(s)) {
        s = 0;
      }
      return s;
    },
    // flag for filter widget (true = ALWAYS search parsed values; false = search cell text)
    parsed: false,
    // set the type to either numeric or text (text uses a natural sort function
    // so it will work for everything, but numeric is faster for numbers
    type: 'numeric'
  });
  //allows table to be sorted.
  //select our table to be sorted
  $("#applicant-table").tablesorter();

  //The below is ment to keep track of the columns selected and their order.
  var colOrder = [];
  $("#div_col button").click(function() {
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      $(this).val("");
      colOrder.push(this.id);
      $(this).append(" <span class='label label-primary'>" + colOrder.length + "</span>");
    } else {
      $(this).val("active");
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

  //The below is ment to keep track of the filters selected and the values.
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
      if ($("#" + filters[i]).find("option:selected").text() !== '' && $("#" + filters[i]).find("option:selected").text() !== 'Any') {
        if(filterText.length > 0){
            filterText += " <span style=\"color:red\">AND</span> ";
        }
        if (filters[i] === "btn_filter_name") {
          filterText += "Name = ";
        } else if (filters[i] === "btn_filter_gender") {
          filterText += "Gender = ";
        } else if (filters[i] === "btn_filter_foi") {
          filterText += "Field of Interest = ";
        } else if (filters[i] === "btn_filter_prof") {
          filterText += "Preferred Professor = ";
        } else if (filters[i] === "btn_filter_ranking") {
          filterText += "Committee Ranking ";
        } else if (filters[i] === "btn_filter_gpa") {
          filterText += "GPA ";
        } else if (filters[i] === "btn_filter_degree") {
          filterText += "Degree Applied For = ";
        } else if (filters[i] === "btn_filter_visa") {
          filterText += "Visa Status = ";
        } else if (filters[i] === "btn_filter_program_decision") {
          filterText += "Program Decision = ";
        } else if (filters[i] === "btn_filter_contacted_by") {
          filterText += "Contacted By = "
        } else if (filters[i] === "btn_filter_requested_by") {
          filterText += "Requested By = ";
        } else if (filters[i] === "btn_filter_interest") {
          filterText += "My Interest Status = ";
        }
        filterText += $("#" + filters[i]).find("option:selected").text();
      }
    }
    $("#selectedFilter").html(filterText);
  });

  $("#save_preset").click(function(e) {
    if ($.trim($("#preset_name").val())) {
      var action = "/roles/professor/savePreset";
      $("#filterForm").attr('action', action);

      for (var i = 0; i < colOrder.length; i++) {
        $(this).append('<input type="hidden" name="selectedCol[]" value="' + colOrder[i] + '">');
      }
      //submit the form with the selected columns.
      $("#filterForm").submit();
    } else {
      alert("Please input a name for the preset!");
    }

    e.preventDefault();

  });

  $("#filter_submit").click(function(e) {
    var action = "/roles/professor/filter";

    $("#filterForm").attr('action', action);
    for (var i = 0; i < colOrder.length; i++) {
      $(this).append('<input type="hidden" name="selectedCol[]" value="' + colOrder[i] + '">');
    }
    //submit the form with the selected columns.
    $("#filterForm").submit();
    e.preventDefault();

  });

  $("#preset").change(function() {
    var key = $(this).val();
    if (key !== "") {
      var cols = presets[key]['cols'];
      var filt = presets[key]['filt'];
      colOrder = [];
      for (var col in presets[key]['cols']) {
        $("#" + col).removeClass("active");
        //removes the span element.
        $("#" + col).children().remove();
        if (presets[key]['cols'][col] && presets[key]['cols'][col] !== '') {
          $("#" + col).addClass("active");
          colOrder[presets[key]['cols'][col]-1] = col;
          $("#" + col).append(" <span class='label label-primary'>" + presets[key]['cols'][col] + "</span>");
        }
      }
      filters = [];
      for (var filt in presets[key]['filt']) {
        $("#" + filt).val(presets[key]['filt'][filt]);
        $("#" + filt).selectpicker('render');
        filters.push(filt);
      }
      //update string
      var filterText = '';
      //change the below for gpa and committe once merged.
      for (var i = 0; i < filters.length; i++) {
        if ($("#" + filters[i]).find("option:selected").text() !== '' && $("#" + filters[i]).find("option:selected").text() !== 'Any') {
          if(filterText.length > 0){
              filterText += " <span style=\"color:red\">AND</span> ";
          }
          if (filters[i] === "btn_filter_name") {
            filterText += "Name = ";
          } else if (filters[i] === "btn_filter_gender") {
            filterText += "Gender = ";
          } else if (filters[i] === "btn_filter_foi") {
            filterText += "Field of Interest = ";
          } else if (filters[i] === "btn_filter_prof") {
            filterText += "Preferred Professor = ";
          } else if (filters[i] === "btn_filter_ranking") {
            filterText += "Committee Ranking ";
          } else if (filters[i] === "btn_filter_gpa") {
            filterText += "GPA ";
          } else if (filters[i] === "btn_filter_degree") {
            filterText += "Degree Applied For = ";
          } else if (filters[i] === "btn_filter_visa") {
            filterText += "Visa Status = ";
          } else if (filters[i] === "btn_filter_program_decision") {
            filterText += "Program Decision = ";
          } else if (filters[i] === "btn_filter_contacted_by") {
            filterText += "Contacted By = "
          } else if (filters[i] === "btn_filter_requested_by") {
            filterText += "Requested By = ";
          } else if (filters[i] === "btn_filter_interest") {
            filterText += "My Interest Status = ";
          }
          filterText += $("#" + filters[i]).find("option:selected").text();
        }
      }
      $("#selectedFilter").html(filterText);
    }
  });
});
