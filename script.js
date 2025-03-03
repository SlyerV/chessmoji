// Fetching Emoji List from Unicode
let emojiList = [];
const regIndicators = [
    '🇦', '🇧', '🇨', '🇩', '🇪', '🇫',
    '🇬', '🇭', '🇮', '🇯', '🇰', '🇱',
    '🇲', '🇳', '🇴', '🇵', '🇶', '🇷',
    '🇸', '🇹', '🇺', '🇻', '🇼', '🇽',
    '🇾', '🇿'
]
const disallowedChars=["🏻","🏼","🏽","🏾","🏿", "�", "‍", "♂","♀‍", "🦰","🦱","🦳","🦲","️"]
function isEmoji(str) {
    const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
    return emojiRegex.test(str);
}
function sliceColumn() {
    return new Promise((resolve, reject) => {
        fetch('emoji-list.txt')
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n');
                rows.map(row => {
                    const columns = row.split('\t');
                    const roww = columns[0];
                    let emoji = roww.slice(79,81).trim()
                    if (isEmoji(emoji)&&(!disallowedChars.includes(emoji))&&(!regIndicators.includes(emoji)))
                        emojiList.push(roww.slice(79, 81));
                });
                resolve(); // Resolve the promise when done
            })
            .catch(error => {
                console.error('Error:', error);
                reject(error); // Reject the promise on error
            });
    });
}

