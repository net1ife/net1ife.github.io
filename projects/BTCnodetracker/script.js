fetch('https://bitnodes.io/api/v1/snapshots/latest/')
    .then(response => response.json())
    .then(data => {
        const nodeData = data.nodes;
        const countries = Object.values(nodeData).map(details => details[7]);
        const counts = {};
        countries.forEach(country => {
            counts[country] = (counts[country] || 0) + 1;
        });

        const totalNodes = Object.values(counts).reduce((a, b) => a + b, 0);
        document.getElementById('sidebar').querySelector('h1').textContent = `Total number of nodes: ${totalNodes}`;

        const nodeDataList = document.getElementById('node-data');
        Object.entries(counts).forEach(([country, count]) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${country}: ${count}`;
            nodeDataList.appendChild(listItem);
        });

        const chart = new Chart(document.getElementById('node-chart').getContext('2d'), {
            type: 'pie',
            data: {
                labels: Object.keys(counts),
                datasets: [{
                    data: Object.values(counts),
                    backgroundColor: Object.keys(counts).map(() => '#' + Math.floor(Math.random()*16777215).toString(16)),
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                var label = context.label || '';
                                if (label) {
                                    label += ': ';
                                    label += context.raw;
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    });
