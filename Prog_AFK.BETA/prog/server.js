var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static("."));
app.get('/', function (req, res) {
    res.redirect('index.html');
});
// PORT 3000
server.listen(3000);
let fs = require('fs')

weath = "winter"
var Grass = require("./modules/Grass.js");
var GrassEater = require("./modules/GrassEater.js");
var Maniac = require("./modules/Maniac.js");
var CoronaVirus = require("./modules/CoronaVirus.js");
var Predator = require("./modules/Predator.js");
let random = require('./modules/random');


grassArr = [];
grassEaterArr = [];
matrix = [];
ManiacArr = [];
CoronaVirusArr = [];
PredatorArr = [];

function matrixGenerator2(matrixSize, grass, grassEater, grassEaterEater, waterArr, fireArr) {
    for (let i = 0; i < matrixSize; i++) {
        matrix[i] = [];
        for (let o = 0; o < matrixSize; o++) {
            matrix[i][o] = 0;
        }
    }
    for (let i = 0; i < grass; i++) {
        let customX = Math.floor(random(matrixSize)); // 0-9
        let customY = Math.floor(random(matrixSize)); // 4
        matrix[customY][customX] = 1;
    }
    for (let i = 0; i < grassEater; i++) {
        let customX = Math.floor(random(matrixSize));
        let customY = Math.floor(random(matrixSize));
        matrix[customY][customX] = 2;
    }
    for (let i = 0; i < grassEaterEater; i++) {
        let customX = Math.floor(random(matrixSize));
        let customY = Math.floor(random(matrixSize));
        matrix[customY][customX] = 3;
    }
    for (let i = 0; i < waterArr; i++) {
        let customX = Math.floor(random(matrixSize));
        let customY = Math.floor(random(matrixSize));
        matrix[customY][customX] = 4;
    }
    for (let i = 0; i < fireArr; i++) {
        let customX = Math.floor(random(matrixSize));
        let customY = Math.floor(random(matrixSize));
        matrix[customY][customX] = 5;
    }
}


// Stexcum enq matrix 

matrixGenerator2(30, 10, 10,2,12,3);
function weather() {
    if (weath == "winter") {
        weath = "spring"
    }
    else if (weath == "spring") {
        weath = "summer"
    }
    else if (weath == "summer") {
        weath = "autumn"
    }
    else if (weath == "autumn") {
        weath = "winter"
    }
    io.sockets.emit('weather', weath)
}
// Serveri Masy --USHADIR NAYEL

setInterval(weather, 4000);

function creatingObjects() {
    for (var y = 0; y < matrix.length; y++) {
        for (var x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] == 5) {
                var grassEaterEx = new GrassEater(x, y, 5);
                grassEaterArr.push(grassEaterEx);
            } else if (matrix[y][x] == 1) {
                var grass = new Grass(x, y, 1);
                grassArr.push(grass);
            } else if (matrix[y][x] == 2) {
                var CoronaVirusEx = new CoronaVirus(x, y, 2);
                CoronaVirusArr.push(CoronaVirusEx);
            } else if (matrix[y][x] = 4) {
                var ManiacEx = new Maniac(x, y, 4);
                ManiacArr.push(ManiacEx);
            } else if (matrix[y][x] = 3) {
                var PredatorEx = new Predator(x, y, 3);
                PredatorArr.push(PredatorEx);
            }
        }
    }
}

function play() {
    if (grassArr[0] !== undefined) {
        if(weath != 'autumn') {
            for (var i in grassArr) {
                grassArr[i].mul();
            }
        }

    }
    if (grassEaterArr[0] !== undefined) {
        for (var i in grassEaterArr) {
            grassEaterArr[i].eat();
            grassEaterArr[i].move();
        }
    }
    if(PredatorArr[0] !== undefined){
        for(var i in PredatorArr){
            PredatorArr[i].eat();
        }
    }
    if(ManiacArr[0] !== undefined){
        for(var i in ManiacArr){
            ManiacArr[i].eat();
            ManiacArr[i].move();
        }
    }
    if(CoronaVirusArr[0] !== undefined){
        for(var i in CoronaVirusArr){
            CoronaVirusArr[i].eat();
            CoronaVirusArr[i].move();
        }
    }


    let sendData = {
        matrix: matrix,
        grassCounter: grassArr.length
    }
    
    io.sockets.emit("data", sendData);
}


// Statistica enq sarqum 

setInterval(play, 1000)


function kill() {
    grassArr = [];
    grassEaterArr = []
    predatorArr = [];
    CoronaVirusArr = [];
    ManiacArr = [];
    meatEaterArr = []
    allEaterArr = []
    hunterArr = []
    console.log("kill")
    console.log("grassArr")
    for (var y = 0; y < matrix.length; y++) {
        for (var x = 0; x < matrix[y].length; x++) {
            matrix[y][x] = 0;
        }
    }
}
io.on('connection', function (socket) {
    creatingObjects();
    socket.on("kill", kill);
    console.log("socket.on");
});

var statistics = {};

setInterval(function () {
    statistics.grass = grassArr.length;
    statistics.grassEater = grassEaterArr.length;
    fs.writeFile("statistics.json", JSON.stringify(statistics), function () {
    })
}, 1000)
