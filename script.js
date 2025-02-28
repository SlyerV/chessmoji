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
let checked1=false
let checked2=false
let checker=""
let turn = 1
// Colors
let select = "yellow"
let valid = "lime"
let capture = "orange"
let checked = "red"
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
function capturable(tile) {
    try {
        if (turn==1) {
            if (blackPieces.includes(tile)) {
                return true
            } else {
                return false
            }
        } else {
            if (whitePieces.includes(tile)) {
                return true
            } else {
                return false
            }
        }
    }catch(err){
        alert(err)
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
    if ((piece.innerHTML==pawn1)) {
        // 2 possible moves (no en passant yet)
        if (empty(document.getElementById(file+addRank(1)).innerHTML)) {
            document.getElementById(file+addRank(1)).style.backgroundColor=valid
        }
        if (rank=="2") {
            if ( (empty(document.getElementById(file+addRank(1)).innerHTML) && (empty(document.getElementById(file+addRank(2)).innerHTML))) ) {
                document.getElementById(file+addRank(2)).style.backgroundColor=valid
            }
        }
        if (capturable(document.getElementById(addFile(-1)+addRank(1)).innerHTML)) {
            document.getElementById(addFile(-1)+addRank(1)).style.backgroundColor=capture
        }
        if (capturable(document.getElementById(addFile(1)+addRank(1)).innerHTML)) {
            document.getElementById(addFile(1)+addRank(1)).style.backgroundColor=capture
        }
    } else if (piece.innerHTML==pawn2) {
        // 2 possible moves (no en passant yet)
        if (empty(document.getElementById(file+addRank(-1)).innerHTML)) {
            document.getElementById(file+addRank(-1)).style.backgroundColor=valid
        }
        if (rank=="7") {
            if ( (empty(document.getElementById(file+addRank(-1)).innerHTML) && (empty(document.getElementById(file+addRank(-2)).innerHTML)))) {
                document.getElementById(file+addRank(-2)).style.backgroundColor=valid
            }
        }
        if (capturable(document.getElementById(addFile(-1)+addRank(-1)).innerHTML)) {
            document.getElementById(addFile(-1)+addRank(-1)).style.backgroundColor=capture
        }
        if (capturable(document.getElementById(addFile(1)+addRank(-1)).innerHTML)) {
            document.getElementById(addFile(1)+addRank(-1)).style.backgroundColor=capture
        }
    } else if ((piece.innerHTML==knight1)||(piece.innerHTML==knight2)) {
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
            if (tiles.includes(targetFile + targetRank)) {
                const targetId = targetFile + targetRank;
                if (empty(document.getElementById(targetId).innerHTML)) {
                document.getElementById(targetId).style.backgroundColor = valid;
                }
                if (capturable(document.getElementById(targetId).innerHTML)) {
                    document.getElementById(targetId).style.backgroundColor = capture;
                }
            }
        }
    } else if ((piece.innerHTML==bishop1)||(piece.innerHTML==bishop2)) {
        // 28 possible moves, 7 per quadrant
        const bishopMoves1 = [
            [addFile(-1), addRank(1)],
            [addFile(-2), addRank(2)],
            [addFile(-3), addRank(3)],
            [addFile(-4), addRank(4)],
            [addFile(-5), addRank(5)],
            [addFile(-6), addRank(6)],
            [addFile(-7), addRank(7)],
        ];
        const bishopMoves2 = [
            [addFile(1), addRank(1)],
            [addFile(2), addRank(2)],
            [addFile(3), addRank(3)],
            [addFile(4), addRank(4)],
            [addFile(5), addRank(5)],
            [addFile(6), addRank(6)],
            [addFile(7), addRank(7)],
        ];
        const bishopMoves3 = [
            [addFile(-1), addRank(-1)],
            [addFile(-2), addRank(-2)],
            [addFile(-3), addRank(-3)],
            [addFile(-4), addRank(-4)],
            [addFile(-5), addRank(-5)],
            [addFile(-6), addRank(-6)],
            [addFile(-7), addRank(-7)],
        ];
        const bishopMoves4 = [
            [addFile(1), addRank(-1)],
            [addFile(2), addRank(-2)],
            [addFile(3), addRank(-3)],
            [addFile(4), addRank(-4)],
            [addFile(5), addRank(-5)],
            [addFile(6), addRank(-6)],
            [addFile(7), addRank(-7)],
        ];
        const bishopMoves = [bishopMoves1, bishopMoves2, bishopMoves3, bishopMoves4];
        for (const dir of bishopMoves) {
            for (const move of dir) {
                const [targetFile, targetRank] = move;
                if (tiles.includes(targetFile + targetRank)) {
                    const targetId = targetFile + targetRank;
                    if (empty(document.getElementById(targetId).innerHTML)) {
                        document.getElementById(targetId).style.backgroundColor = valid;
                    } else if (capturable(document.getElementById(targetId).innerHTML)) {
                        document.getElementById(targetId).style.backgroundColor = capture
                        break
                    } else {
                        break
                    }
                } else {
                    break
                }
            }
        }
    } else if ((piece.innerHTML==rook1)||(piece.innerHTML==rook2)) {
        // 28 possible moves
        // Up
        const rookMoves1 = [
            [addFile(0), addRank(1)],
            [addFile(0), addRank(2)],
            [addFile(0), addRank(3)],
            [addFile(0), addRank(4)],
            [addFile(0), addRank(5)],
            [addFile(0), addRank(6)],
            [addFile(0), addRank(7)],
        ]
        // Down
        const rookMoves2 = [
            [addFile(0), addRank(-1)],
            [addFile(0), addRank(-2)],
            [addFile(0), addRank(-3)],
            [addFile(0), addRank(-4)],
            [addFile(0), addRank(-5)],
            [addFile(0), addRank(-6)],
            [addFile(0), addRank(-7)],
        ]
        // Left
        const rookMoves3 = [
            [addFile(-1), addRank(0)],
            [addFile(-2), addRank(0)],
            [addFile(-3), addRank(0)],
            [addFile(-4), addRank(0)],
            [addFile(-5), addRank(0)],
            [addFile(-6), addRank(0)],
            [addFile(-7), addRank(0)],
        ]
        // Right
        const rookMoves4 = [
            [addFile(1), addRank(0)],
            [addFile(2), addRank(0)],
            [addFile(3), addRank(0)],
            [addFile(4), addRank(0)],
            [addFile(5), addRank(0)],
            [addFile(6), addRank(0)],
            [addFile(7), addRank(0)],
        ]
        const rookMoves = [rookMoves1, rookMoves2, rookMoves3, rookMoves4];
        for (const dir of rookMoves) {
            for (const move of dir) {
                const [targetFile, targetRank] = move;
                if (tiles.includes(targetFile + targetRank)) {
                    const targetId = targetFile + targetRank;
                    if (empty(document.getElementById(targetId).innerHTML)) {
                        document.getElementById(targetId).style.backgroundColor = valid;
                    } else if (capturable(document.getElementById(targetId).innerHTML)) {
                        document.getElementById(targetId).style.backgroundColor = capture
                        break
                    } else {
                        break
                    }
                } else {
                    break
                }
            }
        }
    } else if ((piece.innerHTML==queen1)||(piece.innerHTML==queen2)) {
        // 56 possible moves
        const queenMoves1 = [
            [addFile(0), addRank(1)],
            [addFile(0), addRank(2)],
            [addFile(0), addRank(3)],
            [addFile(0), addRank(4)],
            [addFile(0), addRank(5)],
            [addFile(0), addRank(6)],
            [addFile(0), addRank(7)],
        ]
        // Down
        const queenMoves3 = [
            [addFile(0), addRank(-1)],
            [addFile(0), addRank(-2)],
            [addFile(0), addRank(-3)],
            [addFile(0), addRank(-4)],
            [addFile(0), addRank(-5)],
            [addFile(0), addRank(-6)],
            [addFile(0), addRank(-7)],
        ]
        // Left
        const queenMoves5 = [
            [addFile(-1), addRank(0)],
            [addFile(-2), addRank(0)],
            [addFile(-3), addRank(0)],
            [addFile(-4), addRank(0)],
            [addFile(-5), addRank(0)],
            [addFile(-6), addRank(0)],
            [addFile(-7), addRank(0)],
        ]
        // Right
        const queenMoves7 = [
            [addFile(1), addRank(0)],
            [addFile(2), addRank(0)],
            [addFile(3), addRank(0)],
            [addFile(4), addRank(0)],
            [addFile(5), addRank(0)],
            [addFile(6), addRank(0)],
            [addFile(7), addRank(0)],
        ]
        const queenMoves2 = [
            [addFile(-1), addRank(1)],
            [addFile(-2), addRank(2)],
            [addFile(-3), addRank(3)],
            [addFile(-4), addRank(4)],
            [addFile(-5), addRank(5)],
            [addFile(-6), addRank(6)],
            [addFile(-7), addRank(7)],
        ];
        const queenMoves4 = [
            [addFile(1), addRank(1)],
            [addFile(2), addRank(2)],
            [addFile(3), addRank(3)],
            [addFile(4), addRank(4)],
            [addFile(5), addRank(5)],
            [addFile(6), addRank(6)],
            [addFile(7), addRank(7)],
        ];
        const queenMoves6 = [
            [addFile(-1), addRank(-1)],
            [addFile(-2), addRank(-2)],
            [addFile(-3), addRank(-3)],
            [addFile(-4), addRank(-4)],
            [addFile(-5), addRank(-5)],
            [addFile(-6), addRank(-6)],
            [addFile(-7), addRank(-7)],
        ];
        const queenMoves8 = [
            [addFile(1), addRank(-1)],
            [addFile(2), addRank(-2)],
            [addFile(3), addRank(-3)],
            [addFile(4), addRank(-4)],
            [addFile(5), addRank(-5)],
            [addFile(6), addRank(-6)],
            [addFile(7), addRank(-7)],
        ];
        const queenMoves = [queenMoves1, queenMoves2, queenMoves3, queenMoves4, queenMoves5, queenMoves6, queenMoves7, queenMoves8]
        for (const dir of queenMoves) {
            for (const move of dir) {
                const [targetFile, targetRank] = move;
                if (tiles.includes(targetFile + targetRank)) {
                    const targetId = targetFile + targetRank;
                    if (empty(document.getElementById(targetId).innerHTML)) {
                        document.getElementById(targetId).style.backgroundColor = valid;
                    } else if (capturable(document.getElementById(targetId).innerHTML)) {
                        document.getElementById(targetId).style.backgroundColor = capture
                        break
                    } else {
                        break
                    }
                } else {
                    break
                }
            }
        }
    } else if ((piece.innerHTML==king1)||(piece.innerHTML==king2)) {
        // 8 possible moves
        const kingMoves = [
            [addFile(-1), addRank(1)],
            [addFile(0), addRank(1)],
            [addFile(1), addRank(1)],
            [addFile(1), addRank(0)],
            [addFile(1), addRank(-1)],
            [addFile(0), addRank(-1)],
            [addFile(-1), addRank(-1)],
            [addFile(-1), addRank(0)],
        ];
        for (const move of kingMoves) {
            const [targetFile, targetRank] = move;
            if (tiles.includes(targetFile + targetRank)) {
                const targetId = targetFile + targetRank;
                if (empty(document.getElementById(targetId).innerHTML)) {
                document.getElementById(targetId).style.backgroundColor = valid;
                }
                if (capturable(document.getElementById(targetId).innerHTML)) {
                    document.getElementById(targetId).style.backgroundColor = capture;
                }
            }
        }
    }
}
function changeTurn() {
    const turnbar = document.getElementById("turnbar")
    if (turn==1) {
        turn=2
        turnbar.innerHTML="Turn: Black"
        turnbar.style.color='#555'
        // turnbar.style.textShadow="1px 1px 3px white"
        document.getELementby
    } else {
        turn=1
        turnbar.innerHTML="Turn: White"
        turnbar.style.color='#eee'
        // turnbar.style.textShadow="1px 1px 3px black"
    }
}
function doMove(id) {
    let tile = document.getElementById(id)
    if (!whitePieces.includes(tile.innerHTML)&&(turn==1)&&(tile.style.backgroundColor!=valid)&&(tile.style.backgroundColor!=capture)) {
        return
    }
    if (!blackPieces.includes(tile.innerHTML)&&(turn==2)&&(tile.style.backgroundColor!=valid)&&(tile.style.backgroundColor!=capture)) {
        return
    }
    if (tile.style.backgroundColor==select) {
        tile.style.backgroundColor="transparent"
        selected=""
        resetBoard()
    } else if ((tile.style.backgroundColor==valid)||(tile.style.backgroundColor==capture)) {
        resetBoard()
        document.getElementById(id).innerHTML=document.getElementById(selected).innerHTML
        if ((selected[1] % 2 == 0)&&(files.indexOf(selected[0]) % 2 == 0)) {
            document.getElementById(selected).innerHTML=white
        } else if ((selected[1] % 2 != 0)&&(files.indexOf(selected[0]) % 2 != 0)) {
            document.getElementById(selected).innerHTML=white
        } else {
            document.getElementById(selected).innerHTML=black
        }
        changeTurn()
    } else {
        resetBoard()
        tile.style.backgroundColor=select
        selected=id
        checkValidMoves(id)
    }
    saveBoard()
}