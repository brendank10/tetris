document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));

    const scoreDisplay = document.querySelector('#score');

    const startButton = document.querySelector('#start-button');
    startButton.addEventListener('click', startPause);

    const width = 10;

    let score = 0;

    let nextRandom = 0;

    let timerId;

    const colors = [
        "rgb(9, 87, 35)",
        "rgb(103, 29, 187)",
        "rgb(223, 146, 31)",
        "rgb(151, 12, 77)",
        "rgb(24, 42, 145)"
    ]

    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];

    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ];
    
    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ];

    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ];

    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ];

    const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

    let currentPosition = 4;
    let currentRotation = 0;

    let rand = Math.floor(Math.random()*theTetrominoes.length);

    let current = theTetrominoes[rand][currentRotation];

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[rand];
        });
    }

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        });
    }
    
    function startPause() {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
            document.removeEventListener('keyup', control);
        }
        else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            displayNextUp();
            document.addEventListener('keyup', control);
            startButton.blur();
        }
    }

    function addScore() {
        for(i=0; i<=199; i+=width) {
            const row = [];
            for(j=i; j<=i+9; j++) {
                row.push(j);
            }
            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 100;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken');
                    squares[index].classList.remove('tetromino');
                    squares[index].style.backgroundColor = '';
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML += " GAME OVER";
            clearInterval(timerId);
        }
    }

    function control(e) {
        if(e.keyCode == 17) {
            rotateCounterClockwise();
        }
        if(e.keyCode == 32) {
            moveHardDown();
        }
        if(e.keyCode == 37) {
            moveLeft();
        }
        if(e.keyCode == 38) {
            rotateClockwise();
        }
        if(e.keyCode == 39) {
            moveRight();
        }
        if(e.keyCode == 40) {
            moveDown();
        }
        if(e.keyCode == 90) {
            rotateCounterClockwise();
        }
        if(e.keyCode == 88) {
            rotateClockwise();
        }
    }

    function moveDown() {
        undraw();
        currentPosition += width;
        addScore();
        draw();
        freeze();
    }

    function moveHardDown() {
        while(currentPosition != 4) {
            moveDown();
        }
    }

    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'));
            rand = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetrominoes.length);
            current = theTetrominoes[rand][currentRotation];
            currentPosition = 4;
            draw();
            displayNextUp();
            gameOver();
        }
    }

    function moveLeft() {
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width == 0);
        if(!isAtLeftEdge) {
            currentPosition -= 1;
        }
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1;
        }
        draw();
    }

    function moveRight() {
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index + 1) % width == 0);
        if(!isAtRightEdge) {
            currentPosition += 1;
        }
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition -= 1;
        }
        draw();
    }

    function rotateClockwise() {
        undraw();
        if(currentRotation == 3) {
            currentRotation = 0;
        } 
        else{
            currentRotation ++;
        }
        current = theTetrominoes[rand][currentRotation];
        if(current.some(index => (currentPosition + index + 1) % width == 0) && current.some(index => (currentPosition + index) % width == 0)) {
            if(currentRotation == 0) {
                currentRotation = 3;
            }
            else {
                currentRotation --;
            }
        }
        current = theTetrominoes[rand][currentRotation];
        draw();
    }

    function rotateCounterClockwise() {
        undraw();
        if(currentRotation == 0) {
            currentRotation = 3;
        } 
        else{
            currentRotation --;
        }
        current = theTetrominoes[rand][currentRotation];
        if(current.some(index => (currentPosition + index + 1) % width == 0) && current.some(index => (currentPosition + index) % width == 0)) {
            if(currentRotation == 3) {
                currentRotation = 0;
            } 
            else {
                currentRotation ++;
            }
        }
        current = theTetrominoes[rand][currentRotation];
        draw();
    }

    const displaySquares = document.querySelectorAll('.mini-grid div');
    const displayWidth = 4;
    let displayIndex = 0;

    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2],
        [0,displayWidth,displayWidth+1,displayWidth*2+1],
        [1,displayWidth,displayWidth+1,displayWidth+2],
        [0,1,displayWidth,displayWidth+1],
        [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1]
    ];

    function displayNextUp() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
            square.style.backgroundColor = '';
        });
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetromino');
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
        });
    }
})