"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createStore(reducer, initialState) {
    if (typeof reducer !== 'function')
        throw new Error('Reducer must be a function');
    var currentState = Object.assign({}, initialState, reducer(undefined, {}));
    var subscriptions = [];
    function getState() {
        return currentState;
    }
    function dispatch(action) {
        var nextState = reducer(currentState, action);
        if (nextState !== currentState) {
            subscriptions.forEach(function (sub) { return sub(); });
        }
    }
    function subscribe(subscription) {
        if (typeof subscription !== 'function')
            throw new Error('subscribe expects a function');
        subscriptions.push(subscription);
        return function () {
            subscriptions = subscriptions.filter(function (sub) { return sub !== subscription; });
        };
    }
    function replaceReducer() {
    }
    return {
        getState: getState,
        subscribe: subscribe,
        dispatch: dispatch,
        replaceReducer: replaceReducer,
    };
}
exports.default = createStore;
