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
// SFX
const captureSFX = new Audio("./sfx/capture.mp3")
const moveSFX = new Audio("./sfx/move-self.mp3")
const checkSFX = new Audio("./sfx/move-check.mp3")
// Other Vars
let selected=""
let checked1=false
let checked2=false
let checker=""
let blocker=""
let blockable = false
let blocked=false
let territoryCheck = false
let territory=[]
let captures=[]
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
        if ((document.getElementById(tiles[c]).innerHTML==king1)) {
            if (!checked1) {
                document.getElementById(tiles[c]).style.backgroundColor="transparent"
            } else if (document.getElementById(tiles[c]).style.backgroundColor=checked) {
                document.getElementById(tiles[c]).style.backgroundColor=checked
            }
        } else if ((document.getElementById(tiles[c]).innerHTML==king2)) {
            if (!checked2) {
                document.getElementById(tiles[c]).style.backgroundColor="transparent"
            } else if (document.getElementById(tiles[c]).style.backgroundColor=checked) {
                document.getElementById(tiles[c]).style.backgroundColor=checked
            }
        } else if (!territoryCheck) {
            document.getElementById(tiles[c]).style.backgroundColor="transparent"
        }
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
function check(tile) {
    if (turn==1) {
        if (tile==king2) {
            return true
        } else {
            return false
        }
    } else {
        if (tile==king1) {
            return true
        } else {
            return false
        }
    }
}
function capturable(tile) {
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
}
function territoryPush(id) {
    if (territoryCheck) {
        // alert(id)
        territory.push(id)
        // document.getElementById(id).style.backgroundColor=checked
    }
}
function capturePush(id) {
    if (territoryCheck) {
        // alert(id)
        captures.push(id)
        // document.getElementById(id).style.backgroundColor=checked
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
        if (tiles.includes(file+addRank(1))) {
            if ((empty(document.getElementById(file+addRank(1)).innerHTML))&&(!checked1)) {
                document.getElementById(file+addRank(1)).style.backgroundColor=valid
            } else if ((!territoryCheck)&&(checked1)&&(empty(document.getElementById(file+addRank(1)).innerHTML))) {
                try {
                    document.getElementById(file+addRank(1)).innerHTML=document.getElementById(id).innerHTML
                    blocker = (file+addRank(1))
                    changeTurn()
                    territoryCheck=true
                    blockable=true
                    checkValidMoves(checker)
                    territoryCheck=false
                    changeTurn()
                    // alert(captures)
                    // alert(piece.style.backgroundColor)
                    resetBoard()
                    piece.style.backgroundColor=select
                    // alert(piece.style.backgroundColor)
                    if (blockable) {
                        blocked=true
                        document.getElementById(file+addRank(1)).style.backgroundColor=valid
                    }
                    blockable=false
                } catch (err) {
                    alert(err)
                }
            }
        }
        if (rank=="2") {
            if ( (empty(document.getElementById(file+addRank(1)).innerHTML)) && (empty(document.getElementById(file+addRank(2)).innerHTML)) && (!checked1) ) {
                document.getElementById(file+addRank(2)).style.backgroundColor=valid
            } else if ((!territoryCheck)&&(checked1)&&(empty(document.getElementById(file+addRank(2)).innerHTML))) {
                try {
                    document.getElementById(file+addRank(2)).innerHTML=document.getElementById(id).innerHTML
                    blocker = (file+addRank(2))
                    changeTurn()
                    territoryCheck=true
                    blockable=true
                    checkValidMoves(checker)
                    territoryCheck=false
                    changeTurn()
                    // alert(captures)
                    resetBoard()
                    piece.style.backgroundColor=select
                    if (blocked) {
                        document.getElementById(file+addRank(1)).style.backgroundColor=valid
                    }
                    if (blockable) {
                        document.getElementById(file+addRank(2)).style.backgroundColor=valid
                    }
                    blocked=false
                    blockable=false
                    piece.style.backgroundColor=select
                    return
                } catch (err) {
                    alert(err)
                }
            }
        }
        if (tiles.includes(addFile(-1)+addRank(1))) {
            if (check(document.getElementById(addFile(-1)+addRank(1)).innerHTML)) {
                checkSFX.load()
                checkSFX.play()
                document.getElementById(addFile(-1)+addRank(1)).style.backgroundColor=checked
                checked2=true
                checker=id
                return
            }
            if (empty(document.getElementById(addFile(-1)+addRank(1)).innerHTML)) {
                territoryPush(addFile(-1)+addRank(1))
            }
            if (capturable(document.getElementById(addFile(-1)+addRank(1)).innerHTML)&&(!checked1)) {
                document.getElementById(addFile(-1)+addRank(1)).style.backgroundColor=capture
                capturePush(addFile(-1)+addRank(1))
            }
        }
        if (tiles.includes(addFile(1)+addRank(1))) {
            if (check(document.getElementById(addFile(1)+addRank(1)).innerHTML)) {
                checkSFX.load()
                checkSFX.play()
                document.getElementById(addFile(1)+addRank(1)).style.backgroundColor=checked
                checked2=true
                checker=id
                return
            }
            if (empty(document.getElementById(addFile(1)+addRank(1)).innerHTML)) {
                territoryPush(addFile(1)+addRank(1))
            }
            if (capturable(document.getElementById(addFile(1)+addRank(1)).innerHTML)&&(!checked1)) {
                document.getElementById(addFile(1)+addRank(1)).style.backgroundColor=capture
                capturePush(addFile(1)+addRank(1))
            }
        }
    } else if (piece.innerHTML==pawn2) {
        // 2 possible moves (no en passant yet)
        if (tiles.includes(file+addRank(-1))) {
            if ((empty(document.getElementById(file+addRank(-1)).innerHTML))&&(!checked2)) {
                document.getElementById(file+addRank(-1)).style.backgroundColor=valid
            } else if ((!territoryCheck)&&(checked2)&&(empty(document.getElementById(file+addRank(-1)).innerHTML))) {
                try {
                    document.getElementById(file+addRank(-1)).innerHTML=document.getElementById(id).innerHTML
                    blocker = (file+addRank(-1))
                    changeTurn()
                    territoryCheck=true
                    blockable=true
                    checkValidMoves(checker)
                    territoryCheck=false
                    changeTurn()
                    // alert(captures)
                    // alert(piece.style.backgroundColor)
                    resetBoard()
                    piece.style.backgroundColor=select
                    // alert(piece.style.backgroundColor)
                    if (blockable) {
                        blocked=true
                        document.getElementById(file+addRank(-1)).style.backgroundColor=valid
                    }
                    blockable=false
                } catch (err) {
                    alert(err)
                }
            }
        }
        if (rank=="7") {
            if ( (empty(document.getElementById(file+addRank(-1)).innerHTML)) && (empty(document.getElementById(file+addRank(-2)).innerHTML)) && (!checked2)) {
                document.getElementById(file+addRank(-2)).style.backgroundColor=valid
            } else if ((!territoryCheck)&&(checked2)&&(empty(document.getElementById(file+addRank(-2)).innerHTML))) {
                try {
                    document.getElementById(file+addRank(-2)).innerHTML=document.getElementById(id).innerHTML
                    blocker = (file+addRank(-2))
                    changeTurn()
                    territoryCheck=true
                    blockable=true
                    checkValidMoves(checker)
                    territoryCheck=false
                    changeTurn()
                    // alert(captures)
                    resetBoard()
                    piece.style.backgroundColor=select
                    if (blocked) {
                        document.getElementById(file+addRank(-1)).style.backgroundColor=valid
                    }
                    if (blockable) {
                        document.getElementById(file+addRank(-2)).style.backgroundColor=valid
                    }
                    blocked=false
                    blockable=false
                    piece.style.backgroundColor=select
                    return
                } catch (err) {
                    alert(err)
                }
            }
        }
        if (tiles.includes(addFile(-1)+addRank(-1))) {
            if (check(document.getElementById(addFile(-1)+addRank(-1)).innerHTML)) {
                checkSFX.load()
                checkSFX.play()
                document.getElementById(addFile(-1)+addRank(-1)).style.backgroundColor=checked
                checked2=true
                checker=id
                return
            }
            if (empty(document.getElementById(addFile(-1)+addRank(-1)).innerHTML)) {
                territoryPush(addFile(-1)+addRank(-1))
            }
            if (capturable(document.getElementById(addFile(-1)+addRank(-1)).innerHTML)&&(!checked2)) {
                document.getElementById(addFile(-1)+addRank(-1)).style.backgroundColor=capture
                capturePush(addFile(-1)+addRank(-1))
            }
        }
        if (tiles.includes(addFile(1)+addRank(-1))) {
            if (check(document.getElementById(addFile(1)+addRank(-1)).innerHTML)) {
                checkSFX.load()
                checkSFX.play()
                document.getElementById(addFile(1)+addRank(-1)).style.backgroundColor=checked
                checked2=true
                checker=id
                return
            }
            if (empty(document.getElementById(addFile(1)+addRank(-1)).innerHTML)) {
                territoryPush(addFile(1)+addRank(-1))
            }
            if (capturable(document.getElementById(addFile(1)+addRank(-1)).innerHTML)&&(!checked2)) {
                document.getElementById(addFile(1)+addRank(-1)).style.backgroundColor=capture
                capturePush(addFile(1)+addRank(-1))
            }
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
                if (((checked1==true)||(checked2==true))&&((targetFile+targetRank)!=checker)&&(!territoryCheck)) {
                    continue
                }
                const targetId = targetFile + targetRank;
                if (check(document.getElementById(targetId).innerHTML)) {
                    checkSFX.load()
                    checkSFX.play()
                    document.getElementById(targetId).style.backgroundColor=checked
                    if (turn==1) {
                        checked2=true
                    } else {
                        checked1=true
                    }
                    checker=id
                    break
                }
                if (empty(document.getElementById(targetId).innerHTML)) {
                    document.getElementById(targetId).style.backgroundColor = valid;
                    territoryPush(targetId)
                }
                if (capturable(document.getElementById(targetId).innerHTML)) {
                    document.getElementById(targetId).style.backgroundColor = capture;
                    capturePush(targetId)
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
                    if (check(document.getElementById(targetId).innerHTML)) {
                        checkSFX.load()
                        checkSFX.play()
                        document.getElementById(targetId).style.backgroundColor=checked
                        if (turn==1) {
                            checked2=true
                        } else {
                            checked1=true
                        }
                        checker=id
                        break
                    }
                    if (((checked1==true)||(checked2==true))&&((targetFile+targetRank)!=checker)&&(!territoryCheck)) {
                        if (empty(document.getElementById(targetId).innerHTML)) {
                            continue
                        } else {
                            break
                        }
                    }
                    if (check(document.getElementById(targetId).innerHTML)) {
                        checkSFX.load()
                        checkSFX.play()
                        document.getElementById(targetId).style.backgroundColor=checked
                        if (turn==1) {
                            checked2=true
                        } else {
                            checked1=true
                        }
                        checker=id
                        break
                }
                    if (empty(document.getElementById(targetId).innerHTML)) {
                        document.getElementById(targetId).style.backgroundColor = valid;
                        territoryPush(targetId)
                    } else if (capturable(document.getElementById(targetId).innerHTML)) {
                        document.getElementById(targetId).style.backgroundColor = capture
                        capturePush(targetId)
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
                    if (check(document.getElementById(targetId).innerHTML)) {
                        checkSFX.load()
                        checkSFX.play()
                        document.getElementById(targetId).style.backgroundColor=checked
                        if (turn==1) {
                            checked2=true
                        } else {
                            checked1=true
                        }
                        checker=id
                        break
                    }
                    if (((checked1==true)||(checked2==true))&&((targetFile+targetRank)!=checker)&&(!territoryCheck)) {
                        if (empty(document.getElementById(targetId).innerHTML)) {
                            continue
                        } else {
                            break
                        }
                    }
                    if (empty(document.getElementById(targetId).innerHTML)) {
                        document.getElementById(targetId).style.backgroundColor = valid;
                        territoryPush(targetId)
                    } else if (capturable(document.getElementById(targetId).innerHTML)) {
                        document.getElementById(targetId).style.backgroundColor = capture
                        capturePush(targetId)
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
                    if (check(document.getElementById(targetId).innerHTML)) {
                        if (!territoryCheck) {
                            checkSFX.load()
                            checkSFX.play()
                            document.getElementById(targetId).style.backgroundColor=checked
                            if (turn==1) {
                                checked2=true
                            } else {
                                checked1=true
                            }
                            checker=id
                            break
                        } else {
                            blockable=false
                        }
                    }
                    if (((checked1==true)||(checked2==true))&&((targetId)!=checker)&&(!territoryCheck)) {
                        if (empty(document.getElementById(targetId).innerHTML)) {
                            continue
                        } else {
                            break
                        }
                    }
                    if (empty(document.getElementById(targetId).innerHTML)) {
                        document.getElementById(targetId).style.backgroundColor = valid;
                        territoryPush(targetId)
                    } else if (capturable(document.getElementById(targetId).innerHTML)) {
                        // alert(targetId)
                        // if (checkCheck) {
                        //     alert("da one"+targetId)
                        // }
                        document.getElementById(targetId).style.backgroundColor = capture
                        capturePush(targetId)
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
                if (((checked1)||(checked2))&&((targetFile+targetRank)!=checker)&&(!territoryCheck)) {
                    if (territory.includes(targetFile+targetRank)) {
                        continue
                    } else {
                        // alert(territory)
                    }
                }
                const targetId = targetFile + targetRank;
                if ((empty(document.getElementById(targetId).innerHTML))&&(!(territory.includes(targetId)))) {
                    // alert(territory)
                    document.getElementById(targetId).style.backgroundColor = valid;
                    territoryPush(targetId)
                }
                if (capturable(document.getElementById(targetId).innerHTML)) {
                    document.getElementById(targetId).style.backgroundColor = capture;
                    capturePush(targetId)
                }
            }
        }
    }
}
function checkTerritory() {
    try {
        territory=[]
        territoryCheck=true
        if (turn==1){
            for (x of tiles) {
                if (whitePieces.includes(document.getElementById(x).innerHTML)) {
                    // alert(x+"id")
                    checkValidMoves(x)
                }
            }
        } else {
            for (x of tiles) {
                if (blackPieces.includes(document.getElementById(x).innerHTML)) {
                    // alert(document.getElementById(x).innerHTML)
                    checkValidMoves(x)
                }
            }
        }
        // alert(territory)
        territoryCheck=false
    } catch (err) {
        alert(err.stack)
    }
    resetBoard()
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
        if ((checked1&&tile.innerHTML==king1)||(checked2&&tile.innerHTML==king2)) {
            // changeTurn()
            // checkTerritory()
            // changeTurn()
            tile.style.backgroundColor=checked
        } else {
            tile.style.backgroundColor="transparent"
        }
        selected=""
        resetBoard()
    } else if ((tile.style.backgroundColor==valid)||(tile.style.backgroundColor==capture)) {
        if (tile.style.backgroundColor==capture) {
            captureSFX.load()
            captureSFX.play()
        } else {
            moveSFX.load()
            moveSFX.play()
        }
        resetBoard()
        document.getElementById(id).innerHTML=document.getElementById(selected).innerHTML
        if ((selected[1] % 2 == 0)&&(files.indexOf(selected[0]) % 2 == 0)) {
            document.getElementById(selected).innerHTML=white
        } else if ((selected[1] % 2 != 0)&&(files.indexOf(selected[0]) % 2 != 0)) {
            document.getElementById(selected).innerHTML=white
        } else {
            document.getElementById(selected).innerHTML=black
        }
        if (checked1) {
            checked1=false
            for (x of tiles) {
                if (document.getElementById(x).innerHTML==king1) {
                    document.getElementById(x).style.backgroundColor="transparent"
                }
            }
        } else if (checked2) {
            checked2=false
            for (x of tiles) {
                if (document.getElementById(x).innerHTML==king2) {
                    document.getElementById(x).style.backgroundColor="transparent"
                }
            }
        }
        saveBoard()
        checkValidMoves(id)
        resetBoard()
        checkTerritory()
        changeTurn()
    } else {
        resetBoard()
        tile.style.backgroundColor=select
        selected=id
        checkValidMoves(id)
    }
    saveBoard()
}