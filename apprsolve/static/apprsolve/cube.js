// cube movements implemented here
var movements = ['L', 'M', 'R', 'U', 'E', 'D', 'F', 'S', 'B']

// arrays of slices of the cube
// each array needs to be in order of clockwise movement
var slice = {};
slice['L'] = [ "FLU", "FL", "FLD", "LD", "BLD", "BL", "BLU", "LU", "L" ],
slice['M'] = [ "FU", "F", "FD", "D", "BD", "B", "BU", "U" ],
slice['R'] = [ "FRD", "FR", "FRU", "RU", "BRU", "BR", "BRD", "RD", "R" ],
slice['U'] = [ "FLU", "LU", "BLU", "BU", "BRU", "RU", "FRU", "FU", "U" ],
slice['E'] = [ "FL", "L", "BL", "B", "BR", "R", "FR", "F" ],
slice['D'] = [ "FLD", "FD", "FRD", "RD", "BRD", "BD", "BLD", "LD", "D" ],
slice['F'] = [ "FLU", "FU", "FRU", "FR", "FRD", "FD", "FLD", "FL", "F" ],
slice['S'] = [ "LU", "U", "RU", "R", "RD", "D", "LD", "L" ],
slice['B'] = [ "BLD", "BD", "BRD", "BR", "BRU", "BU", "BLU", "BL", "B" ];

// dictionary of quarter-turn clockwise transitions
var transition = {};
transition['L'] = {'L': 'L', 'F': 'D', 'D': 'B', 'B': 'U', 'U': 'F'};
transition['M'] = {'F': 'D', 'D': 'B', 'B': 'U', 'U': 'F'};
transition['R'] = {'R': 'R', 'F': 'U', 'U': 'B', 'B': 'D', 'D': 'F'};
transition['U'] = {'U': 'U', 'F': 'L', 'L': 'B', 'B': 'R', 'R': 'F'};
transition['E'] = {'F': 'L', 'L': 'B', 'B': 'R', 'R': 'F'};
transition['D'] = {'D': 'D', 'F': 'R', 'R': 'B', 'B': 'L', 'L': 'F'};
transition['F'] = {'F': 'F', 'L': 'U', 'U': 'R', 'R': 'D', 'D': 'L'};
transition['S'] = {'L': 'U', 'U': 'R', 'R': 'D', 'D': 'L'};
transition['B'] = {'B': 'B', 'R': 'U', 'U': 'L', 'L': 'D', 'D': 'R'};

// initial colors of cube by face
var initialColors = {'F': 'orange', 'B': 'red', 'L': 'blue', 'R': 'green', 
    'U': 'white', 'D': 'yellow'};

// rotation axes by face of cube (+ means clockwise, minus countercw)
var rotAxis = {'F': 'Z+', 'B': 'Z-', 'L': 'X-', 'R': 'X+', 'U': 'Y-', 'D': 'Y+',
    'M': 'X-', 'E': 'Y-', 'S': 'Z+'};

// allCubies is an array of the names of all 26 cubies
// pieces is an array pointing to DOM objects for each cubie
// scene points to html id scene
// pivot points to html id pivot
var allCubies, pieces, scene, pivot;

var reverseCube = {"FLU": ['red', 'green', 'yellow'], "FU": ['red', 'yellow'], "FRU": ['red', 'white', 'yellow'],
                   "FR": ['red', 'white'], "FRD": ['red', 'white', 'orange'], "FD": ['red', 'orange'],
                   "FLD": ['red', 'green', 'orange'], "FL": ['red', 'green'], "F": ['red'],
                   "LU": ['green', 'yellow'], "U": ['yellow'], "RU": ['white', 'yellow'], "R": ['white'],
                   "RD": ['white', 'orange'], "D": ['orange'], "LD": ['green', 'orange'], "L": ['green'],
                   "BLD": ['blue', 'green', 'orange'], "BD": ['blue', 'orange'], "BRD": ['blue', 'white', 'orange'],
                   "BR": ['blue', 'white'], "BRU": ['blue', 'white', 'yellow'], "BU": ['blue', 'yellow'], 
                   "BLU": ['blue', 'green', 'yellow'], "BL": ['blue', 'green'], "B": ['blue'] };

function assembleCube() 
{
    for (let cubieIndex = 0; cubieIndex < 26; cubieIndex++)
    {
        // set id of piece to be facename (eg 'FRU')
        pieces[cubieIndex].setAttribute('id', allCubies[cubieIndex]);
        // initialize translation phrase to add to cubie style
        let translate = '';
        // cycle through each letter of facename
        for (let face = 0; face < allCubies[cubieIndex].length; face++)
        {
            // set color of face
            pieces[cubieIndex].querySelector('.element.' + allCubies[cubieIndex][face])
                .appendChild(document.createElement('div'))
                .setAttribute('class', 'sticker ' + initialColors[allCubies[cubieIndex][face]]);
            // set proper xyz translation for cubie based on faces
            translate = translate + 'translate' + rotAxis[allCubies[cubieIndex][face]][0] + 
                '(' + rotAxis[allCubies[cubieIndex][face]][1] + '2em) ';
        }
        // form translation move - rotate 0 is in there for
        // replacement in move function
        pieces[cubieIndex].style.transform = 'rotateX(0deg) ' + translate;
    }
    // place logo
    let logoSticker = document.querySelector('#U>.element.U').firstChild;
    logoSticker.className += ' logo';
}

