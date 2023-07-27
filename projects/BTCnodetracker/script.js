async function get_node_data() {
    const url = 'https://bitnodes.io/api/v1/snapshots/latest/';
    const response = await fetch(url);
    
    if (!response.ok) {
        console.error("Could not get data from the API");
        return;
    }
    
    const data = await response.json();
    const nodes = data.nodes;
    const nodesPerCountry = nodes_per_country(nodes);
    display_data(nodesPerCountry);
    map_data(nodes);
}

function nodes_per_country(node_data) {
    const countries = {};
    for (let key in node_data) {
        let country = node_data[key][7];
        if (!country) continue;
        countries[country] = (countries[country] || 0) + 1;
    }
    return countries;
}

function display_data(nodesPerCountry) {
    let totalNodes = 0;
    let nodeDataHtml = '';
    for (let country in nodesPerCountry) {
        totalNodes += nodesPerCountry[country];
        nodeDataHtml += `<li>${country}: ${nodesPerCountry[country]}</li>`;
    }
    document.getElementById('total-nodes').textContent = `Total number of nodes: ${totalNodes}`;
    document.getElementById('node-data').innerHTML = nodeDataHtml;
}

function map_data(nodes) {
    const map = L.map('map').setView([0, 0], 1);  // Initial focus point of the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    for (let key in nodes) {
        let lat = nodes[key][9];
        let lon = nodes[key][10];
        if (lat && lon) {
            L.marker([lat, lon]).addTo(map);
        }
    }
}

// Call the function to get the data when the page loads
get_node_data();
