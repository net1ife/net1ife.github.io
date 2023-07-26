const Web3 = window.Web3;
const web3 = new Web3(new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${localStorage.getItem('INFURA_PROJECT_ID')}`));

const contentDiv = document.getElementById('content');
const blockForm = document.getElementById('blockForm');
const blockNumber = document.getElementById('blockNumber');

async function getBlockDetails(blockNumber) {
    try {
        return await web3.eth.getBlock(blockNumber);
    } catch (error) {
        console.log(`Failed to fetch block ${blockNumber}`);
        return null;
    }
}

async function getTransactionDetails(tx) {
    try {
        return await web3.eth.getTransaction(tx);
    } catch (error) {
        console.log(`Failed to fetch transaction ${tx}`);
        return null;
    }
}

function printTransactionDetails(txDetails, idx) {
    if (txDetails['to']) {
        contentDiv.innerHTML += `<p>Transaction ${idx}: ${txDetails['hash']} <br>From: ${txDetails['from']} <br>To: ${txDetails['to']} <br>Amount: ${web3.utils.fromWei(txDetails['value'], 'ether')} Ether</p>`;
    } else {
        contentDiv.innerHTML += `<p>Contract creation transaction ${idx}: ${txDetails['hash']} <br>From: ${txDetails['from']}</p>`;
    }
}

async function printBlockDetails(latestBlock, i) {
    const block = await getBlockDetails(latestBlock - i);
    if (block == null) return;

    contentDiv.innerHTML += `<h2>Block ${i+1} (Block Number: ${block.number})</h2>`;
    contentDiv.innerHTML += `<p>Number of transactions: ${block.transactions.length}</p>`;

    for (let idx = 0; idx < block.transactions.length; idx++) {
        const txDetails = await getTransactionDetails(block.transactions[idx]);
        if (txDetails == null) continue;
        printTransactionDetails(txDetails, idx+1);
    }
}

async function printBlocks(numBlocks) {
    let latestBlock;
    try {
        latestBlock = await web3.eth.getBlockNumber();
    } catch (error) {
        console.log("Failed to connect to the Ethereum network");
        return;
    }

    for (let i = 0; i < numBlocks; i++) {
        await printBlockDetails(latestBlock, i);
    }
}

blockForm.onsubmit = function(e) {
    e.preventDefault();  
    contentDiv.innerHTML = "";  
    printBlocks(blockNumber.value); 
}

