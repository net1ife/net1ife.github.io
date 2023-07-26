const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/f38ec3cfb102401da04f4e0fbcb041f2'));

document.getElementById("blockForm").addEventListener('submit', (event) => {
    event.preventDefault();
    let blockNumber = document.getElementById("blockNumber").value;
    getBlocks(blockNumber);
});

const getBlocks = async (blockNumber) => {
    let content = document.getElementById('content');
    content.innerHTML = '';  // Clear previous results

    // Get the latest block number
    const latestBlock = await web3.eth.getBlockNumber();

    // Fetch the requested number of blocks
    for (let i = 0; i < blockNumber; i++) {
        const block = await web3.eth.getBlock(latestBlock - i);

        // Create the block panel
        let blockPanel = document.createElement('div');
        blockPanel.innerHTML = `
            <h2 onclick="togglePanel(event)">Block ${i + 1} (Block Number: ${block.number}) - Click to expand</h2>
            <div style="display: none;">
                <p>Number of transactions: ${block.transactions.length}</p>
            </div>
        `;

        // Fetch transactions of the block
        for (let j = 0; j < block.transactions.length; j++) {
            const tx = await web3.eth.getTransaction(block.transactions[j]);

            // Append transaction to the block panel
            let txDetails = document.createElement('p');
            if (tx.to) {
                txDetails.innerHTML = `
                    Transaction ${j + 1}: ${tx.hash} <br>
                    From: ${tx.from} <br>
                    To: ${tx.to} <br>
                    Amount: ${web3.utils.fromWei(tx.value, 'ether')} Ether
                `;
            } else {
                txDetails.innerHTML = `
                    Contract creation transaction ${j + 1}: ${tx.hash} <br>
                    From: ${tx.from}
                `;
            }
            blockPanel.children[1].appendChild(txDetails);
        }

        // Append the block panel to the content div
        content.appendChild(blockPanel);
    }
};

const togglePanel = (event) => {
    let blockPanel = event.target.nextSibling;

    // Toggle display property
    if (blockPanel.style.display === "none") {
        blockPanel.style.display = "block";
    } else {
        blockPanel.style.display = "none";
    }
};

