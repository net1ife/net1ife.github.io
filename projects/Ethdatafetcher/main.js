const Web3 = window.Web3;
const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/f38ec3cfb102401da04f4e0fbcb041f2'));

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

function printTransactionDetails(txDetails, idx, blockDiv) {
    let p = document.createElement('p');
    if (txDetails['to']) {
        p.innerHTML = `Transaction ${idx}: ${txDetails['hash']} <br>From: ${txDetails['from']} <br>To: ${txDetails['to']} <br>Amount: ${web3.utils.fromWei(txDetails['value'], 'ether')} Ether`;
    } else {
        p.innerHTML = `Contract creation transaction ${idx}: ${txDetails['hash']} <br>From: ${txDetails['from']}`;
    }
    blockDiv.appendChild(p);
}

async function printBlockDetails(latestBlock, i) {
    const block = await getBlockDetails(latestBlock - i);
    if (block == null) return;

    let blockDiv = document.createElement('div');
    blockDiv.className = "blockDiv";
    blockDiv.innerHTML += `<h2 onclick="this.nextElementSibling.classList.toggle('hidden')">Block ${i+1} (Block Number: ${block.number})</h2><div class='hidden'>`;
    blockDiv.innerHTML += `<p>Number of transactions: ${block.transactions.length}</p>`;

    for (let idx = 0; idx < block.transactions.length; idx++) {
        const txDetails = await getTransactionDetails(block.transactions[idx]);
        if (txDetails == null) continue;
        printTransactionDetails(txDetails, idx+1, blockDiv);
    }
    blockDiv.innerHTML += '</div>';
    contentDiv.appendChild(blockDiv);
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
    e.preventDefault();  // Prevent the form from refreshing the page
    contentDiv.innerHTML = "";  // Clear the content
    printBlocks(blockNumber.value);  // Print the requested number of blocks
}
