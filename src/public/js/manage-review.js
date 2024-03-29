'use strict';

$(document).ready(function() {
    $('#review-table').tablesorter();

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
                if (filters[i] === "btn_filter_visa") {
                    filterText += "Visa Status = "
                } else if (filters[i] === "btn_filter_foi") {
                    filterText += "Field(s) of Interest = "
                } else if (filters[i] === "btn_filter_prof") {
                    filterText += "Preferred Professor(s) = "
                } 
                filterText += $("#" + filters[i]).find("option:selected").text();
                if (i + 1 < filters.length) {
                  filterText += " <span style=\"color:red\">AND</span> ";
                }
            }
            $("#selectedFilter").html(filterText);
        });
    
        $("#filter_submit").click(function(e) {
            var action = "/roles/admin/reviews/filter";
        
            $("#filterForm").attr('action', action);
            for (var i = 0; i < colOrder.length; i++) {
              $(this).append('<input type="hidden" name="selectedCol[]" value="' + colOrder[i] + '">');
            }
            //submit the form with the selected columns.
            $("#filterForm").submit();
            e.preventDefault();
        });
});