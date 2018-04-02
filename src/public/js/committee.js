"use strict";

$(document).ready(function() {  
  //allows table to be sorted.
  $("#applicant-table").tablesorter({
    dateFormat: "mm/dd/yyyy",
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
          filterText += "Applicant Name = ";
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

    $("#save_preset").click(function(e) {
      if ($.trim($("#preset_name").val())) {
        var action = "/roles/committee/savePreset";
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
      var action = "/roles/committee/filter";
  
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
              filterText += "Applicant Name = ";
            } else if (filters[i] === "btn_filter_degree") {
              filterText += "Degree Applied For = ";
            } else if (filters[i] === "btn_filter_review") {
              filterText += "My Review Status = ";
            }
            filterText += $("#" + filters[i]).find("option:selected").text();
          }
        }
        $("#selectedFilter").html(filterText);
      }
    });
});
