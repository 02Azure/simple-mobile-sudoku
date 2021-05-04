const initialState = {
  board: [],
  initialBoard: []
}

export default function reducer(state = initialState, action) {
  const { type, payload } = action

  if(type === "board/set") {
    return { ...state, board: payload }

  } else if(type === "initialBoard/set") { 
    return { ...state, initialBoard: payload }
  }
  
  return state
}