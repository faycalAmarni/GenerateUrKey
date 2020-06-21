const initialState = { reduxKeys: []  }

function toggleKeys(state = initialState, action) {

  let nextState
  switch (action.type) {

    case 'FIRST_INSERT':

        nextState = {
          ...state,
          reduxKeys: action.value
        }
        return nextState || state

    case 'ADD_KEY':

        nextState = {
          ...state,
          reduxKeys: [...state.reduxKeys, action.value]
        }
        return nextState || state

    case 'DELETE_KEY':
        nextState = {
          ...state,
          reduxKeys: state.reduxKeys.filter((item) => item.id !==  action.value.id)
        }
        return nextState || state

    default:
        return state
  }
}

export default toggleKeys
