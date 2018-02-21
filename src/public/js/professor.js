"use strict";

$(document).ready(function() {

  //The below is ment to keep track of the columns selected and their order.
  var colOrder = [];
  $("#div_col button").click(function() {
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      colOrder.push(this.id);
      $(this).append(" <span class='label label-primary'>" + colOrder.length + "</span>");
    } else {
      //remove the element that was clicked...
      var index = colOrder.indexOf(this.id);
      colOrder.splice(index, 1);
      //removes the span element.
      $("#" + this.id).children().remove();
      //update the order here...
      for (var i = index; i < colOrder.length; i++) {
        $("#" + colOrder[i]).children().remove();
        $("#" + colOrder[i]).append(" <span class='label label-primary'>" + (i + 1) + "</span>");
      }
    }
  });
  $("#filterForm").submit(function(e) {
    for (var i = 0; i < colOrder.length; i++) {
      $(this).append('<input type="hidden" name="selectedCol[]" value="' + colOrder[i] + '">');
    }
  });
});
