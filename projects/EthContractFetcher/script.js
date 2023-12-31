// Connect to Ethereum mainnet via Infura
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/f38ec3cfb102401da04f4e0fbcb041f2'));

function getBlockData(blockNumber) {
    return web3.eth.getBlock(blockNumber, true);  // 'true' to get full transactions
}

function filterContractCreationTransactions(blockData) {
    return blockData.transactions.filter(tx => tx.to === null);  // contract creation transactions have 'to' field as null
}

function fetchAndDisplayBlockData(blockNumber) {
    getBlockData(blockNumber).then(blockData => {
        const contractCreationTransactions = filterContractCreationTransactions(blockData);
        const resultsElement = document.getElementById('results');
        contractCreationTransactions.forEach(tx => {
            web3.eth.getTransactionReceipt(tx.hash, function(error, receipt){
                if(!error){
                    resultsElement.innerHTML += `
                        <p>
                            Block: ${blockData.number}<br>
                            From: ${tx.from}<br>
                            Contract Address: ${receipt.contractAddress}<br>
                            Timestamp: ${new Date(blockData.timestamp * 1000).toLocaleString()}<br>
                            ---------------------
                        </p>
                    `;
                }
            });
        });
    });
}

web3.eth.getBlockNumber().then(latestBlockNumber => {
    for(let i = 0; i < 100; i++) {
        fetchAndDisplayBlockData(latestBlockNumber - i);
    }
});
