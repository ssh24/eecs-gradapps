$(document).ready(function () {
    
    
    var currColumn = 1;
    //add numbers to indicate order of buttons
    $(".modal-body #columns .btn").click(function () {
        $(this).append(" <span class='badge'>" + currColumn+ "</span>")
        currColumn++;
    });
});
