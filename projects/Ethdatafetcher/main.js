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
        blockPanel.classList.add('block-panel');
        blockPanel.innerHTML = `
            <h2>Block ${i + 1} (Block Number: ${block.number})</h2>
            <div class="block-details">
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
            blockPanel.querySelector('.block-details').appendChild(txDetails);
        }

        // Append the block panel to the content div
        content.appendChild(blockPanel);

        // Add click event to toggle block details
        blockPanel.querySelector('h2').addEventListener('click', (event) => {
            let blockDetails = event.target.nextElementSibling;
            blockDetails.style.display = blockDetails.style.display === "none" ? "block" : "none";
        });
    }
};
