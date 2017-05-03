const initialState = {
  cats: [],
};

export default function reducer(prevState=initialState, action: object) {
  const nextState = Object.assign({}, prevState);

  switch (action.type) {
    case 'ADD_CAT': {
      nextState.cats = nextState.cats.concat(action.cat);
      return nextState;
    }
    default: {
      return prevState;
    }
  }
}
