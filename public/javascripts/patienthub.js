if (window.location.pathname === '/index') {
    $('#header').hide();
} else if (window.location.pathname === '/register') {
    $("#register").addClass('active');
} else if (window.location.pathname === '/package')
    $("#package").addClass('active');
else if (window.location.pathname === '/admit')
    $("#admit").addClass('active');
else if (window.location.pathname === '/discharge')
    $("#discharge").addClass('active');
else if (window.location.pathname === '/advance')
    $("#advance").addClass('active');
else if (window.location.pathname === '/due')
    $("#dues").addClass('active');
else if (window.location.pathname === '/invoice'){
    $("#invoice").addClass('active');
    var advanceAmount = Number($('#advanceAmount').text());
    if(Number($('#dueAmount').text()))
        $('#updateduebtn').removeClass('d-none'); 
} else if (window.location.pathname === '/settings') {
    $('#blockUser input[type="checkbox"]').on("change", function(){
        var $this = $(this),
            user = $this.parents('tr').find('.js-user').text(),
            isChecked = $this.is(':checked');
        $.ajax({
            url: 'settings',
            type: 'post',
            dataType: 'json',
            data: {
                username: user,
                isBlocked: isChecked
            },
            complete: function(data) {
                var resData = JSON.parse(data.responseText);
                console.log(resData["message"]);
            }
        });        
    });
}

var invoiceItemsArr = [];
function printPage(divName) {
    $('#' + divName).removeClass('d-none');
    if (window.location.pathname === '/invoice'){
        var particularsArr = [],
            invoiceDate = $("#invoice-date").text();
        $("#particulars>.row").each(function( index ) {
            var item = $( this ).find('.item').text(),
                day = $( this ).find('.day').text(),
                rate = $( this ).find('.rate').text(),
                qty = $( this ).find('.qty').text(),
                amount= $( this ).find('.amount').text();
            if(item){
                particularsArr.push({
                    sl: index + 1,
                    particular: item,
                    day: day,
                    rate: rate,
                    qty: qty,
                    amount: amount
                });
            }
        });

        //invoice record insert with invoiceDate
        var invoicePayload = {
            registrationid: $('#regId').val(),
            patientname: $('#patientname').val(),
            paymenttype: $('#paymenttype option:selected').val(),
            invoiceDate: $('#invoicedate').val(),
            particularsList: JSON.stringify(particularsArr),
            totalAmount: $('#totalAmount').text(),
            advanceAmount: $('#advanceAmount').text(),
            payableAmount: $('#payableAmount').text(),
            paidAmount: $('#paidAmount').text(),
            dueAmount: $('#dueAmount').text()
        };
        $.ajax({
            url: 'invoice',
            type: 'post',
            dataType: 'json',
            data: invoicePayload,
            complete: function(data) {
                var resData = JSON.parse(data.responseText);
                $('#savemessage').html('<p>' + resData["message"] + '</p>');
            }
        });

        var particularsTableHeader = $('#particulars-table-header').html(),
            particularsRow = $("<div></div>");
        $('#particulars>.row>.item').each(function(){
            var $this = $(this);
            if($this.text()){
                particularsRow.append($this.parent('.row')[0].outerHTML);
            }
        });
        $('#particulars>.calc').each(function(){
            var $this = $(this);
            particularsRow.append($this[0].outerHTML);            
        });
        $("#particulars-table").html(particularsTableHeader).append(particularsRow);
    }

    if (window.location.pathname === '/advance'){
        var advancesArr = [];
        $("#advances>.row").each(function() {
            var advance = $( this ).find('.advance').text(),
                date = $( this ).find('.date').text(),
                advanceAmount= $( this ).find('.advanceAmount').text();
            if(advance){
                advancesArr.push({
                    advance: advance,
                    date: date,
                    advanceAmount: advanceAmount
                });
            }
        });

        var advancePayload = {
            registrationid: $('#regId').val(),
            advanceList: JSON.stringify(advancesArr),
            totalAdvance: $('#totalAdvanceAmount').text()
        };
        $.ajax({
            url: 'advance',
            type: 'post',
            dataType: 'json',
            data: advancePayload,
            complete: function(data) {
                var resData = JSON.parse(data.responseText);
                $('#savemessage').html('<p>' + resData["message"] + '</p>');
            }
        });

        var advancesTableHeader = $('#advances-table-header').html(),
            $advancesRow = $("<div></div>");
        $('#advances>.row>.advance').each(function(){
            var $this = $(this);
            if($this.text()){
                $advancesRow.append($this.parent('.row')[0].outerHTML);
                $advancesRow.find('.advanceAmount').removeClass('advanceAmount');
            }
        });
        $('#advances>.calc').each(function(){
            var $this = $(this);
            $advancesRow.append($this[0].outerHTML);            
        });
        $("#advances-table").html(advancesTableHeader).append($advancesRow);
    }

    if (window.location.pathname === '/due'){
        var duesArr = [];
        $("#dues>.row").each(function() {
            var due = $( this ).find('.due').text(),
            dueDate = $( this ).find('.dueDate').text(),
                dueAmount= $( this ).find('.dueAmount').text();
            if(due){
                duesArr.push({
                    due: due,
                    date: dueDate,
                    dueAmount: dueAmount
                });
            }
        });

        var duePayload = {
            registrationid: $('#regId').val(),
            patientname: $('#patientname').val(),
            dueList: JSON.stringify(duesArr),
            totalDue: $('#totalDueAmount').text()
        };

        $.ajax({
            url: 'due',
            type: 'post',
            dataType: 'json',
            data: duePayload,
            complete: function(data) {
                var resData = JSON.parse(data.responseText);
                $('#savemessage').html('<p>' + resData["message"] + '</p>');
            }
        });

        var duesTableHeader = $('#dues-table-header').html(),
            $duesRow = $("<div></div>");
        $('#dues>.row>.due').each(function(){
            var $this = $(this);
            if($this.text()){
                $duesRow.append($this.parent('.row')[0].outerHTML);
                $duesRow.find('.dueAmount').removeClass('dueAmount');
            }
        });
        $('#dues>.calc').each(function(){
            var $this = $(this);
            $duesRow.append($this[0].outerHTML);            
        });
        $("#dues-table").html(duesTableHeader).append($duesRow);
    }

    var printContents = $('#' + divName).html();
    var originalContents = $('body').html();
    $('body').html(printContents);
    window.print();
    $('body').html(originalContents);
    $('#' + divName).addClass('d-none');
}

