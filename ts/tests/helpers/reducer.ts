import { Action } from '../../types';

export const initialState = {
  cats: [],
  dogs: [],
};

export function catsReducer(prevState=initialState, action: Action) {
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

export function dogsReducer(prevState=initialState, action: Action) {
  const nextState = Object.assign({}, prevState);

  switch (action.type) {
    case 'ADD_DOG': {
      nextState.dogs = nextState.dogs.concat(action.dog);
      return nextState;
    }
    default: {
      return prevState;
    }
  }
}
