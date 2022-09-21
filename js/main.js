'use strict'


const MINE = '💣'
const EMPTY = ''
const FLAG = '🚩'

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gLevel = {
    SIZE: 4,
    MINES: 2
}

var cell = {
    minesAroundCount: 4,
    isShown: true,
    isMine: false,
    isMarked: false
}








function onInitGame() {
    gBoard = buildBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)

}

var gBoard = buildBoard()
console.log(gBoard);
function buildBoard() {
    var board = []
    for (var i = 0; i < 4; i++) {
        board[i] = []
        for (var j = 0; j < 4; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }

            if (Math.random() > 0.8) {
                board[i][j].isMine = true
        }
        }
    }
    // board[0][0]=MINE
    // board[3][3]=MINE
    return board

}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            if(!currCell.isMine){
                var numOfMines = numOfMinesAround(i, j, board)
                console.log('1: ' + numOfMines);
                currCell.minesAroundCount = numOfMines
                console.log('2: ' + currCell.minesAroundCount);
            }
        }
    }
}


function numOfMinesAround(cellI, cellJ,board) {
    var negsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (!(i < 0 || i >= board.length)){
            for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                if (!(j < 0 || j >= board[i].length))
                    if (board[i][j].isMine) negsCount++
            }
            //console.log('i= ' + i + ' j= ' +j + ' board= '+ board[i][j].isMine);
        }
    }
    console.log(negsCount);
    return negsCount


}

function renderBoard(board) {
    var srtHTML = ''
    for (var i = 0; i < board.length; i++) {
        srtHTML += `<tr>`

        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            var content = (currCell.isMine) ? MINE : currCell.minesAroundCount
            var className = (currCell.isShown)?'': 'hidden'
            srtHTML += `<td class= "cube ${className}" oncontextmenu="cellMarked(this)" onclick = "onCellClicked(this , ${i} ,${j})"
         data-i=${i} data-j=${j}><span>${content}</span></td>`
        }
        srtHTML += `</tr>`
    }
    var elBoard = document.querySelector('table')
    elBoard.innerHTML = srtHTML
}
function onCellClicked(elCell, i, j) {

    var elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    elCell.isShown = true
    var content = document.querySelector(`[data-i="${i}"][data-j="${j}"] span`);
    if(content.innerText === MINE){
        elCell.classList.add('not')
        content.style.opacity = 1
     } else if(content.innerText === '0'){
        content.style.opacity = 0
        elCell.style.backgroundColor = 'white'
    }else{
    content.style.opacity = 1
    elCell.style.backgroundColor = 'white'
    }
    
}
function cellMarked(elCell) {
    
    console.log('hi');
}
function checkGameOver() {
    
}
function expandShown(board, elCell, i, j) {

}