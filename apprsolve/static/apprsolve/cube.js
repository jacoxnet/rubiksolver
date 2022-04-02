// cube movements defined here
var movements = ['L', 'M', 'R', 'U', 'E', 'D', 'F', 'S', 'B'];
var ccmovements = ['l', 'm', 'r', 'u', 'e', 'd', 'f', 's', 'b'];
var rotations = ['X', 'Y', 'Z', 'x', 'y', 'z'];
var rotation_equiv = {'x': 'rLM', 'X': 'Rlm', 'y': 'uED', 'Y': 'Ued',
                      'z': 'fsB', 'Z':'FSb'};

// arrays of slices of the cube
// each array needs to be in order of clockwise movement
var slice = {};
slice['L'] = [ "FLU", "FL", "FLD", "LD", "BLD", "BL", "BLU", "LU", "L" ],
slice['M'] = [ "FU", "F", "FD", "D", "BD", "B", "BU", "U" ],
slice['R'] = [ "FRD", "FR", "FRU", "RU", "BRU", "BR", "BRD", "RD", "R" ],
slice['U'] = [ "FLU", "LU", "BLU", "BU", "BRU", "RU", "FRU", "FU", "U" ],
slice['E'] = [ "FL", "F", "FR", "R", "BR", "B", "BL", "L" ],
slice['D'] = [ "FLD", "FD", "FRD", "RD", "BRD", "BD", "BLD", "LD", "D" ],
slice['F'] = [ "FLU", "FU", "FRU", "FR", "FRD", "FD", "FLD", "FL", "F" ],
slice['S'] = [ "LU", "U", "RU", "R", "RD", "D", "LD", "L" ],
slice['B'] = [ "BLD", "BD", "BRD", "BR", "BRU", "BU", "BLU", "BL", "B" ];

// Visible faces
const visFaces = ['F', 'B', 'L', 'R', 'U', 'D'];

// Cabezas numbering system
cabList = {'FLU': [18, 11, 6],
          'FU':  [19, 7],
          'FRU': [20, 27, 8],
          'FL':  [21, 14],
          'F':   [22],
          'FR':  [23, 30],
          'FLD': [24, 17, 45],
          'FD':  [25, 46],
          'FRD': [26, 33, 47],      
          'L':   [13],
          'BL':  [41, 12],
          'BLD': [44, 15, 51],
          'LU': [10, 3],
          'LD': [16, 48],
          'BLU': [38, 9, 0],
          'U':  [4],
          'BU': [37, 1],
          'RU': [28, 5],
          'BRU': [36, 29, 2],
          'B':  [40],
          'BR': [39, 32],
          'BD': [43, 52],
          'BRD': [42, 35, 53],
          'R':  [31],
          'RD': [34, 50],
          'D':  [49]
}


// dictionary of quarter-turn clockwise transitions
var transition = {};
transition['L'] = {'L': 'L', 'F': 'D', 'D': 'B', 'B': 'U', 'U': 'F'};
transition['M'] = {'F': 'D', 'D': 'B', 'B': 'U', 'U': 'F'};
transition['R'] = {'R': 'R', 'F': 'U', 'U': 'B', 'B': 'D', 'D': 'F'};
transition['U'] = {'U': 'U', 'F': 'L', 'L': 'B', 'B': 'R', 'R': 'F'};
transition['E'] = {'F': 'R', 'R': 'B', 'B': 'L', 'L': 'F'};
transition['D'] = {'D': 'D', 'F': 'R', 'R': 'B', 'B': 'L', 'L': 'F'};
transition['F'] = {'F': 'F', 'L': 'U', 'U': 'R', 'R': 'D', 'D': 'L'};
transition['S'] = {'L': 'U', 'U': 'R', 'R': 'D', 'D': 'L'};
transition['B'] = {'B': 'B', 'R': 'U', 'U': 'L', 'L': 'D', 'D': 'R'};

// initial colors of cube by face
var initialColors = {'F': 'red', 'B': 'orange', 'L': 'blue', 'R': 'green', 
    'U': 'yellow', 'D': 'white'};

// rotation axes by face of cube (+ means clockwise, minus countercw)
var rotAxis = {'F': 'Z+', 'B': 'Z-', 'L': 'X-', 'R': 'X+', 'U': 'Y-', 'D': 'Y+',
    'M': 'X-', 'E': 'Y+', 'S': 'Z+'};

// allCubies is an array of the names of all 26 cubies
// pieces is an array pointing to DOM objects for each cubie
// scene points to html id scene
// pivot points to html id pivot
var wholeCube, allCubies, pieces, scene, pivot;

