$(document).ready(function(){
    $('#form').on('submit', function(event) {
        event.preventDefault();
        $.ajax({
            url: `https://net1ife.pythonanywhere.com/get_pairs/${$('#exchange').val()}/${$('#pairs').val()}`,
            type: 'GET',
            success: function(data) {
                $('#result').empty();
                data.forEach(function(pair) {
                    $('#result').append(
                        `<p>Token 0: ${pair.token0.symbol} (${pair.token0.id}) - Token 1: ${pair.token1.symbol} (${pair.token1.id}) - Reserve USD: ${pair.reserveUSD}</p>`
                    );
                });
            }
        });
    });
});