//print invoice from invoice list
$('.printInvoice').on('click', function(){
    var particularsTable = $(this).parents('.row').find('.particulars').html(),
        invoiceDate = $(this).parents('.row').find('.invoice-date').text();
    $("#particulars-table").html(particularsTable);
    $("#printableArea #invoice-date").text(invoiceDate);
    printPage('printableArea');
});


//page redirection
function goToFunc(page, urlParam) {
    console.log(location.origin + '/' + page + '?regid=' + encodeURIComponent(urlParam));
    window.location.href = location.origin + '/' + page + '?regid=' + encodeURIComponent(urlParam);
}
//user input redirection
function userinputSubmit(pageToRedirect){
    var userInputId = $('#userinputid').val();
    goToFunc(pageToRedirect, userInputId);
}

//fetch user invoice details
function getUserInvoice(pageToRedirect){
    var userInputId = $('#userinputid').val();
    window.location.href = location.origin + '/' + pageToRedirect + '?regid=' + encodeURIComponent(userInputId) +'&isInvoice=true';    
}


$("#paymenttype").on('change', function() {
    var selected = $(this).val(),
        $hiddeninput = $("#otherpaymenttype");
    if (selected === "Other") {
        $hiddeninput.removeClass("d-none");
        $hiddeninput.prop('required', true);
    } else if (!$hiddeninput.hasClass("d-none")) {
        $hiddeninput.addClass("d-none");
        $hiddeninput.prop('required', false);
    }
});
//Other payment type value assign
$('#otherpaymenttype').on('change', function() {
    var thisVal = $(this).val();
    $('#paymenttype')
        .append($("<option selected>" + thisVal + "</option>")
            .attr("value", thisVal)).change();
});

$('input[type="number"]').on('focusout', function() {
    var $this = $(this),
        fieldVal = $this.val();
    if (Number(fieldVal) < 1) {
        if ($this.next('div').length === 0)
            $this.after("<div style='color: red'>Enter a valid number</div>");
        $this.focus();
    } else {
        $this.next('div').remove();
    }
});

var addTotalAmount = function() {
    if( isANumber ($(this)) ){
        var totalAmount = 0;
        $('.amount').each(function(){
            var $this = $(this),
                fieldVal = Number($this.text());
                if(fieldVal)
                    totalAmount += fieldVal;
        });     
        $('#totalAmount').text(totalAmount);
        if(advanceAmount){
            var payableAmount = totalAmount - advanceAmount;
            if( payableAmount > 0 ){
               $('#payableAmount').text(payableAmount);
               $('#paidAmount').text('');
               $('#dueAmount').text('');
            } else {
                $('#payableAmount').text(0); 
            }
        } else
            $('#payableAmount').text(totalAmount); 
    } else
        alert("Please enter a valid number.");        
};
//calculate total amount
$('.amount').on('focusout', addTotalAmount);
$('.amount').bind('contentchanged', addTotalAmount);