function assembleCube() 
{
    wholeCube = document.getElementById('cube');
    // These three slices are sufficient for entire cube of 26 cubies
    allCubies = [].concat(slice['F']).concat(slice['S']).concat(slice['B']);
    // create DOM framework for all pieces children to cube
    for (let cubieIndex = 0; cubieIndex < allCubies.length; cubieIndex++) {
        const newpiece = document.createElement('div');
        newpiece.setAttribute('class', 'piece');
        // set id of piece to be cubiename (eg 'FRU')
        cubieName = allCubies[cubieIndex];
        newpiece.setAttribute('id', cubieName);
        // initialize translation phrase to add to cubie style
        let translate = '';
        // create DOM nodes for individual visible faces of a cube
        for (let facename of cubieName) {
            const newface = document.createElement('div');
            newface.setAttribute('class', 'element ' + facename);
            // initially color is undefined
            const newcolor = document.createElement('div');
            newcolor.setAttribute('class', 'sticker ' + initialColors[facename]);
            newface.appendChild(newcolor);
            newpiece.appendChild(newface);
            // set proper xyz translation for cubie based on faces
            translate = translate + 'translate' + rotAxis[facename][0] + 
                '(' + rotAxis[facename][1] + '2em) ';
    
        };
        // form translation move - rotate 0 is in there for
        // replacement in move function
        newpiece.style.transform = 'rotateX(0deg) ' + translate;
        // append to cube
        wholeCube.appendChild(newpiece);
    }
    // set some useful globals 
    pieces = document.querySelectorAll('.piece');        
    scene = document.getElementById('scene');
    pivot = document.getElementById('pivot');
}

function isNormalized() {
    var ycubie, rcubie;
    // find positions of yellow and red middle pieces
    for (let cubieIndex = 0; cubieIndex < 26; cubieIndex++) {  
        let cubieName = allCubies[cubieIndex];
        if ((cubieName.length == 1) && (pieces[cubieIndex].querySelector('.sticker').getAttribute('class') == 'sticker yellow')) {
            ycubie = cubieName;
        }
        else if ((cubieName.length == 1) && (pieces[cubieIndex].querySelector('.sticker').getAttribute('class') == 'sticker red')) {
            rcubie = cubieName;
        }
    }
    if (ycubie == 'U' && rcubie == 'F')
        return true;
    else
        return false;
}

function normalizeCube() {
    console.log('normalizing');
    var ycubie, rcubie;
    const ndict = {"UR": "y", "UL": "Y", "UF": "" , "UB": "yy", 
                   "DR": "YXX", "DL": "zXz", "DF": "ZZ", "DB": "XX", 
                   "LU": "yX", "LD": "xY", "LF": "z", "LB": "xxz",
                   "RU": "ZY", "RD": "Zy", "RF": "Z", "RB": "XYX",
                   "FU": "YYX", "FD": "x", "FL": "xY", "FR": "xy", 
                   "BU": "X", "BD": "zzX", "BL": "Yz", "BR": "yZ"}
    // find positions of yellow and red middle pieces
    // dict tell us how to rotate to normalize U=red and F=yelllow
    for (let cubieIndex = 0; cubieIndex < 26; cubieIndex++) {  
        let cubieName = allCubies[cubieIndex];
        if ((cubieName.length == 1) && (pieces[cubieIndex].querySelector('.sticker').getAttribute('class') == 'sticker yellow')) {
            ycubie = cubieName;
        }
        else if ((cubieName.length == 1) && (pieces[cubieIndex].querySelector('.sticker').getAttribute('class') == 'sticker red')) {
            rcubie = cubieName;
        }
    }
    console.log('y is at ', ycubie);
    console.log('r is at ', rcubie);
    console.log('moving ', ndict[ycubie + rcubie]);
    let m = [...ndict[ycubie + rcubie]];
    multiMove(m);
}


// assign Cabezas numbers and place on stickers
function assignCabezas() {
    for (let cubieIndex = 0; cubieIndex < 26; cubieIndex++)
    {
        let cubieName = allCubies[cubieIndex];
        // sets cabcube to the list of cabezas face numbers for that cubie
        cabcube = cabList[cubieName];
        // cycle through each letter of facename
        for (let face = 0; face < cubieName.length; face++)
        {
            let n = pieces[cubieIndex].querySelector('.element.' + allCubies[cubieIndex][face] + '>div');
            // put cabezas number on face of sticker
            n.innerHTML = cabList[cubieName][face];
        }
    }
}

