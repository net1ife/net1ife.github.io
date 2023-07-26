// Connect to Ethereum mainnet via Infura
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/f38ec3cfb102401da04f4e0fbcb041f2'));

function getBlockData(blockNumber) {
    return web3.eth.getBlock(blockNumber, true);  
}

function filterContractCreationTransactions(blockData) {
    return blockData.transactions.filter(tx => tx.to === null); 
}

function fetchAndDisplayBlockData(blockNumber) {
    getBlockData(blockNumber).then(blockData => {
        const contractCreationTransactions = filterContractCreationTransactions(blockData);
        const resultsElement = document.getElementById('results');
        contractCreationTransactions.forEach(tx => {
            resultsElement.innerHTML += `
                <p>
                    Block: ${blockData.number}<br>
                    From: ${tx.from}<br>
                    Contract Address: ${tx.contractAddress}<br>
                    Timestamp: ${new Date(blockData.timestamp * 1000).toLocaleString()}<br>
                    ---------------------
                </p>
            `;
        });
    });
}

web3.eth.getBlockNumber().then(latestBlockNumber => {
    for(let i = 0; i < 10; i++) {
        fetchAndDisplayBlockData(latestBlockNumber - i);
    }
});
