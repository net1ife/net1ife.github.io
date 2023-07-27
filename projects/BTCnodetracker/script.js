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
    map_data(nodesPerCountry);
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

async function map_data(nodesPerCountry) {
    const map = L.map('map').setView([0, 0], 1);  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    let promises = [];

    for (let country in nodesPerCountry) {
        let nodesInCountry = nodesPerCountry[country];
        for (let i = 0; i < nodesInCountry; i++) {
            promises.push(getRandomCoordsInCountry(country));
        }
    }

    let coords = await Promise.all(promises);

    for (let coord of coords) {
        L.marker(coord).addTo(map);
    }
}

async function getRandomCoordsInCountry(country) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?country=${country}&format=json`);
    const data = await response.json();
    if (data.length === 0) return [0, 0]; 
    let lat = parseFloat(data[0].lat);
    let lon = parseFloat(data[0].lon);
    // Add more randomness to the coordinates
    lat += Math.random() * 2 - 1;
    lon += Math.random() * 2 - 1;
    return [lat, lon];
}


get_node_data();