sliceColumn().then(() => {
});

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
let rook1 = "💂🏻"
let knight1 = "🧝🏻"
let bishop1 = "🧙🏻"
let queen1 = "👸🏻"
let king1 = "🤴🏻"
let pawn1 = "👆🏻"
let rook2 = "💂🏿"
let knight2 = "🧝🏿"
let bishop2 = "🧙🏿"
let queen2 = "👸🏿"
let king2 = "🤴🏿"
let pawn2 = "👇🏿"
let black = "⬛"
let white = "⬜"
let whitePieces = [rook1,knight1,bishop1,queen1,king1,pawn1]
let blackPieces = [rook2,knight2,bishop2,queen2,king2,pawn2]
let pieceValueChange = {
    "cPawn1": function(n) {
        pawn1=n
    },
    "cPawn2": function(n) {
        pawn2=n
    },
    "cRook1": function(n) {
        rook1=n
    },
    "cRook2": function(n) {
        rook2=n
    },
    "cKnight1": function(n) {
        knight1=n
    },
    "cKnight2": function(n) {
        knight2=n
    },
    "cBishop1": function(n) {
        bishop1=n
    },
    "cBishop2": function(n) {
        bishop2=n
    },
    "cQueen1": function(n) {
        queen1=n
    },
    "cQueen2": function(n) {
        queen2=n
    },
    "cKing1": function(n) {
        king1=n
    },
    "cKing2": function(n) {
        king2=n
    }
}
let pieceMap = {
    "cPawn1": pawn1,
    "cPawn2": pawn2,
    "cRook1": rook1,
    "cRook2": rook2,
    "cKnight1": knight1,
    "cKnight2": knight2,
    "cBishop1": bishop1,
    "cBishop2": bishop2,
    "cQueen1": queen1,
    "cQueen2": queen2,
    "cKing1": king1,
    "cKing2": king2
}
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
const randomizeSFX = new Audio("./sfx/notify.mp3")
// Other Vars
let selected=""
let checked1=false
let checked2=false
let checkline=false
let checktiles=[]
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
let checkPath = "transparent"
// Functions
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
function copy(str) {
    navigator.clipboard.writeText(str)
} 
function saveBoard() {
    board = []
    for (x of tiles) {
        board.push(document.getElementById(x).innerHTML)
    }
    whitePieces = [rook1,knight1,bishop1,queen1,king1,pawn1]
    blackPieces = [rook2,knight2,bishop2,queen2,king2,pawn2]
    pieceMap = {
        "cPawn1": pawn1,
        "cPawn2": pawn2,
        "cRook1": rook1,
        "cRook2": rook2,
        "cKnight1": knight1,
        "cKnight2": knight2,
        "cBishop1": bishop1,
        "cBishop2": bishop2,
        "cQueen1": queen1,
        "cQueen2": queen2,
        "cKing1": king1,
        "cKing2": king2
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
    for (x of checktiles) {
        if ((!((document.getElementById(x).innerHTML==king1)&&(checked1)))&&(!((document.getElementById(x).innerHTML==king2)&&(checked2)))) {
            document.getElementById(x).style.backgroundColor=checkPath
        }

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
    checkline=false
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
                    return
                } else {
                    blockable=false
                }
            }
            if (empty(document.getElementById(addFile(-1)+addRank(1)).innerHTML)) {
                territoryPush(addFile(-1)+addRank(1))
            }
            if (capturable(document.getElementById(addFile(-1)+addRank(1)).innerHTML)) {
                if (!checked1) {
                    document.getElementById(addFile(-1)+addRank(1)).style.backgroundColor=capture
                    capturePush(addFile(-1)+addRank(1))
                } else if ((addFile(-1)+addRank(1))==checker) {
                    document.getElementById(addFile(-1)+addRank(1)).style.backgroundColor=capture
                    capturePush(addFile(-1)+addRank(1))
                }
            }
        }
        if (tiles.includes(addFile(1)+addRank(1))) {
            if (check(document.getElementById(addFile(1)+addRank(1)).innerHTML)) {
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
                    return
                } else {
                    blockable=false
                }
            }
            if (empty(document.getElementById(addFile(1)+addRank(1)).innerHTML)) {
                territoryPush(addFile(1)+addRank(1))
            }
            if (capturable(document.getElementById(addFile(1)+addRank(1)).innerHTML)) {
                if (!checked1) {
                    document.getElementById(addFile(1)+addRank(1)).style.backgroundColor=capture
                    capturePush(addFile(1)+addRank(1))
                } else if ((addFile(1)+addRank(1))==checker) {
                    document.getElementById(addFile(1)+addRank(1)).style.backgroundColor=capture
                    capturePush(addFile(1)+addRank(1))
                }
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
                    return
                } else {
                    blockable=false
                }
            }
            if (empty(document.getElementById(addFile(-1)+addRank(-1)).innerHTML)) {
                territoryPush(addFile(-1)+addRank(-1))
            }
            if (capturable(document.getElementById(addFile(-1)+addRank(-1)).innerHTML)) {
                if (!checked2) {
                    document.getElementById(addFile(-1)+addRank(-1)).style.backgroundColor=capture
                    capturePush(addFile(-1)+addRank(-1))
                } else if ((addFile(-1)+addRank(-1))==checker) {
                    document.getElementById(addFile(-1)+addRank(-1)).style.backgroundColor=capture
                    capturePush(addFile(-1)+addRank(-1))
                }
            }
        }
        if (tiles.includes(addFile(1)+addRank(-1))) {
            if (check(document.getElementById(addFile(1)+addRank(-1)).innerHTML)) {
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
                    return
                } else {
                    blockable=false
                }
            }
            if (empty(document.getElementById(addFile(1)+addRank(-1)).innerHTML)) {
                territoryPush(addFile(1)+addRank(-1))
            }
            if (capturable(document.getElementById(addFile(1)+addRank(-1)).innerHTML)) {
                if (!checked2) {
                    document.getElementById(addFile(1)+addRank(-1)).style.backgroundColor=capture
                    capturePush(addFile(1)+addRank(-1))
                } else if ((addFile(1)+addRank(-1))==checker) {
                    document.getElementById(addFile(1)+addRank(-1)).style.backgroundColor=capture
                    capturePush(addFile(1)+addRank(-1))
                } else {
                    alert((addFile(1)+addRank(-1)))
                    alert(checker)
                }
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
                if (((checked1==true)||(checked2==true))&&((targetFile+targetRank)!=checker)&&(!territoryCheck)&&(!(checktiles.includes(document.getElementById(targetFile+targetRank).id)))) {
                    continue
                }
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
            let testTiles=[]
            for (const move of dir) {
                const [targetFile, targetRank] = move;
                if (tiles.includes(targetFile + targetRank)) {
                    const targetId = targetFile + targetRank;
                    testTiles.push(targetId)
                    if (check(document.getElementById(targetId).innerHTML)) {
                        checkline=true
                        checktiles=testTiles
                        for (x of checktiles) {
                            document.getElementById(x).style.backgroundColor=checkPath
                        }
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
                    if (((checked1==true)||(checked2==true))&&((targetFile+targetRank)!=checker)&&(!territoryCheck)&&(!(checktiles.includes(document.getElementById(targetFile+targetRank).id)))) {
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
            let testTiles=[]
            for (const move of dir) {
                const [targetFile, targetRank] = move;
                if (tiles.includes(targetFile + targetRank)) {
                    const targetId = targetFile + targetRank;
                    testTiles.push(targetId)
                    if (check(document.getElementById(targetId).innerHTML)) {
                        checkline=true
                        checktiles=testTiles
                        for (x of checktiles) {
                            document.getElementById(x).style.backgroundColor=checkPath
                        }
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
                    if (((checked1==true)||(checked2==true))&&((targetFile+targetRank)!=checker)&&(!territoryCheck)&&(!(checktiles.includes(document.getElementById(targetFile+targetRank).id)))) {
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
            let testTiles=[]
            for (const move of dir) {
                const [targetFile, targetRank] = move;
                if (tiles.includes(targetFile + targetRank)) {
                    const targetId = targetFile + targetRank;
                    testTiles.push(targetId)
                    if (check(document.getElementById(targetId).innerHTML)) {
                        checkline=true
                        checktiles=testTiles
                        for (x of checktiles) {
                            document.getElementById(x).style.backgroundColor=checkPath
                        }
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
                    if (((checked1==true)||(checked2==true))&&((targetFile+targetRank)!=checker)&&(!territoryCheck)&&(!(checktiles.includes(document.getElementById(targetFile+targetRank).id)))) {
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
                if ((document.getElementById(x).innerHTML==king1)||(checktiles.includes(document.getElementById(x).id))) {
                    document.getElementById(x).style.backgroundColor="transparent"
                }
            }
            checktiles=[]
        } else if (checked2) {
            checked2=false
            for (x of tiles) {
                if ((document.getElementById(x).innerHTML==king2)||(checktiles.includes(document.getElementById(x).id))) {
                    document.getElementById(x).style.backgroundColor="transparent"
                }
            }
            checktiles=[]
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
// Emoji Customization
const pieceList = ["cPawn1","cPawn2","cKnight1","cKnight2","cBishop1","cBishop2","cRook1","cRook2","cQueen1","cQueen2","cKing1","cKing2"]
for (let p of pieceList) {
    document.getElementById(p).addEventListener('input', function(event) {
        // alert(p)
        const inp = event.target.value
        let emoji = 0
        for (x of inp) {
            // Makes sure character is not a skin tone modifier, ZWJ, gender modifier, hair modifier, etc.
            const disallowed=["🏻","🏼","🏽","🏾","🏿", "�", "‍", "♂","♀‍", "🦰","🦱","🦳","🦲","️"]
            if (isEmoji(x)&&(!disallowed.includes(x))) {
                // alert(x)
                // alert(emoji)
                // copy(x)
                emoji+=1
            } else if ((!isEmoji(x))&&(!disallowed.includes(x))) {
                // alert(x)
                // copy(x)
                emoji=0
                break
            }
        }
        let index1 = whitePieces.indexOf(pieceMap[p]);
        let index2 = blackPieces.indexOf(pieceMap[p]);
        let rWhitePieces=whitePieces
        let rBlackPieces=blackPieces
        if (index1 > -1) { // Check if the element exists in the array
            rWhitePieces.splice(index1, 1);
        }
        if (index2 > -1) {
            rBlackPieces.splice(index2, 1);
        }
        if (isEmoji(inp) && (emoji == 1) && (!rWhitePieces.includes(inp)) && (!rBlackPieces.includes(inp))) {
                try {
                    for (x of tiles) {
                        if (document.getElementById(x).innerHTML==pieceMap[p]) {
                            document.getElementById(x).innerHTML=inp
                        }
                    }
                    pieceValueChange[p](inp)
                    document.getElementById(p).style.backgroundColor="#b3ffb3"
                    saveBoard()
                } catch(err){
                    alert(err)
                }
        } else {
            document.getElementById(p).style.backgroundColor="red"
        }
    });
    // document.getElementById(p).addEventListener('focus', function() {
    //     const inp = document.getElementbyId(p)
    //     if (inp.style.backgroundColor=="#b3ffb3") {
    //         inp.style.backgroundColor="#ccffcc"
    //     } else if (inp.style.backgroundColor=="red") {
    //         inp.style.backgroundColor="#ff1a1a"
    //     }
    // });
}
function randomizeEmojis() {
    randomizeSFX.load()
    randomizeSFX.play()
    const emojis = document.getElementsByClassName("emoji")
    for (let x = 0; x < emojis.length; x++) {
        const emoji = emojis[x]
        let randomList = []
        for (let y=0; y<=pieceList.length;y++) {
            while (true) {
                let x = emojiList[Math.floor(Math.random()*emojiList.length)];
                if (randomList.includes(x)) {
                    continue
                }
                randomList.push(x)
                emoji.value=x
                break
            }
        }
        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true
        });
        emoji.dispatchEvent(inputEvent);
    }
}