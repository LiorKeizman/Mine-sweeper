'use strict'


const MINE = '💣'
const EMPTY = ''
const FLAG = '🚩'

var gStartTime
var gBoard
var gTimer
var mineCounter = 0
var numsCounter = 0


const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevelE = {
    SIZE: 4,
    MINES: 2
}

var gLevelM = {
    SIZE: 8,
    MINES: 14
}

var gLevelH = {
    SIZE: 12,
    MINES: 32
}


function onInitGame(size = 4) {
    gGame.isOn = true
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

            if (Math.random() < 0.22) {
                board[i][j].isMine = true
            }
        }
    }
    return board

}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            if (!currCell.isMine) {
                var numOfMines = numOfMinesAround(i, j, board)
                currCell.minesAroundCount = numOfMines
            }
        }
    }
}


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
function renderBoard(board) {
    var srtHTML = ''
    for (var i = 0; i < board.length; i++) {
        srtHTML += `<tr>`

        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var content = (currCell.isMine) ? MINE : currCell.minesAroundCount
            if (currCell.isMine) mineCounter++
            if (!currCell.isMine) numsCounter++

            var className = (currCell.isShown) ? '' : 'hidden'
            srtHTML += `<td class= "cube ${className}"  onclick = "onCellClicked(this , ${i} ,${j})" oncontextmenu="onCellMarked(this , event)"
         data-i=${i} data-j=${j}><span>${content}</span></td>`
        }
        srtHTML += `</tr>`
    }
    var elBoard = document.querySelector('table')
    elBoard.innerHTML = srtHTML
}

function startTimer() {
    gStartTime = Date.now()
    gTimer = setInterval(updateTimer, 100)
}
function updateTimer() {
    var diff = Date.now() - gStartTime
    gGame.secsPassed = (diff / 1000).toFixed(1)
    document.querySelector('.timer').innerText = 'Your Time Is: ' + gGame.secsPassed
}

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isMarked) return
    if (gGame.secsPassed === 0)
        startTimer()
    elCell.isShown = true
    revealCell(elCell, i, j)
    if (gBoard[i][j].isMine) {
        gameOver(gBoard, elCell)
    } else {
        if (gBoard[i][j].minesAroundCount === 0) {
            expandShown(gBoard, elCell, i, j)
        }
        checkGameOver()
    }

}

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

function gameOver() {
    gGame.isOn = false
    clearInterval(gTimer)
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
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


function checkGameOver() {
    if (gGame.shownCount === numsCounter && gGame.markedCount === mineCounter) {
        gGame.isOn = false
        clearInterval(gTimer)
        document.querySelector('.new').innerText = '😜'
        document.querySelector('.box1').style.display = 'block'

    }

}

function expandShown(board, elCell, i, j) {
    for (var x = i - 1; x <= i + 1; x++) {
        if (!(x < 0 || x >= board.length)) {
            for (var y = j - 1; y <= j + 1; y++) {
                if (!(y < 0 || y >= board[x].length))
                    if (x !== i || y !== j) {
                        var content = document.querySelector(`[data-i="${x}"][data-j="${y}"]`);
                        revealCell(content, x, y)
                    }
            }
        }
    }


}

function revealCell(elCell, i, j) {
    var content = document.querySelector(`[data-i="${i}"][data-j="${j}"] span`);
    if (gBoard[i][j].isMine) {
        elCell.classList.remove('hidden')
        elCell.classList.add('not')
        content.style.opacity = 1
    } else if (!gBoard[i][j].isShown) {
        gGame.shownCount += 1
        if (gBoard[i][j].minesAroundCount === 0) {
            elCell.style.backgroundColor = 'white'
            content.style.opacity = 0
        } else {
            content.style.opacity = 1
            elCell.style.backgroundColor = 'white'
        }
    }
}