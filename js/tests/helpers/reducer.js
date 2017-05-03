"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var initialState = {
    cats: [],
};
function reducer(prevState, action) {
    if (prevState === void 0) { prevState = initialState; }
    var nextState = Object.assign({}, prevState);
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
