process.argv.length < 3 && console.log('Usage: node app.js <input_file>') && process.exit();

var fs = require('fs')
,   floWar = function(adjMatrix, placeCount) {
        var value;
        for (var k = 0; k < placeCount; k++) {
            for (var i = 0; i < placeCount; i++) {
                for (var j = 0; j < i; j++) {
                    value = adjMatrix[i][k] + adjMatrix[k][j];
                    if (value < adjMatrix[i][j]) adjMatrix[i][j] = adjMatrix[j][i] = value;
                }
            }
        }
    }
,   canFindSophie = function(probs, adjMatrix, placeCount) {
        for (var i = 0; i < placeCount; i++) {
            for (var j = 0; j < i; j++) {
                if (adjMatrix[i][j] === 9999) {
                    if (!probs[i] && probs[i] !== 1 && !probs[j] && probs[j] !== 1) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
        

(function (filename) {
    var placeCount, adjMatrix, probs, visited, minExpTime, path;
    
    fs.readFile(filename, function (err, data) {
        if (err) throw err;
        var i = 0, places = {}, routeCount = 0;
        data.toString().split('\n').forEach(function (line) {
            if (!i) {
                placeCount = parseInt(line, 10);
                !placeCount && console.log('-1.00') && process.exit();
                adjMatrix = [];
                probs = [];
                visited = [];
                minExpTime = 9999;
                path = [];
                
                for (var j = 0; j < placeCount; j++) {
                    adjMatrix.push([]);
                    for (var k = 0; k < placeCount; k++) 
					    adjMatrix[j].push(9999);
                }
            } else if (i <= placeCount) {
                var lineArray = line.split(/[ \t]+/);
                places[lineArray[0]] = i - 1;
                probs.push(parseFloat(lineArray[1]));
                visited.push(false);
            } else if (i == placeCount + 1) {
                routeCount = parseInt(line, 10);
            } else {
                var routeArray = line.split(/[ \t]+/)
                ,   src = places[routeArray[0]]
                ,   dest = places[routeArray[1]];
                adjMatrix[src][dest] = adjMatrix[dest][src] = parseFloat(routeArray[2]);
            }
            
            i++;
        });
        floWar(adjMatrix, placeCount);
        !canFindSophie(probs, adjMatrix, placeCount) && console.log('-1.00') && process.exit();
    });
    
})(process.argv[2]);
