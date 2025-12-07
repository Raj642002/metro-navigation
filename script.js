class ListNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class MinHeap {
    constructor() {
        this.head = null;
    }

    add(node) {
        const newNode = new ListNode(node);
        if (!this.head || node.cost < this.head.value.cost) {
            newNode.next = this.head;
            this.head = newNode;
        } else {
            let current = this.head;
            while (current.next && current.next.value.cost <= node.cost) {
                current = current.next;
            }
            newNode.next = current.next;
            current.next = newNode;
        }
    }

    remove() {
        if (!this.head) return null;
        const minNode = this.head.value;
        this.head = this.head.next;
        return minNode;
    }

    isEmpty() {
        
        if(this.head === null)
            return true ;
        else return false ;
    }
}


class Vertex {
    constructor() {
        this.nbrs = new Map();
    }
}

class Graph {
    constructor() {
        this.vtces = new Map();
    }

    addVertex(vname) {
        if (!this.vtces.has(vname)) {
            this.vtces.set(vname, new Vertex());
        }
    }

    addEdge(v1, v2, weight) {
        if (this.vtces.has(v1) && this.vtces.has(v2)) {
            this.vtces.get(v1).nbrs.set(v2, weight);
            this.vtces.get(v2).nbrs.set(v1, weight);
        }
    }

    containsVertex(vname) {
        return this.vtces.has(vname);
    }
}


function crate_Metro_Map(g){
        const stations = [
            "Noida Sector 62~B", "Botanical Garden~B", "Yamuna Bank~B", "Rajiv Chowk~BY", "Vaishali~B",
        "Moti Nagar~B", "Janak Puri West~BO", "Dwarka Sector 21~B", "Huda City Center~Y", "Saket~Y",
        "Vishwavidyalaya~Y", "Chandni Chowk~Y", "New Delhi~YO", "AIIMS~Y", "Shivaji Stadium~O",
        "DDS Campus~O", "IGI Airport~O", "Rajouri Garden~BP", "Netaji Subhash Place~PR", "Punjabi Bagh West~P"
        ];

        stations.forEach(s => g.addVertex(s));

        const edges = [
            ["Noida Sector 62~B", "Botanical Garden~B", 8],
            ["Botanical Garden~B", "Yamuna Bank~B", 10],
            ["Yamuna Bank~B", "Vaishali~B", 8],
            ["Yamuna Bank~B", "Rajiv Chowk~BY", 6],
            ["Rajiv Chowk~BY", "Moti Nagar~B", 9],
            ["Moti Nagar~B", "Janak Puri West~BO", 7],
            ["Janak Puri West~BO", "Dwarka Sector 21~B", 6],
            ["Huda City Center~Y", "Saket~Y", 15],
            ["Saket~Y", "AIIMS~Y", 6],
            ["AIIMS~Y", "Rajiv Chowk~BY", 7],
            ["Rajiv Chowk~BY", "New Delhi~YO", 1],
            ["New Delhi~YO", "Chandni Chowk~Y", 2],
            ["Chandni Chowk~Y", "Vishwavidyalaya~Y", 5],
            ["New Delhi~YO", "Shivaji Stadium~O", 2],
            ["Shivaji Stadium~O", "DDS Campus~O", 7],
            ["DDS Campus~O", "IGI Airport~O", 8],
            ["Moti Nagar~B", "Rajouri Garden~BP", 2],
            ["Punjabi Bagh West~P", "Rajouri Garden~BP", 2],
            ["Punjabi Bagh West~P", "Netaji Subhash Place~PR", 3]
        ];

        edges.forEach(([v1,v2,wt]) =>g.addEdge(v1,v2,wt));
}  
const metroGraph = new Graph();
crate_Metro_Map(metroGraph);

// const src = document.getElementById("source");
// const dest = document.getElementById("destination");
// const res = document.getElementById("result");

function fillstations(src, dest) {
    const stations = Array.from(metroGraph.vtces.keys());

    stations.forEach(station => {
        const opt1 = document.createElement("option");
        opt1.value = station;
        opt1.text = station;
        src.appendChild(opt1);

        const opt2 = document.createElement("option");
        opt2.value = station;
        opt2.text = station;
        dest.appendChild(opt2);
    });
}


// function getDistance(graph,src,dest)
// {
//     if(!graph.containsVertex(src) || !graph.containsVertex(dest))
//     {
//         return "Either of Source or Destination Station Not Exist";
//     }
//     else if(src === dest)
//         return "you are already on the destination";

//     const neighbors = graph.vtces.get(src).nbrs;
     
//     if (neighbors.has(dest)) {
//         return ${neighbors.get(dest)} km;
//     } else {
//         return "No direct Route.";
//     }

