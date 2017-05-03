"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialState = {
    cats: [],
    dogs: [],
};
function catsReducer(prevState = exports.initialState, action) {
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
exports.catsReducer = catsReducer;
function dogsReducer(prevState = exports.initialState, action) {
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
exports.dogsReducer = dogsReducer;