$('.advance').on('focusout', function() {
    if ($(this).text()){
        var date = new Date().toLocaleString();
        $(this).siblings('.date').text(date);
    }
});
var addTotalAdvanceAmount = function() {
    if( isANumber ($(this)) ){
        var totalAmount = 0;
        $('.advanceAmount').each(function(){
            var $this = $(this),
                fieldVal = Number($this.text());
                if(fieldVal)
                    totalAmount += fieldVal;
        });     
        $('#totalAdvanceAmount').text(totalAmount);
    } else
        alert("Please enter a valid number.");        
};
$('.advanceAmount').on('focusout', addTotalAdvanceAmount);
$('.advanceAmount').bind('contentchanged', addTotalAdvanceAmount);


$('.due').on('focusout', function() {
    if ($(this).text()){
        var date = new Date().toLocaleString();
        $(this).siblings('.dueDate').text(date);
    }
});

var addTotalDueAmount = function() {
    if( isANumber ($(this)) ){
        var totalDueAmount = 0;
        $('.dueAmount').each(function(){
            var $this = $(this),
                fieldVal = Number($this.text());
                if(fieldVal){
                    if(totalDueAmount === 0)
                        totalDueAmount = fieldVal;
                    else
                        totalDueAmount -= fieldVal;
                    if(totalDueAmount < 0)
                        totalDueAmount = 0;
                }
        });     
        $('#totalDueAmount').text(totalDueAmount);
    } else
        alert("Please enter a valid number.");        
};
$('.dueAmount').on('focusout', addTotalDueAmount);
$('.dueAmount').bind('contentchanged', addTotalDueAmount);


$('.rate').on('focusout', function() {
    if( isANumber ($(this)) ){
        var $this = $(this),
            rate = Number($this.text()),
            qty = Number($this.siblings('.qty').text());
        if(qty){
            $this.siblings('.amount').text(rate * qty);
            $('.amount').trigger('contentchanged');
        }
    } else
        alert("Please enter a valid number.");        
});
$('.qty').on('focusout', function() {
    if( isANumber ($(this)) ){
        var $this = $(this),
            qty = Number($this.text()),
            rate = Number($this.siblings('.rate').text());
        if(qty){
            $this.siblings('.amount').text(rate * qty);
            $('.amount').trigger('contentchanged');
        }
    } else
        alert("Please enter a valid number.");        
});

$('#paidAmount').on('focusout', function() {
    
    var $this = $(this);
    if( isANumber ( $this )){
        var fieldVal = Number($this.text()),
            $payableAmount = $('#payableAmount');
        if( isANumber($payableAmount)){
            var dueAmount = Number($payableAmount.text()) - fieldVal;
            $('#dueAmount').text(dueAmount);
            if(dueAmount)
                $('#updateduebtn').removeClass('d-none');
            else
                $('#updateduebtn').addClass('d-none');                
        }
    } else if ($this.text() != "-")
        alert("Please enter a valid number.");  
});

function isANumber($this){
    var fieldVal = Number($this.text());
    if( isNaN(fieldVal) ){
        $this.text('');
        $this.focus();
        return false;
    } else
        return true;
}

$('#advance').on('focusout', function() {
    
    var $this = $(this);
    var fieldVal = Number($this.val());
    if ( isNaN(fieldVal) ){
        alert("Please enter a valid number."); 
        $this.val('');
        $this.focus();
    }
});

/* Date picker validation for all dues page*/
$("#startdate").on('change', function(){
    var endDateText = $("#enddate").val(),
        startDateText = $(this).val(),
        startDate = new Date(startDateText),
        currentDate = Date.now();
    startDate.setHours(0,0,0,0);  
    currentDate.setHours(0,0,0,0);  
    if(startDate > currentDate){
        alert("Future Date not allowed.");
        $(this).val("");
    } else if(endDateText){
        var endDate = new Date(endDateText);
        endDate.setHours(0,0,0,0);  
        if(startDate > endDate){
            alert("Start Date should not be greater than end date.");
            $(this).val("");
        }
    }
});
$("#enddate").on('change', function(){
    var startDateText = $("#startdate").val(),
        endDateText = $(this).val(),
        endDate = new Date(endDateText),
        currentDate = Date.now();
    endDate.setHours(0,0,0,0);  
    currentDate.setHours(0,0,0,0);
    if(endDate > currentDate){
        alert("Future Date not allowed.");
        $(this).val("");
    } else if(startDateText){
        var startDate = new Date(startDateText);
        startDate.setHours(0,0,0,0);
        if(startDate > endDate){
            alert("Start Date should not be greater than end date.");
            $(this).val("");
        }
    }
});

if (window.location.pathname === '/advance'){
    $('.advanceAmount').trigger('contentchanged');
} else if (window.location.pathname === '/due'){
    $('.dueAmount').trigger('contentchanged');
}
