import { Action } from '../../types';

const initialState = {
  cats: [],
};

export default function reducer(prevState=initialState, action: Action) {
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