// Swaps stickers of the face by direction, performed after animation 
// to rotate the face (direction 1 cw, -1 ccw)
function swapStickers(face, direction) {
    // number of cubies we're shifting 
    numCubies = slice[face].length;
    // end slices have a middle cube we don't swap
    if (!(face == 'M' || face == 'E' || face == 'S')) {
        numCubies -= 1;
    }
    // if clockwise, perform three times; cc once
    count = (direction == 1)? 3 : 1;
    for (let counter = 0; counter < count; counter++) {
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
function quarterMove(face, direction) {
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

// perform a single quarter-turn move of cube
// if the move is a rotation, perform all equivalent moves
// returns promise for async operation
function singleMove(move) {
    if (movements.includes(move)) {
        quarterMove(move, -1);
    }
    else if (ccmovements.includes(move)) {
        quarterMove(move.toUpperCase(), 1);
    }
    else if (rotations.includes(move)) {
        // console.log('rotation active');
        // console.log('move is', move);
        // console.log('equiv is ', rotation_equiv[move]);
        for (let i = 0; i < rotation_equiv[move].length; i++) {
            singleMove(rotation_equiv[move][i]);
        }
    }
    describeCube();
}

// perform a series of moves in order with delay
// input is a list of chars not a string
// also fills in #mymoves box with translated move list
function multiMove(moves) {
    if (moves) {
        document.querySelector('#mymoves').setAttribute('value', moves.join(''));
        for (let i = 0; i < moves.length; i++) {
            setTimeout((m) => singleMove(m), 500 * i, moves[i])
        }
        setTimeout(() => describeCube(), 500 * moves.length);
    }
}

// randomize the cube by shuffling moves
function randomizeCube() {
    var moves = []
    movements.forEach((x) => {
            moves.push(x.toLowerCase());
    });
    var rmoves = [];
    // create list of 3 copies of all movements
    for (let i = 0; i < 3; i++) {
        moves.forEach((x) =>  rmoves.push(x));
    }
    //shuffle
    for (let i = rmoves.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rmoves[i], rmoves[j]] = [rmoves[j], rmoves[i]];
    }
    console.log(rmoves);
    multiMove(rmoves); 
}

function buttMove(button) {
    multiMove([button]);
}

function checkKeys(event)
{
    if (movements.includes(event.key) || ccmovements.includes(event.key) || rotations.includes(event.key)) {
        multiMove([event.key]);
    }
    else {
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

   // reads the current cube spec and translates to Cabezas notation
   function getCabezas() {
        cubeSpec = getCubeSpec();
        // allocate space for returned value 
        returnVal = new Array(54).fill(' ');
        // cycle through all cubies
        for (let cubieIndex = 0; cubieIndex < 26; cubieIndex++) {
            const cubeName = allCubies[cubieIndex];
            // sets cabCube to the list of cabezas face numbers for that cubie
            const cabCube = cabList[cubeName];
            // cycle through each letter of facename
            for (let face = 0; face < cubeName.length; face++) {            
                let color = pieces[cubieIndex].querySelector('.element.' + 
                    cubeName[face]).firstChild.className.split(' ')[1];
                // assign the proper position in the translated return value with the 1st letter of color
                returnVal[cabCube[face]] = color.substring(0,1);
            }
        }
    return returnVal.join('');
}

    // place description of cube in six fields on page of DOM
    function describeCube() {
        let c = getCabezas();
        document.getElementById('up').value = c.substring(0,9);
        document.getElementById('left').value = c.substring(9,18);
        document.getElementById('front').value = c.substring(18,27);
        document.getElementById('right').value = c.substring(27,36);
        document.getElementById('back').value = c.substring(36,45);
        document.getElementById('down').value = c.substring(45,54);
    }

// argument is a JSON description of a complete cube in this form:
// { 'FLU': ['red', 'white', 'blue'], ... }
// and draws that cube in the DOM
function putCubeSpec(newCube) {
    for (let cubieIndex = 0; cubieIndex < 26; cubieIndex++) {
        const cubeName = allCubies[cubieIndex];
        console.log('cubename', cubeName);
        console.log('data', newCube[cubeName]);
        const cubeColorList = newCube[cubeName];
        console.log('color list ', cubeColorList);
        for (let face = 0; face < cubeName.length; face++) {
            pieces[cubieIndex].querySelector('.element.' + cubeName[face]).firstChild.className = 
                'sticker ' + cubeColorList[face];
        }
    }
}

// returns a JSON description of the complete DOM cube in this form:
// { 'FLU': ['red', 'white', 'blue'], ... }
function getCubeSpec() {
    var returnVal = {};
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


document.addEventListener('DOMContentLoaded', () => {
    
    assembleCube();

    ///window.addEventListener('keydown', checkKeys);
});