// imports a description of a complete cube in this form:
// { 'FLU': ['red', 'white', 'blue'], ... }
function importCube(newCube)
{
    for (let cubieIndex = 0; cubieIndex < 26; cubieIndex++)
    {
        let cubeName = allCubies[cubieIndex];
        let cubeColorList = newCube[cubeName];
        for (let face = 0; face < cubeName.length; face++)
        {
            pieces[cubieIndex].querySelector('.element.' + cubeName[face]).firstChild.className = 
                'sticker ' + cubeColorList[face];
        }
    }
}

// exports a description of a complete cube in this form:
// { 'FLU': ['red', 'white', 'blue'], ... }
function exportCube()
{
    var returnVal = {}
    for (let cubieIndex = 0; cubieIndex < 26; cubieIndex++)
    {
        let cubeName = allCubies[cubieIndex];
        let cubeColorList = [];
        for (let face = 0; face < cubeName.length; face++)
        {
            let color = pieces[cubieIndex].querySelector('.element.' + 
                cubeName[face]).firstChild.className.split(' ')[1];
            cubeColorList.push(color);
        }
        returnVal[cubeName] = cubeColorList;
    }
    return returnVal;
}

// Swaps stickers of the face by direction, performed after animation 
// to rotate the face (direction 1 cw, -1 ccw)
function swapStickers(face, direction) 
{
    // number of cubies we're shifting 
    numCubies = slice[face].length;
    // end slices have a middle cube we don't swap
    if (!(face == 'M' || face == 'E' || face == 'S'))
    {
        numCubies -= 1;
    }
    // if clockwise, perform three times
    count = 3;
    // if counterclockwise, perform once
    if (direction == -1) 
    {
        count = 1;
    }
    for (let counter = 0; counter < count; counter++)
    {
        // by swapping every second color, we rotate face by two cubes
        for (cubeIndex = 0; cubeIndex < numCubies - 2; cubeIndex++)
        {
            // identify the cubies to swap on this iteration
            // first one is index
            cubie1Name = slice[face][cubeIndex];
            cubie1 = document.querySelector('#' + cubie1Name);
            // second one is two ahead
            cubie2Name = slice[face][cubeIndex + 2];
            cubie2 = document.querySelector('#' + cubie2Name);
            // now swap stickers using transition guide dict
            for (faceIndex = 0; faceIndex < cubie1Name.length; faceIndex++)
            {
                let sticker1 = cubie1.querySelector('.element.' + cubie1Name[faceIndex]).firstChild;
                let sticker2 = cubie2.querySelector('.element.' + transition[face][cubie1Name[faceIndex]]).firstChild;
                let cn = sticker1.className;
                sticker1.className = sticker2.className;
                sticker2.className = cn;
            }
        }
    }
}

// Animates rotation of the face - clockwise if direction is 1
// and counterclockwise if direction is -1
function quarterMove(face, direction)
 {
    // rotAxis[face][1] is a plus or minus - reverse direction to account for that
    var dir = direction;
    if (rotAxis[face][1] == '-')
    {
        dir = -dir;
    }
    // create list of DOM elements in this slice
    var toMoveList = slice[face].map(cubie => document.querySelector('#' + cubie));
    // timing variable
    var timeCalled = Date.now();
    
    // recursively called function to rotate cubies slowly 
    function rotateCubies() {
        var elapsedTime = (Date.now() - timeCalled) / 4;
        var newStyle = 'rotate' + rotAxis[face][0] + '(' + dir * elapsedTime + 'deg)';
        toMoveList.forEach(cubie => cubie.style.transform = cubie.style.transform.
            replace(/rotate.\(\S+\)/, newStyle));
        if (elapsedTime <= 90)
        {
            requestAnimationFrame(rotateCubies);
        }
        else
        {
            toMoveList.forEach(cubie => cubie.style.transform = cubie.style.transform.
                replace(/rotate.\(\S+\)/, 'rotateX(0deg)'));
            swapStickers(face, direction);    
            return;
        }
    };

    requestAnimationFrame(rotateCubies);
}

function checkKeys(event)
{
    if (movements.includes(event.key))
    {
        quarterMove(event.key, -1);
    }
    else if (movements.map(c => c.toLowerCase()).includes(event.key))
    {
        quarterMove(event.key.toUpperCase(), 1);
    }
    else
    {
        let mark = false, x = 0, y = 0;
        switch (event.key)
        {
            case 'ArrowUp':
                x++;
                mark = true;
            case 'ArrowDown':
                if (!mark)
                {
                    x--;
                    mark = true;
                }
            case 'ArrowLeft':
                if (!mark)
                {
                    y--;
                    mark = true;
                }
            case 'ArrowRight':
                if (!mark)
                {
                    y++;
                }
                let startXY = pivot.style.transform.match(/-?\d+\.?\d*/g).map(Number);
                pivot.style.transform = 
                    'rotateX(' + (startXY[0] + x * 2) + 'deg) ' + 
                    'rotateY(' + (startXY[1] + y * 2) + 'deg)';
            default:
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    pieces = document.querySelectorAll('.piece');
    scene = document.getElementById('scene');
    pivot = document.getElementById('pivot');
    // assemble allCubies list from slices - 3 slices are sufficient
    // for whole cube
    allCubies = [].concat(slice['F']).concat(slice['S']).concat(slice['B']);
    assembleCube();
    window.addEventListener('keydown', checkKeys);
});