// }

// document.getElementById("finddistance").addEventListener("click", () => {
//     const sourceStation = src.value;
//     const destinationStation = dest.value;

//     if (sourceStation && destinationStation) {
//         const distance = getMinimumDistance(metroGraph, sourceStation, destinationStation);
//         res.textContent = Distance from "${sourceStation}" to "${destinationStation}" is: ${distance};
//     } else {
//         res.textContent = "Please select both source and destination stations.";
//     }
// });



function logout()
{
    window.location.href="loginmetro.html" ;
}


function showpath() {
    const src = document.getElementById("source").value;
    const dest = document.getElementById("destination").value;

    if (!src || !dest) {
        alert("Select source and destination first");
        return;
    }

    const result = getMinimumDistance(metroGraph, src, dest);
    localStorage.setItem("pathToHighlight", JSON.stringify(result.path));

    const width = 700;
    const height = 600;
    // const left = (window.screen.width / 2) - (width / 2);
    // const top = (window.screen.height / 2) - (height / 2);
    const left = 700;
    const top = 100;

    window.open(
        "graph.html",
        "Metro Graph Visualization",
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
}


function createGraphVisualization(graph, path = []) {
    const nodes = [];
    const edges = [];

    const pathSet = new Set();  // To store path edges as "from->to"
    for (let i = 0; i < path.length - 1; i++) {
        pathSet.add(`${path[i]}->${path[i + 1]}`);
        pathSet.add(`${path[i + 1]}->${path[i]}`); // Because the graph is undirected
    }

    const pathNodeSet = new Set(path);

    graph.vtces.forEach((vertex, vname) => {
        nodes.push({
            id: vname,
            label: vname,
            color: pathNodeSet.has(vname) ? "#32CD32" : "#97C2FC",  // Green if in path
            font: { color: "black", bold: pathNodeSet.has(vname) }
        });

        vertex.nbrs.forEach((weight, neighbor) => {
            const edgeKey = `${vname}->${neighbor}`;
            const isPathEdge = pathSet.has(edgeKey);

            edges.push({
                from: vname,
                to: neighbor,
                label:  `${weight} km`,
                color: { color: isPathEdge ? "green" : "blue" },
                width: isPathEdge ? 3 : 1.5,
            });
        });
    });

    const container = document.getElementById("network");
    if (!container) {
        console.error("Network container not found.");
        return;
    }

    const data = {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges),
    };

    const options = {
        edges: {
            arrows: { to: { enabled: true } },
        },
        physics: {
            enabled: true,
            solver: "forceAtlas2Based",
        },
    };

    new vis.Network(container, data, options);
}










window.addEventListener("DOMContentLoaded", () => {
    const src = document.getElementById("source");
    const dest = document.getElementById("destination");
    const res = document.getElementById("result");

    fillstations(src, dest);

    document.getElementById("finddistance").addEventListener("click", () => {
        const sourceStation = src.value;
        const destinationStation = dest.value;

        if (sourceStation && destinationStation) {
            const result = getMinimumDistance(metroGraph, sourceStation, destinationStation);
            const distanceText = result.distance;
            const pathText = result.path.length ? `Path: ${result.path.join(" → ")}` : "No path available";

            res.innerHTML = `"${sourceStation}" to "${destinationStation}" : ${distanceText}`;
        } else {
            res.innerHTML = "Please select both source and destination stations.";
        }
    });
});



function getMinimumDistance(graph, src, dest) {
    if (!graph.containsVertex(src) || !graph.containsVertex(dest)) {
        return { distance: "Station not found", path: [] };
    }
    if (src === dest) {
        return { distance: 0, path: [src] };
    }

    const distances = new Map();
    const prev = new Map();
    const minHeap = new MinHeap();

    graph.vtces.forEach((_, vertex) => {
        distances.set(vertex, Infinity);
        prev.set(vertex, null);
    });

    distances.set(src, 0);
    minHeap.add({ station: src, cost: 0 });

    while (!minHeap.isEmpty()) {
        const { station, cost } = minHeap.remove();

        if (station === dest) break;

        const neighbors = graph.vtces.get(station).nbrs;
        neighbors.forEach((weight, neighbor) => {
            const newDist = cost + weight;
            if (newDist < distances.get(neighbor)) {
                distances.set(neighbor, newDist);
                prev.set(neighbor, station);
                minHeap.add({ station: neighbor, cost: newDist });
            }
        });
    }

    let path = [];
    let current = dest;
    while (current) {
        path.unshift(current);
        current = prev.get(current);
    }

    return {
        distance: distances.get(dest) === Infinity ? "No path found" : distances.get(dest) + " km",
        path
    };
}
