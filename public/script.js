const DEFAULT_MODE = 'color'
const DEFAULT_SIZE = 16
const DEFAULT_COLOR = '#333333'
let currentColor = DEFAULT_COLOR
let currentMode = DEFAULT_MODE
let currentSize = DEFAULT_SIZE
let algoRan = false;

function setCurrentSize(newSize) {
    currentSize = newSize
}

function setCurrentMode(newMode) {
    activateButton(newMode)
    currentMode = newMode;
}

const startBtn = document.getElementById('startBtn')
const endBtn = document.getElementById('endBtn')
const startAlgoBtn = document.getElementById('startAlgoBtn')
const colorBtn = document.getElementById('colorBtn')
const eraserBtn = document.getElementById('eraserBtn')
const clearBtn = document.getElementById('clearBtn')
const sizeValue = document.getElementById('sizeValue')
const sizeSlider = document.getElementById('sizeSlider')
const grid = document.getElementById('grid')

startAlgoBtn.onclick = () => runAlgo(getAlgoType())
startBtn.onclick = () => setCurrentMode('start')
endBtn.onclick = () => setCurrentMode('end')
colorBtn.onclick = () => setCurrentMode('color')
eraserBtn.onclick = () => setCurrentMode('eraser')
clearBtn.onclick = () => reloadGrid()
sizeSlider.onmousemove = (e) => updateSizeValue(e.target.value)
sizeSlider.onchange = (e) => changeSize(e.target.value)

let mouseDown = false
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)

//function that gets the selected value from html of id='algos' based in its current option selected
function getAlgoType() {
    return document.getElementById('algos').value;
}

function runAlgo(algoName) {
    if (algoName == "dijkstra") {
        colorShortestPathGradient(findShortPathV2());
        return;
    }
    if (algoName == "dfs") {
        colorShortestPathGradient2(findShortPathDFS());
    }
    if( algoName == "bfs"){
        colorShortestPathGradientBFS(findShortPathV2());
    }
}

function changeSize(value) {
    setCurrentSize(value)
    updateSizeValue(value)
    reloadGrid()
}

function updateSizeValue(value) {
    sizeValue.innerHTML = `${value} x ${value}`
}

function reloadGrid() {
    clearGrid()
    setupGrid(currentSize)
}

function clearGrid() {
    grid.innerHTML = ''
}


