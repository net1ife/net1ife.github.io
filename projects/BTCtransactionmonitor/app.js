const ws = new WebSocket("wss://ws.blockchain.info/inv");

ws.onopen = function(event) {
    ws.send(JSON.stringify({"op": "unconfirmed_sub"}));
};

ws.onmessage = function(event) {
    const response = JSON.parse(event.data);
    if (response.op !== 'utx') return;

    const transactionElement = document.createElement('div');
    transactionElement.classList.add('transaction');

    transactionElement.innerHTML = `
        <h2>Transaction ID: ${response.x.hash}</h2>
        <p>Received at: ${new Date(response.x.time * 1000).toLocaleString()}</p>
        <h3>Inputs:</h3>
        ${response.x.inputs.map(input => `<p> - From Address: ${input.prev_out.addr}<br> - Amount: ${input.prev_out.value / 1e8} BTC</p>`).join('')}
        <h3>Outputs:</h3>
        ${response.x.out.map(output => `<p> - To Address: ${output.addr}<br> - Amount: ${output.value / 1e8} BTC</p>`).join('')}
    `;

    document.getElementById('transactions').prepend(transactionElement);
};

ws.onerror = function(event) {
    console.log("Error occurred: ", event);
};

ws.onclose = function(event) {
    console.log("Connection closed");
};
