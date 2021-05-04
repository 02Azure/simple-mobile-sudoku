export function setBoard(payload) {
  return { type: "board/set", payload }
}

export function setInitialBoard(payload) {
  return { type: "initialBoard/set", payload }
}

export function getPuzzle(difficulty) {
  return () => {
    return fetch(`https://sugoku.herokuapp.com/board?difficulty=${difficulty}`)
  }
}
