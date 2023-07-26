const form = document.getElementById('dexForm');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    const dex = document.getElementById('dex').value;
    const num_pairs = document.getElementById('num_pairs').value;
    let subgraph_url;
    if (dex === 'uniswap') {
        subgraph_url = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';
    } else {
        subgraph_url = 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange';
    }
    const query = `
        query {
            pairs(first: ${num_pairs}, orderBy: reserveUSD, orderDirection: desc) {
                token0 {
                    symbol
                    id
                }
                token1 {
                    symbol
                    id
                }
                reserveUSD
            }
        }
    `;
    fetch(subgraph_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query,
        }),
    })
    .then(response => response.json())
    .then(data => {
        let pairsElement = document.getElementById('pairs');
        pairsElement.innerHTML = '<h2>DEX Pairs</h2>';
        data.data.pairs.forEach(pair => {
            pairsElement.innerHTML += `<p>Pair: ${pair.token0.symbol}-${pair.token1.symbol}, Reserve: ${pair.reserveUSD}</p>`;
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
