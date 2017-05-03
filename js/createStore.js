"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createStore(reducer) {
    if (typeof reducer !== 'function')
        throw new Error('Reducer must be a function');
    let currentState = reducer(undefined, { type: 'INIT' });
    let subscriptions = [];
    function getState() {
        return currentState;
    }
    function dispatch(action) {
        const nextState = reducer(currentState, action);
        if (nextState !== currentState) {
            subscriptions.forEach(sub => sub());
        }
    }
    function subscribe(subscription) {
        if (typeof subscription !== 'function')
            throw new Error('subscribe expects a function');
        subscriptions.push(subscription);
        return () => {
            subscriptions = subscriptions.filter(sub => sub !== subscription);
        };
    }
    function replaceReducer(reducer) {
    }
    return {
        getState,
        subscribe,
        dispatch,
        replaceReducer,
    };
}
exports.default = createStore;
