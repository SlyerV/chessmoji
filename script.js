// Chess Tiles
const files = ["a","b","c","d","e","f","g","h"]
const ranks = ["8","7","6","5","4","3","2","1"]
let tiles = []
for (x of ranks) {
    for (y of files) {
        tiles.push(y+x)
    }
}
// Pieces
const rook1 = "💂🏻"
const knight1 = "🧝🏻"
const bishop1 = "🧙🏻"
const queen1 = "👸🏻"
const king1 = "🤴🏻"
const pawn1 = "👆🏻"
const rook2 = "💂🏿"
const knight2 = "🧝🏿"
const bishop2 = "🧙🏿"
const queen2 = "👸🏿"
const king2 = "🤴🏿"
const pawn2 = "👇🏿"
const black = "⬛"
const white = "⬜"
const whitePieces = [rook1,knight1,bishop1,queen1,king1,pawn1]
const blackPieces = [rook2,knight2,bishop2,queen2,king2,pawn2]
let board = [rook2,knight2,bishop2,queen2,king2,bishop2,knight2,rook2,
    pawn2,pawn2,pawn2,pawn2,pawn2,pawn2,pawn2,pawn2,
    white,black,white,black,white,black,white,black,
    black,white,black,white,black,white,black,white,
    white,black,white,black,white,black,white,black,
    black,white,black,white,black,white,black,white,
    pawn1,pawn1,pawn1,pawn1,pawn1,pawn1,pawn1,pawn1,
    rook1,knight1,bishop1,queen1,king1,bishop1,knight1,rook1]
// Other Vars
let selected=""
let turn = 1
// Colors
let select = "yellow"
let valid = "lime"
// Span Element Creation
let c = 0
for (x of board) {
    let span = document.createElement("span")
    span.id = tiles[c]
    span.className="tile"
    span.innerHTML = x
    span.onclick = function () {
        doMove(span.id)
    }
    document.getElementById("row"+Math.ceil((c+1)/8)).appendChild(span)
    c+=1
}
function saveBoard() {
    board = []
    for (x of tiles) {
        board.push(document.getElementById(x).innerHTML)
    }
}
function resetBoard() {
    let c = 0
    for (x of board) {
        document.getElementById(tiles[c]).innerHTML = x
        document.getElementById(tiles[c]).style.backgroundColor="transparent"
        c+=1
    }
}
function empty(tile) {
    if (tile==white || tile==black) {
        return true
    } else {
        return false
    }
}
function checkValidMoves(id) {
    const piece = document.getElementById(id)
    // alert(id)
    const file = id[0]
    const rank = id[1]
    function addFile(num) {
        const newFileIndex = files.indexOf(file) + num
        return files[newFileIndex]
    }
    function addRank(num) {
        return parseInt(rank)+num
    }
    if (piece.innerHTML==pawn1) {
        // 2 possible moves (no en passant)
        if (empty(document.getElementById(file+addRank(1)).innerHTML)) {
            document.getElementById(file+addRank(1)).style.backgroundColor=valid
        }
        if (rank=="2") {
            if (empty(document.getElementById(file+addRank(2)).innerHTML)) {
                document.getElementById(file+addRank(2)).style.backgroundColor=valid
            }
        }
    } else if (piece.innerHTML==knight1) {
        // 8 possible moves
        const knightMoves = [
            [addFile(-1), addRank(2)],
            [addFile(1), addRank(2)],
            [addFile(2), addRank(1)],
            [addFile(2), addRank(-1)],
            [addFile(1), addRank(-2)],
            [addFile(-1), addRank(-2)],
            [addFile(-2), addRank(-1)],
            [addFile(-2), addRank(1)],
        ];
        for (const move of knightMoves) {
            const [targetFile, targetRank] = move;
            if (targetFile && targetRank) {
                const targetId = targetFile + targetRank;
                if (empty(document.getElementById(targetId).innerHTML)) {
                document.getElementById(targetId).style.backgroundColor = valid;
                }
            }
        }
    }
}
function doMove(id) {
    let tile = document.getElementById(id)
    if (!whitePieces.includes(tile.innerHTML)&&(turn==1)&&(tile.style.backgroundColor!=valid)) {
        return
    }
    if (tile.style.backgroundColor==select) {
        tile.style.backgroundColor="transparent"
        selected=""
        resetBoard()
    } else if (tile.style.backgroundColor==valid) {
        resetBoard()
        document.getElementById(id).innerHTML=document.getElementById(selected).innerHTML
        if ((selected[1] % 2 == 0)&&(files.indexOf(selected[0]) % 2 == 0)) {
            document.getElementById(selected).innerHTML=white
        } else if ((selected[1] % 2 != 0)&&(files.indexOf(selected[0]) % 2 != 0)) {
            document.getElementById(selected).innerHTML=white
        } else {
            document.getElementById(selected).innerHTML=black
        }
    } else {
        resetBoard()
        tile.style.backgroundColor=select
        selected=id
        checkValidMoves(id)
    }
    saveBoard()
}