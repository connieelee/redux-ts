"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const initialState = {
    cats: [],
};
function reducer(prevState = initialState, action) {
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
exports.default = reducer;
