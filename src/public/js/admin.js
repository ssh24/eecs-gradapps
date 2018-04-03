'use strict';

$(document).ready(function() {
    var table = $('#applicant-table');
    var indexToNotInclude;

    $('#table-head > tr > th').each(function() {
        if( $(this).text() === 'Actions') {
            indexToNotInclude = $('#table-head > tr > th').index(this);
        }
    });
    
    TableExport(table, {filename: "grad-apps-applications", 
        bootstrap: true, formats: ['csv'], position: 'top',
        trimWhitespace: true, ignoreCols: indexToNotInclude});

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
    $("#applicant-table").tablesorter({
        dateFormat: "mm/dd/yyyy",
    });
});