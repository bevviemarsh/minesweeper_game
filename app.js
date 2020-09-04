document.addEventListener("DOMContentLoaded", () => {
  // data part
  const gameValues = {
    basicValues: {
      width: 10,
      bombAmount: 20,
      flags: 0,
      total: 0,
      matches: 0,
      randomUnit: 0.5,
      squares: [],
      isGameOver: false,
    },
    idNames: {
      grid: "grid",
      flagsLeft: "flags-left",
      result: "result",
      reset: "reset",
    },
    classNames: {
      bomb: "bomb",
      valid: "valid",
      checked: "checked",
      flag: "flag",
    },
    attributeNames: {
      id: "id",
      data: "data",
    },
    elements: {
      div: "div",
    },
    events: {
      click: "click",
    },
    emojis: {
      flagEmoji: "🚩",
      bombEmoji: "💣",
    },
    statements: {
      winner: "YOU WIN!",
      looser: "BOOM! Game Over!",
    },
  };

  const {
    basicValues,
    idNames,
    classNames,
    attributeNames,
    elements,
    events,
    emojis,
    statements,
  } = gameValues;
  const { width, randomUnit, squares } = basicValues;
  const { bomb, valid, checked, flag } = classNames;

  const gameActions = {
    getGameElements: function (validName) {
      switch (validName) {
        case idNames.grid:
          return document.querySelector(`#${idNames.grid}`);
        case idNames.flagsLeft:
          return document.querySelector(`#${idNames.flagsLeft}`);
        case idNames.result:
          return document.querySelector(`#${idNames.result}`);
        case elements.div:
          return document.createElement(elements.div);
        case idNames.reset:
          return document.querySelector(`#${idNames.reset}`);
        default:
          break;
      }
    },
    getSquarePosition: {
      getNum0: function (id) {
        return id - 1;
      },
      getNum9: function (id) {
        return id + 1 - basicValues.width;
      },
      getNum10: function (id) {
        return id - basicValues.width;
      },
      getNum11: function (id) {
        return id - 1 - basicValues.width;
      },
      getNum98: function (id) {
        return id + 1;
      },
      getNum90: function (id) {
        return id - 1 + basicValues.width;
      },
      getNum88: function (id) {
        return id + 1 + basicValues.width;
      },
      getNum89: function (id) {
        return id + basicValues.width;
      },
    },
    getSquareById: function (arr, id) {
      return arr[id];
    },
    getFilledArray: function (elementsValue, elementsName) {
      return Array(elementsValue).fill(elementsName);
    },
    getShuffledGameArena: function (arena) {
      return arena.sort(() => Math.random() - randomUnit);
    },
    getClassNameChecked: function (element, className) {
      return element.classList.contains(className);
    },
    getClassNameAdded: function (element, className) {
      return element.classList.add(className);
    },
    getClassNameRemoves: function (element, className) {
      return element.classList.remove(className);
    },
    getGameStatements: function (element, statement) {
      return (element.innerHTML = statement);
    },
    getLeftEdge: function (id) {
      return id % width === 0;
    },
    getRightEdge: function (id) {
      return id % width === width - 1;
    },
    getNewSquare: function (currentId, clickFunction) {
      return clickFunction(document.getElementById(currentId));
    },

    getCurrentId: function (element) {
      return element.id;
    },
    getFlagsLeftOutput: function (flagsLeftValue) {
      this.getGameStatements(
        this.getGameElements(idNames.flagsLeft),
        flagsLeftValue
      );
    },
  };

  const {
    getGameElements,
    getSquarePosition,
    getSquareById,
    getFilledArray,
    getShuffledGameArena,
    getClassNameChecked,
    getClassNameAdded,
    getClassNameRemoves,
    getGameStatements,
    getLeftEdge,
    getRightEdge,
    getNewSquare,
    getCurrentId,
  } = gameActions;
  const {
    getNum0,
    getNum9,
    getNum10,
    getNum11,
    getNum88,
    getNum89,
    getNum90,
    getNum98,
  } = getSquarePosition;

  // game logic part
  function createBoard() {
    getShuffledGameArena(
      getFilledArray(width * width - basicValues.bombAmount, valid).concat(
        getFilledArray(basicValues.bombAmount, bomb)
      )
    ).forEach((element, id) => {
      const square = getGameElements(elements.div);
      square.setAttribute(attributeNames.id, id);
      getClassNameAdded(square, element);
      getGameElements(idNames.grid).appendChild(square);
      squares.push(square);

      square.addEventListener(events.click, function () {
        click(square);
      });

      square.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(square);
      };
    });

    squares.forEach((element, id) => {
      let { total } = basicValues;

      const isLeftEdged = getLeftEdge(id);
      const isRightEdged = getRightEdge(id);

      if (getClassNameChecked(element, valid)) {
        if (
          id > 0 &&
          !isLeftEdged &&
          getClassNameChecked(getSquareById(squares, getNum0(id)), bomb)
        ) {
          total++;
        }

        if (
          id > 9 &&
          !isRightEdged &&
          getClassNameChecked(getSquareById(squares, getNum9(id)), bomb)
        ) {
          total++;
        }

        if (
          id > 10 &&
          getClassNameChecked(getSquareById(squares, getNum10(id)), bomb)
        ) {
          total++;
        }

        if (
          id > 11 &&
          !isLeftEdged &&
          getClassNameChecked(getSquareById(squares, getNum11(id)), bomb)
        ) {
          total++;
        }

        if (
          id < 98 &&
          !isRightEdged &&
          getClassNameChecked(getSquareById(squares, getNum98(id)), bomb)
        ) {
          total++;
        }

        if (
          id < 90 &&
          !isLeftEdged &&
          getClassNameChecked(getSquareById(squares, getNum90(id)), bomb)
        ) {
          total++;
        }

        if (
          id < 88 &&
          !isRightEdged &&
          getClassNameChecked(getSquareById(squares, getNum88(id)), bomb)
        ) {
          total++;
        }

        if (
          id < 89 &&
          getClassNameChecked(getSquareById(squares, getNum89(id)), bomb)
        ) {
          total++;
        }

        element.setAttribute(attributeNames.data, total);
      }
    });

    gameActions.getFlagsLeftOutput(basicValues.bombAmount - basicValues.flags);
  }

  createBoard();

  function addFlag(square) {
    if (basicValues.isGameOver) {
      return;
    }

    if (
      !getClassNameChecked(square, checked) &&
      basicValues.flags < basicValues.bombAmount
    ) {
      if (!getClassNameChecked(square, flag)) {
        getClassNameAdded(square, flag),
          getGameStatements(square, emojis.flagEmoji),
          basicValues.flags++,
          gameActions.getFlagsLeftOutput(
            basicValues.bombAmount - basicValues.flags
          );
        checkForWin();
      } else {
        getClassNameRemoves(square, flag),
          getGameStatements(square, ""),
          basicValues.flags--,
          gameActions.getFlagsLeftOutput(
            basicValues.bombAmount - basicValues.flags
          );
      }
    }
  }

  function click(square) {
    if (basicValues.isGameOver) {
      return;
    }

    if (
      getClassNameChecked(square, checked) ||
      getClassNameChecked(square, flag)
    ) {
      return;
    }

    if (getClassNameChecked(square, bomb)) {
      gameOver();
    } else {
      let total = square.getAttribute(attributeNames.data);
      if (total != 0) {
        getClassNameAdded(square, checked);
        getGameStatements(square, total);
        return;
      }
      checkSquare(square, getCurrentId(square));
    }

    getClassNameAdded(square, checked);
  }

  function checkSquare(square, currentId) {
    const isLeftEdge = getLeftEdge(currentId);
    const isRightEdge = getRightEdge(currentId);

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        getNewSquare(getNum0(parseInt(currentId)), click);
      }

      if (currentId > 9 && !isRightEdge) {
        getNewSquare(getNum9(parseInt(currentId)), click);
      }

      if (currentId > 10) {
        getNewSquare(getNum10(parseInt(currentId)), click);
      }

      if (currentId > 11 && !isLeftEdge) {
        getNewSquare(getNum11(parseInt(currentId)), click);
      }

      if (currentId < 98 && !isRightEdge) {
        getNewSquare(getNum98(parseInt(currentId)), click);
      }

      if (currentId < 90 && !isLeftEdge) {
        getNewSquare(getNum90(parseInt(currentId)), click);
      }

      if (currentId < 88 && !isRightEdge) {
        getNewSquare(getNum88(parseInt(currentId)), click);
      }

      if (currentId < 89) {
        getNewSquare(getNum89(parseInt(currentId)), click);
      }
    }, 10);
  }

  function gameOver() {
    getGameStatements(getGameElements(idNames.result), statements.looser);
    basicValues.isGameOver = true;

    squares.forEach((square) => {
      if (getClassNameChecked(square, bomb)) {
        getGameStatements(square, emojis.bombEmoji);
        getClassNameRemoves(square, bomb);
        getClassNameAdded(square, checked);
      }
    });
  }

  function checkForWin() {
    let { matches } = basicValues;

    for (let i = 0; i < squares.length; i++) {
      if (
        getClassNameChecked(squares[i], flag) &&
        getClassNameChecked(squares[i], bomb)
      ) {
        matches++;
      }

      if (matches === basicValues.bombAmount) {
        getGameStatements(getGameElements(idNames.result), statements.winner);
        basicValues.isGameOver = true;
      }
    }
  }

  function startNewGame() {
    basicValues.isGameOver = false;
    basicValues.squares.length = 0;
    basicValues.flags = 0;
    getGameStatements(getGameElements(idNames.result), "");
    getGameElements(idNames.grid).innerHTML = "";
    createBoard();
  }

  getGameElements(idNames.reset).addEventListener("click", startNewGame);
});
