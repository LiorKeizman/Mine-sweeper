'use strict'


const MINE = '💣'
const EMPTY = ''
const FLAG = '🚩'

var gStartTime
var gBoard
var gTimer
var mineCounter = 0
var numsCounter = 0
var firstClick = true


const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 0
}

var gLevelE = {
    SIZE: 4,
    MINES: 2,
    LIVES: 1
}

var gLevelM = {
    SIZE: 8,
    MINES: 14,
    LIVES: 2
}

var gLevelH = {
    SIZE: 12,
    MINES: 32,
    LIVES: 3
}


function onInitGame(size = 4) {
    gGame.isOn = true
    firstClick = true
    document.querySelector('.new').innerText = '😃'
    document.querySelector('.box1').style.display = 'none'
    document.querySelector('.box2').style.display = 'none'
    clearInterval(gTimer)
    gGame.secsPassed = 0
    document.querySelector('.timer').innerText = 'Your Time Is: ' + gGame.secsPassed
    mineCounter = 0
    numsCounter = 0
    gGame.markedCount = 0
    gGame.shownCount = 0
    gBoard = buildBoard(size)
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)

}

function buildBoard(size) {
    mineCounter = 0
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
            if (size === 4) {
                renderLives(gLevelE.LIVES)
                gGame.lives = gLevelE.LIVES
                if (mineCounter < 2) {
                    if (Math.random() < 0.26) {
                        board[i][j].isMine = true
                        mineCounter++
                        console.log(i , j);
                    }
                }
            }
            if (size === 8) {
                 renderLives(gLevelM.LIVES)
                 gGame.lives = gLevelM.LIVES
                 console.log(gGame.lives);
                if (mineCounter < 14) {
                    if (Math.random() < 0.28) {
                        board[i][j].isMine = true
                        mineCounter++
                    }
                }
            }
            if (size === 12) {
                renderLives(gLevelH.LIVES)
                gGame.lives = gLevelH.LIVES
                if (mineCounter < 32) {
                    if (Math.random() < 0.3) {
                        board[i][j].isMine = true
                        mineCounter++
                    }
                }
            }
            if(!board[i][j].isMine)
                numsCounter++
        }
    }
    return board

}

// Set mines around values for all cells
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            if (!currCell.isMine) {
                var numOfMines = numOfMinesAround(i, j, board)
                currCell.minesAroundCount = numOfMines
            }
            console.log(currCell.minesAroundCount ,i , j);
        }
    }
}

// Calculate mines around cell
function numOfMinesAround(cellI, cellJ, board) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (!(i < 0 || i >= board.length)) {
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (!(j < 0 || j >= board[i].length))
                    if (board[i][j].isMine) negsCount++
            }
        }
    }
    return negsCount


}
//prints the board
function renderBoard(board) {
    var srtHTML = ''
    for (var i = 0; i < board.length; i++) {
        srtHTML += `<tr>`

        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var content = (currCell.isMine) ? MINE : currCell.minesAroundCount
            var className = (currCell.isShown) ? '' : 'hidden'
            srtHTML += `<td class= "cube ${className}"  onclick = "onCellClicked(this , ${i} ,${j})" oncontextmenu="onCellMarked(this , event)"
         data-i=${i} data-j=${j}><span>${content}</span></td>`
        }
        srtHTML += `</tr>`
    }
    var elBoard = document.querySelector('table')
    elBoard.innerHTML = srtHTML
}
//sets timer
function startTimer() {
    gStartTime = Date.now()
    gTimer = setInterval(updateTimer, 100)
}
function updateTimer() {
    var diff = Date.now() - gStartTime
    gGame.secsPassed = (diff / 1000).toFixed(1)
    document.querySelector('.timer').innerText = 'Your Time Is: ' + gGame.secsPassed
}

// Clicks on the cell
function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    // If first click
    if (firstClick && gBoard[i][j].isMine) {
        console.log('hi');
        gBoard[i][j].isMine = false
        mineCounter--
        setMinesNegsCount(gBoard)
        renderBoard(gBoard)
        var contents = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
        revealCell(contents,i,j)
    }
    firstClick = false
    if (gBoard[i][j].isMarked) return
    if (gGame.secsPassed === 0)
        startTimer()
    revealCell(elCell, i, j)
    // checks if the cell is a mine
    if (gBoard[i][j].isMine) {
       gGame.lives--
       renderLives(gGame.lives)
       if(gGame.lives === 0){
           gameOver(gBoard, elCell)
       }
    } else {
        if (gBoard[i][j].minesAroundCount === 0) {
            expandShown(gBoard, elCell, i, j)
        }
        checkGameOver()
    }
}
// adds a flag to a cell by right clicking
function onCellMarked(elCell) {
    if (!gGame.isOn) return
    if (elCell.isShown) return
    var i = elCell.dataset.i
    var j = elCell.dataset.j
    var content = document.querySelector(`[data-i="${i}"][data-j="${j}"] span`);
    console.log(gBoard[i][j]);
    if (!gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        gGame.markedCount += 1
        checkGameOver()
        content.innerText = FLAG
        content.style.opacity = 1
    }
    else {
        gBoard[i][j].isMarked = false
        gGame.markedCount -= 1
        content.style.opacity = 0
        if (gBoard[i][j].isMine) {
            content.innerText = MINE
            content.style.opacity = 0
        } else {
            content.innerText = gBoard[i][j].minesAroundCount
            content.style.opacity = 0
        }
    }
}
//ends the game if you clicked on more mines than lives you have
function gameOver() {
    gGame.isOn = false
    clearInterval(gTimer)
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true
                var content = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
                revealCell(content, i, j)
            }
        }
    }
    document.querySelector('.new').innerText = '😵'
    document.querySelector('.box2').style.display = 'block'
    return

}

// checks if you won the game
function checkGameOver() {
    if (gGame.shownCount >= numsCounter && gGame.markedCount === mineCounter) {
        gGame.isOn = false
        clearInterval(gTimer)
        document.querySelector('.new').innerText = '😜'
        document.querySelector('.box1').style.display = 'block'

    }

}
// reveals the cells around the clicked cell
function expandShown(board, elCell, i, j) {
    for (var x = i - 1; x <= i + 1; x++) {
        if (!(x < 0 || x >= board.length)) {
            for (var y = j - 1; y <= j + 1; y++) {
                if (!(y < 0 || y >= board[x].length)){
                    if (x !== i || y !== j) {
                        var content = document.querySelector(`[data-i="${x}"][data-j="${y}"]`);
                        revealCell(content, x, y)
                    }
            }
        }
    }
}
}



// reveals one cell 
function revealCell(elCell, i, j) {
    var content = document.querySelector(`[data-i="${i}"][data-j="${j}"] span`);
    if (gBoard[i][j].isMine) {
        elCell.classList.remove('hidden')
        elCell.classList.add('not')
        content.style.opacity = 1
    } else if (!elCell.isShown) {
        console.log("SHOWING")
        elCell.isShown = true
        gGame.shownCount += 1
        elCell.style.backgroundColor = 'white'
        if (gBoard[i][j].minesAroundCount === 0) {
            content.style.opacity = 0
        } else {
            content.style.opacity = 1
        }
    }
}

function renderLives(lives){
    var elLive = document.querySelector('.live');
    var strLivesHTML = '';
    for (var i = 0; i < lives; i++) {
        strLivesHTML += '❤️';
    }
    elLive.innerText = strLivesHTML;


}
// TODO: add a function to hints
function getHint(){

}