function setupGrid(size) {
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`

    for (let i = 0; i < size * size; i++) {
        const gridElement = document.createElement('div')
        gridElement.classList.add('grid-element')
        gridElement.addEventListener('mouseover', changeColor)
        gridElement.addEventListener('mousedown', changeColor)
        grid.appendChild(gridElement)
    }
}

function changeColor(e) {
    if (e.type === 'mouseover' && !mouseDown) return
    if (currentMode === 'eraser') {
        e.target.style.backgroundColor = '#fefefe';
        e.target.classList.remove('blockage'); // remove class "blockage" if in eraser mode
        e.target.classList.remove('start'); // remove class "start" if in eraser mode
        e.target.classList.remove('end');
    } else if (currentMode === 'color') {
        if (algoRan == true) {
            reloadGrid();
            algoRan = false;
        }
        e.target.style.backgroundColor = currentColor;
        e.target.classList.add('blockage'); // add class "blockage" if in color mode
        e.target.classList.remove('start'); // remove class "start" if in eraser mode
        e.target.classList.remove('end');
    } else if (currentMode === 'start') {
        removeStartBlock();
        if (algoRan == true) {
            reloadGrid();
            algoRan = false;
        }
        e.target.style.backgroundColor = '#00ff00';
        e.target.classList.add('start'); // add class "start" if in start mode
        e.target.classList.remove('blockage'); // remove class "blockage" if in eraser mode
        e.target.classList.remove('end');
    } else if (currentMode === 'end') {
        removeEndBlock();
        if (algoRan == true) {
            reloadGrid();
            algoRan = false;
        }
        e.target.style.backgroundColor = '#FF0000';
        e.target.classList.add('end'); // add class "end" if in end mode
        e.target.classList.remove('blockage'); // remove class "blockage" if in eraser mode
        e.target.classList.remove('start'); // remove class "start" if in eraser mode
    }
}

function activateButton(newMode) {
    if (currentMode === 'color') {
        colorBtn.classList.remove('active')
    } else if (currentMode === 'eraser') {
        eraserBtn.classList.remove('active')
    } else if (currentMode === 'start') {
        startBtn.classList.remove('active')
    } else if (currentMode === 'end') {
        endBtn.classList.remove('active')
    }

    if (newMode === 'color') {
        colorBtn.classList.add('active')
    } else if (newMode === 'eraser') {
        eraserBtn.classList.add('active')
    } else if (newMode === 'start') {
        startBtn.classList.add('active')
    } else if (newMode === 'end') {
        endBtn.classList.add('active')
    }
}

//function that checks if there is a grid with a start block
function startBlockExist() {
    var gridElements = document.getElementsByClassName('grid-element');
    for (var i = 0; i < gridElements.length; i++) {
        if (gridElements[i].classList.contains('start')) {

            return true;
        }
    }

    return false;
}

//function that checks if there is a grid with an end block
function endBlockExist() {
    var gridElements = document.getElementsByClassName('grid-element');
    for (var i = 0; i < gridElements.length; i++) {
        if (gridElements[i].classList.contains('end')) {

            return true;
        }
    }

    return false;
}

//function that if there is a start block, it removes that start block
function removeStartBlock() {
    var gridElements = document.getElementsByClassName('grid-element');
    for (var i = 0; i < gridElements.length; i++) {
        if (gridElements[i].classList.contains('start')) {
            gridElements[i].style.backgroundColor = '#fefefe';
            gridElements[i].classList.remove('start');
        }
    }
}

//function that if there is an end block, it removes that end block
function removeEndBlock() {
    var gridElements = document.getElementsByClassName('grid-element');
    for (var i = 0; i < gridElements.length; i++) {
        if (gridElements[i].classList.contains('end')) {
            gridElements[i].style.backgroundColor = '#fefefe';
            gridElements[i].classList.remove('end');
        }
    }
}

//function that returns location of start block
function getStartBlock() {
    var curr = convertGridToNodes();
    let temp = "Top: " + getTopNode(curr) + " Left: " + getLeftNode(curr) + " Right: " + getRightNode(curr) + " Bottom: " + getBottomNode(curr) + " Loc: " + curr.loc;
    return temp;
}
//given a node return location of top/left/right/bottom nodes if they exist
function getTopNode(node) {
    if (node.top != null) {
        return node.top.loc;
    }
    return null;
}

function getLeftNode(node) {
    if (node.left != null) {
        return node.left.loc;
    }
    return null;
}

function getRightNode(node) {
    if (node.right != null) {
        return node.right.loc;
    }
    return null;
}

function getBottomNode(node) {
    if (node.bottom != null) {
        return node.bottom.loc;
    }
    return null;
}

//node class that holds 4 nodes for top,left,right,bottom and an int for the distance from the start node
class Node {
    constructor(top, left, right, bottom, distance, blockage, loc, start, end, parent) {
        this.top = top;
        this.left = left;
        this.right = right;
        this.bottom = bottom;
        this.distance = distance;
        this.blockage = blockage;
        this.loc = loc;
        this.isStart = start;
        this.isEnd = end;
        this.parent = parent;
    }
}
//function that converts grid into nodes based of the start node and returns the start node
function convertGridToNodes() {
    var gridElements = document.getElementsByClassName('grid-element');
    var startNode = null;
    var endNode = null;
    var nodes = [];
    var gridSize = gridElements.length;
    gridSize = Math.sqrt(gridSize);
    for (var i = 0; i < gridElements.length; i++) {
        var top = null;
        var left = null;
        var right = null;
        var bottom = null;
        var distance = null;
        var blockage = false;
        var loc = null;
        gridElements[i].id = i;
        if (gridElements[i].classList.contains('start')) {
            startNode = new Node(top, left, right, bottom, distance, false, loc, true, false, null);
            startNode.distance = 0;
            startNode.loc = i;
            nodes.push(startNode);
        } else if (gridElements[i].classList.contains('end')) {
            endNode = new Node(top, left, right, bottom, 100000, false, loc, false, true, null);
            endNode.loc = i;
            nodes.push(endNode);
        } else if (gridElements[i].classList.contains('blockage')) {
            nodes.push(new Node(top, left, right, bottom, 100000, true, i, false, false, null));
        } else {
            nodes.push(new Node(top, left, right, bottom, 100000, false, i, false, false, null));
        }
    }
    for (var i = 0; i < nodes.length; i++) {
        //assign nodes to top,left,right,bottom based on grid size
        if (i - gridSize >= 0) {
            nodes[i].top = nodes[i - gridSize];
        }
        if (i - 1 >= 0 && i % gridSize != 0) {
            nodes[i].left = nodes[i - 1];
        }
        if (i + 1 < nodes.length && (i + 1) % gridSize != 0) {
            nodes[i].right = nodes[i + 1];
        }
        if (i + gridSize < nodes.length) {
            nodes[i].bottom = nodes[i + gridSize];
        }

    }
    return [startNode, endNode];
}
//does the same as colorShortestPath() but colors in a gradient the further it is from the location of the first node the darker the color
function colorShortestPathGradient(visited) {
    if (!startBlockExist() || !endBlockExist()) {
        return;
    }
    //store the start and end node
    var startNode = visited[0][0];
    var endNode = visited[0][visited[0].length - 1];

    var gridElements = document.getElementsByClassName('grid-element');
    var blockage = [];
    for (var i = 0; i < gridElements.length; i++) {
        if (gridElements[i].classList.contains('blockage')) {
            blockage.push(i);
        }
    }

    reloadGrid();

    //for every location in blockage, add blockage back to the grid
    for (var i = 0; i < blockage.length; i++) {
        gridElements[blockage[i]].classList.add('blockage');
        gridElements[blockage[i]].style.backgroundColor = currentColor;
    }


    //place start and end node back into grid
    var gridElements = document.getElementsByClassName('grid-element');
    gridElements[startNode.loc].classList.add('start');
    gridElements[startNode.loc].style.backgroundColor = '#00ff00';
    gridElements[endNode.loc].classList.add('end');
    gridElements[endNode.loc].style.backgroundColor = '#FF0000';




    convertGridToNodes();
    var startLoc = visited[0][0].loc;

    let x = Math.floor(startLoc / Math.sqrt(document.getElementsByClassName('grid-element').length));
    let y = startLoc % Math.sqrt(document.getElementsByClassName('grid-element').length);

    // Array to hold all Promises
    const promises = [];


    for (var i = 0; i < visited[0].length; i++) {
        let x2 = Math.floor(visited[0][i].loc / Math.sqrt(document.getElementsByClassName('grid-element').length));
        let y2 = visited[0][i].loc % Math.sqrt(document.getElementsByClassName('grid-element').length);
        let distance = Math.sqrt((x2 - x) ** 2 + (y2 - y) ** 2);

        // Wrap setTimeout into a Promise object
        const promise = new Promise((resolve) => {
            setTimeout(function (i) {
                var color = Math.floor(255 / distance);
                document.getElementById(visited[0][i].loc).style.backgroundColor = "rgb(0,0," + color + ")";
                resolve();
            }, 10 * i, i);
        });

        promises.push(promise);
    }

    // Wait for all Promises to resolve before executing the next code block
    Promise.all(promises).then(() => {
        var path = [];
        var curr = visited[0][visited[0].length - 1];


        while (curr.parent != null) {
            path.push(curr);
            curr = curr.parent;

        }

        path.push(visited[0][0]);
        path.reverse();
        //remove first element from path, and remove but store end path
        var endPath = path.pop();
        path.shift();


        //for each element in path color it in a gradient from light green to dark green on a delay
        for (var i = 0; i < path.length; i++) {
            // Wrap setTimeout into a Promise object
            const promise = new Promise((resolve) => {
                setTimeout(function (i) {
                    document.getElementById(path[i].loc).style.backgroundColor = "green";
                    resolve();
                }, 100 * i, i);
            });
            promises.push(promise);
        }

        document.getElementById(endPath.loc).style.backgroundColor = "red";
        // Wait for all Promises to resolve before executing the next code block
        Promise.all(promises).then(() => {
            console.log("All done!");
        });
    });
    algoRan = true;
}

function colorShortestPathGradient2(visited) {
    if (!startBlockExist() || !endBlockExist()) {
        return;
    }
    //store the start and end node
    var startNode = visited[0][0];
    var endNode = visited[0][visited[0].length - 1];

    var gridElements = document.getElementsByClassName('grid-element');
    var blockage = [];
    for (var i = 0; i < gridElements.length; i++) {
        if (gridElements[i].classList.contains('blockage')) {
            blockage.push(i);
        }
    }

    reloadGrid();

    //for every location in blockage, add blockage back to the grid
    for (var i = 0; i < blockage.length; i++) {
        gridElements[blockage[i]].classList.add('blockage');
        gridElements[blockage[i]].style.backgroundColor = currentColor;
    }


    //place start and end node back into grid
    var gridElements = document.getElementsByClassName('grid-element');
    gridElements[startNode.loc].classList.add('start');
    gridElements[startNode.loc].style.backgroundColor = '#00ff00';
    gridElements[endNode.loc].classList.add('end');
    gridElements[endNode.loc].style.backgroundColor = '#FF0000';




    convertGridToNodes();
    var startLoc = visited[0][0].loc;

    let x = Math.floor(startLoc / Math.sqrt(document.getElementsByClassName('grid-element').length));
    let y = startLoc % Math.sqrt(document.getElementsByClassName('grid-element').length);

    // Array to hold all Promises
    const promises = [];

    //remove end block from visited 
    visited[0].pop();


    for (var i = 0; i < visited[0].length; i++) {
        const promise = new Promise((resolve) => {
            setTimeout(function (i) {
                var color = Math.floor(255 / i);
                document.getElementById(visited[0][i].loc).style.backgroundColor = "rgb(0,0," + color + ")";
                resolve();
            }, 10 * i, i);
        });

        promises.push(promise);
    }
    //iterate though the visited array again and this time color it in a gradient from light yellow to dark yellow on a delay based on its index in visited
    Promise.all(promises).then(() => {
        let tempLen = visited[0].length;
        for (var i = 0; i < visited[0].length; i++) {
            // Wrap setTimeout into a Promise object
            const promise = new Promise((resolve) => {
                
                setTimeout(function (i) {
                    var color = Math.floor(255 / (i/tempLen));
                    document.getElementById(visited[0][i].loc).style.backgroundColor = "rgb(0," + color + ",0)";
                    resolve();
                }, 10 * i, i);
            });
            promises.push(promise);
        }
    });

    algoRan = true;
}

function colorShortestPathGradientBFS(visited) {
    if (!startBlockExist() || !endBlockExist()) {
        return;
    }
    //store the start and end node
    var startNode = visited[0][0];
    var endNode = visited[0][visited[0].length - 1];

    var gridElements = document.getElementsByClassName('grid-element');
    var blockage = [];
    for (var i = 0; i<gridElements.length; i++){
        if(gridElements[i].classList.contains('blockage')){
            blockage.push(i);
        }
    }
    
    reloadGrid();

    //for every location in blockage, add blockage back to the grid
    for(var i = 0; i < blockage.length; i++){
        gridElements[blockage[i]].classList.add('blockage');
        gridElements[blockage[i]].style.backgroundColor = currentColor;
    }
    

    //place start and end node back into grid
    var gridElements = document.getElementsByClassName('grid-element');
    gridElements[startNode.loc].classList.add('start');
    gridElements[startNode.loc].style.backgroundColor = '#00ff00';
    gridElements[endNode.loc].classList.add('end');
    gridElements[endNode.loc].style.backgroundColor = '#FF0000';




    convertGridToNodes();
    var startLoc = visited[0][0].loc;

    let x = Math.floor(startLoc / Math.sqrt(document.getElementsByClassName('grid-element').length));
    let y = startLoc % Math.sqrt(document.getElementsByClassName('grid-element').length);

    // Array to hold all Promises
    const promises = [];


    for (var i = 0; i < visited[0].length; i++) {
        let x2 = Math.floor(visited[0][i].loc / Math.sqrt(document.getElementsByClassName('grid-element').length));
        let y2 = visited[0][i].loc % Math.sqrt(document.getElementsByClassName('grid-element').length);
        let distance = Math.sqrt((x2 - x) ** 2 + (y2 - y) ** 2);

        // Wrap setTimeout into a Promise object
        const promise = new Promise((resolve) => {
            setTimeout(function (i) {
                var color = Math.floor(255 / distance);
                document.getElementById(visited[0][i].loc).style.backgroundColor = "rgb(0,0," + color + ")";
                resolve();
            }, 10 * i, i);
        });

        promises.push(promise);
    }

    // Wait for all Promises to resolve before executing the next code block
    Promise.all(promises).then(() => {
        for (var i = 0; i < visited[0].length; i++) {
            let x2 = Math.floor(visited[0][i].loc / Math.sqrt(document.getElementsByClassName('grid-element').length));
            let y2 = visited[0][i].loc % Math.sqrt(document.getElementsByClassName('grid-element').length);
            let distance = Math.sqrt((x2 - x) ** 2 + (y2 - y) ** 2);
    
            // Wrap setTimeout into a Promise object
            const promise = new Promise((resolve) => {
                setTimeout(function (i) {
                    var color = Math.floor(255 / distance);
                    document.getElementById(visited[0][i].loc).style.backgroundColor = "rgb(0,"+color + ",0)";
                    resolve();
                }, 10 * i, i);
            });
    
            promises.push(promise);
        }
    
        Promise.all(promises).then(() => {
            console.log("All done!");
        });
    });
    algoRan = true;
}


function findShortPathV2() {
    let x = convertGridToNodes();
    var startNode = x[0]
    var endNode = x[1];
    var visited = [];
    var pq = [];
    startNode.distance = 0;
    pq.push(startNode);


    while (pq.length > 0) {
        pq.sort((a, b) => a.distance - b.distance);
        let curr = pq.shift();

        if (visited.includes(curr)) continue;

        visited.push(curr);

        if (curr.isEnd == true) {
            break;
        }

        if (curr.top != null && !curr.top.blockage) {
            let alt = curr.distance + 1;
            if (alt < curr.top.distance) {
                curr.top.distance = alt;
                curr.top.parent = curr;
                pq.push(curr.top);
            }
        }

        if (curr.left != null && !curr.left.blockage) {
            let alt = curr.distance + 1;
            if (alt < curr.left.distance) {
                curr.left.distance = alt;
                curr.left.parent = curr;
                pq.push(curr.left);
            }
        }

        if (curr.right != null && !curr.right.blockage) {
            let alt = curr.distance + 1;
            if (alt < curr.right.distance) {
                curr.right.distance = alt;
                curr.right.parent = curr;
                pq.push(curr.right);
            }
        }
        if (curr.bottom != null && !curr.bottom.blockage) {

            let alt = curr.distance + 1;
            if (alt < curr.bottom.distance) {
                curr.bottom.distance = alt;
                curr.bottom.parent = curr;

                pq.push(curr.bottom);
            }
        }
    }
    return [visited, []];
}

function findShortPathDFS() {
    let x = convertGridToNodes();
    var startNode = x[0]
    var endNode = x[1];
    let stack = [];
    let visited = [];
    stack.push(startNode);
    while (stack.length > 0) {
        let temp = stack.pop();
        visited.push(temp);
        if (temp.isEnd == true) {
            break;
        }
        if (temp.top != null && !visited.includes(temp.top) && temp.top.blockage == false) {
            stack.push(temp.top);
        }
        if (temp.right != null && !visited.includes(temp.right) && temp.right.blockage == false) {
            stack.push(temp.right);
        }
        if (temp.bottom != null && !visited.includes(temp.bottom) && temp.bottom.blockage == false) {
            stack.push(temp.bottom);
        }
        if (temp.left != null && !visited.includes(temp.left) && temp.left.blockage == false) {
            stack.push(temp.left);
        }
    }
    return [visited, []];
}

window.onload = () => {
    setupGrid(DEFAULT_SIZE)
    activateButton(DEFAULT_MODE)
}