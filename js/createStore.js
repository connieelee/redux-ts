"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createStore(reducer, preloadedState, enhancer) {
    if (typeof reducer !== 'function') {
        throw new TypeError('Expected enhancer to be a function.');
    }
    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
        enhancer = preloadedState;
        preloadedState = undefined;
    }
    if (typeof enhancer !== 'undefined') {
        if (typeof enhancer !== 'function') {
            throw new TypeError('Expected enhancer to be a function.');
        }
        const enhancedCreateStore = enhancer(createStore);
        return enhancedCreateStore(reducer, preloadedState);
    }
    let currentState = reducer(preloadedState, { type: 'INIT' });
    let subscriptions = [];
    function getState() {
        return currentState;
    }
    function dispatch(action) {
        const nextState = reducer(currentState, action);
        if (nextState !== currentState) {
            currentState = nextState;
            subscriptions.forEach(sub => sub());
        }
    }
    function subscribe(subscription) {
        if (typeof subscription !== 'function') {
            throw new TypeError('subscribe expects a function');
        }
        subscriptions.push(subscription);
        return () => {
            const index = subscriptions.indexOf(subscription);
            subscriptions.splice(index, 1);
        };
    }
    function replaceReducer(nextReducer) {
        if (typeof nextReducer !== 'function') {
            throw new TypeError('replaceReducer expects a function');
        }
        reducer = nextReducer;
    }
    return {
        getState,
        subscribe,
        dispatch,
        replaceReducer,
    };
}
exports.default = createStore;
