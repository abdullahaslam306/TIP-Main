
$('#InitialPaymentForm').on('submit', function (event) {
    var data = {
        amount: $('#paymentAmount').val()
        };
    alert("asdsad")
    $.ajax({
        type: 'POST',
        url: '/user/pay',
        data: data,
        success: function( response ) {
            console.log( response );
        }
});
event.preventDefault;
return false;
});
    